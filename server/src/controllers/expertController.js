const Problem = require('../models/Problem');
const Response = require('../models/Response');
const StatusHistory = require('../models/StatusHistory');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { findSimilarSolvedCases } = require('../services/similarCaseService');

// Allowed status transitions for experts
const VALID_EXPERT_TRANSITIONS = {
  ASSIGNED: ['UNDER_REVIEW', 'AWAITING_FARMER_INFORMATION', 'RESPONSE_PROVIDED', 'AWAITING_FARMER_INFO'],
  UNDER_REVIEW: ['AWAITING_FARMER_INFORMATION', 'AWAITING_FARMER_INFO', 'RESPONSE_PROVIDED', 'RESOLVED'],
  AWAITING_FARMER_INFORMATION: ['UNDER_REVIEW', 'RESPONSE_PROVIDED', 'RESOLVED'],
  AWAITING_FARMER_INFO: ['UNDER_REVIEW', 'RESPONSE_PROVIDED', 'RESOLVED'],
  RESPONSE_PROVIDED: ['RESOLVED', 'UNDER_REVIEW', 'AWAITING_FARMER_INFORMATION', 'AWAITING_FARMER_INFO'],
  RESOLVED: ['REOPENED'],
  REOPENED: ['UNDER_REVIEW'],
};

// GET /api/v1/expert/problems
const getAssignedProblems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const skip = (page - 1) * limit;

    const query = { assignedExpertId: req.user._id };

    if (req.query.status) {
      if (req.query.status === 'AWAITING_FARMER_INFO') {
        query.status = { $in: ['AWAITING_FARMER_INFORMATION', 'AWAITING_FARMER_INFO'] };
      } else {
        query.status = req.query.status;
      }
    }
    if (req.query.cropId) {
      query.cropId = req.query.cropId;
    }
    if (req.query.categoryId) {
      query.categoryId = req.query.categoryId;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { reportNumber: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { 'location.district': searchRegex },
      ];
    }

    const [problems, totalItems] = await Promise.all([
      Problem.find(query)
        .populate('farmerId', 'fullName phone location')
        .populate('cropId', 'name localNames')
        .populate('categoryId', 'name')
        .sort({ lastActivityAt: -1, submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Problem.countDocuments(query),
    ]);

    for (const p of problems) {
      if (p.farmerId && !p.farmerId.name) {
        p.farmerId.name = p.farmerId.fullName;
      }
      if (p.imageAttachments && (!p.images || p.images.length === 0)) {
        p.images = p.imageAttachments;
      }
      if (p.images && (!p.imageAttachments || p.imageAttachments.length === 0)) {
        p.imageAttachments = p.images;
      }
    }

    res.status(200).json({
      success: true,
      data: problems,
      problems: problems,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/expert/problems/:id
const getExpertCaseDetail = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('farmerId', 'fullName phone email location')
      .populate('cropId', 'name localNames season description')
      .populate('categoryId', 'name description icon')
      .populate('assignedExpertId', 'fullName designation institution rating expertise');

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem report not found.' },
      });
    }

    // Check assignment authorization: must be assigned to this expert (or admin)
    const assignedId = problem.assignedExpertId?._id
      ? problem.assignedExpertId._id.toString()
      : problem.assignedExpertId
      ? problem.assignedExpertId.toString()
      : null;

    if (
      req.user.role === 'expert' &&
      (!assignedId || assignedId !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are not assigned to this case dossier.' },
      });
    }

    const [responses, statusHistory] = await Promise.all([
      Response.find({ problemId: problem._id })
        .populate('authorId', 'fullName role designation institution')
        .sort({ createdAt: 1 })
        .lean(),
      StatusHistory.find({ problemId: problem._id })
        .populate('changedBy', 'fullName role designation')
        .sort({ createdAt: 1 })
        .lean(),
    ]);

    const problemObj = problem.toObject();
    if (problemObj.farmerId && !problemObj.farmerId.name) {
      problemObj.farmerId.name = problemObj.farmerId.fullName;
    }
    if (problemObj.imageAttachments && (!problemObj.images || problemObj.images.length === 0)) {
      problemObj.images = problemObj.imageAttachments;
    }
    if (problemObj.images && (!problemObj.imageAttachments || problemObj.imageAttachments.length === 0)) {
      problemObj.imageAttachments = problemObj.images;
    }
    problemObj.responses = responses;
    problemObj.statusHistory = statusHistory;

    res.status(200).json({
      success: true,
      data: {
        problem: problemObj,
        responses,
        statusHistory,
      },
      problem: problemObj,
      responses,
      statusHistory,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/expert/problems/:id/responses
const createExpertResponse = async (req, res, next) => {
  try {
    let {
      responseType,
      message,
      observations,
      diagnosis,
      recommendations,
      immediateAction,
      requestedInformation,
      precautionaryNotes,
      precautions,
      preventiveMeasures,
      status: targetStatus,
    } = req.body;

    if (!observations && diagnosis) {
      observations = diagnosis;
    }
    if (!recommendations && immediateAction) {
      recommendations = immediateAction;
    }
    if (!precautionaryNotes && (precautions || preventiveMeasures)) {
      precautionaryNotes = precautions || preventiveMeasures;
    }

    // Fallback message from recommendations, observations, diagnosis, or requestedInformation
    if (!message) {
      if (typeof recommendations === 'string' && recommendations.trim()) {
        message = recommendations.trim();
      } else if (Array.isArray(recommendations) && recommendations.length > 0) {
        message = recommendations.map((r) => String(r).trim()).filter(Boolean).join('\n');
      } else if (observations && observations.trim()) {
        message = observations.trim();
      } else if (requestedInformation && requestedInformation.trim()) {
        message = requestedInformation.trim();
      }
    }

    // Normalize targetStatus
    if (targetStatus === 'AWAITING_FARMER_INFO') {
      targetStatus = 'AWAITING_FARMER_INFORMATION';
    }

    // Default responseType if missing
    if (!responseType) {
      if (
        targetStatus === 'AWAITING_FARMER_INFORMATION' ||
        requestedInformation
      ) {
        responseType = 'INFORMATION_REQUEST';
      } else {
        responseType = 'EXPERT_RECOMMENDATION';
      }
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Response type and message content or recommendations are required.',
        },
      });
    }

    if (!['EXPERT_RECOMMENDATION', 'INFORMATION_REQUEST'].includes(responseType)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_RESPONSE_TYPE',
          message: 'Allowed response types: EXPERT_RECOMMENDATION or INFORMATION_REQUEST.',
        },
      });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem report not found.' },
      });
    }

    if (
      req.user.role === 'expert' &&
      (!problem.assignedExpertId ||
        problem.assignedExpertId.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are not assigned to this case.' },
      });
    }

    // Normalize recommendations array
    const recsArray = Array.isArray(recommendations)
      ? recommendations.map((r) => String(r).trim()).filter(Boolean)
      : typeof recommendations === 'string' && recommendations.trim()
      ? recommendations.split('\n').map((r) => r.trim()).filter(Boolean)
      : [];

    // Save expert response
    const newResponse = await Response.create({
      problemId: problem._id,
      authorId: req.user._id,
      responseType,
      message: message.trim(),
      observations: observations ? observations.trim() : undefined,
      recommendations: recsArray,
      requestedInformation: requestedInformation ? requestedInformation.trim() : undefined,
      precautionaryNotes: precautionaryNotes ? precautionaryNotes.trim() : undefined,
    });

    const previousStatus = problem.status;
    let newStatus = problem.status;

    if (
      targetStatus &&
      ['UNDER_REVIEW', 'AWAITING_FARMER_INFORMATION', 'RESPONSE_PROVIDED', 'RESOLVED'].includes(
        targetStatus
      )
    ) {
      newStatus = targetStatus;
    } else if (responseType === 'INFORMATION_REQUEST') {
      newStatus = 'AWAITING_FARMER_INFORMATION';
    } else if (responseType === 'EXPERT_RECOMMENDATION') {
      newStatus = 'RESPONSE_PROVIDED';
    }

    if (newStatus === 'RESOLVED' && previousStatus !== 'RESOLVED') {
      problem.resolvedAt = new Date();
      problem.resolutionNotes =
        message || 'Case successfully resolved with specialist treatment protocol.';
      await User.findByIdAndUpdate(req.user._id, { $inc: { solvedCasesCount: 1 } });
    }

    if (newStatus !== previousStatus) {
      problem.status = newStatus;
      await StatusHistory.create({
        problemId: problem._id,
        previousStatus,
        newStatus,
        changedBy: req.user._id,
        reason:
          newStatus === 'RESOLVED'
            ? 'Case resolved with specialist advisory protocol.'
            : responseType === 'INFORMATION_REQUEST'
            ? 'Expert requested additional field diagnostic details.'
            : 'Expert issued agricultural advisory and guidance.',
      });
    }

    problem.lastActivityAt = new Date();
    await problem.save();

    // Send in-app notification to the cultivator
    await Notification.create({
      recipientId: problem.farmerId,
      problemId: problem._id,
      type:
        newStatus === 'RESOLVED'
          ? 'REPORT_RESOLVED'
          : responseType === 'INFORMATION_REQUEST'
          ? 'INFORMATION_REQUESTED'
          : 'RESPONSE_ADDED',
      title:
        newStatus === 'RESOLVED'
          ? 'Case Resolved'
          : responseType === 'INFORMATION_REQUEST'
          ? 'Information Requested by Expert'
          : 'Expert Advisory Received',
      message: `${req.user.fullName} (${req.user.designation || 'Agricultural Specialist'}) responded to Case ${problem.reportNumber}`,
      link: `/farmer/reports`,
    });

    res.status(201).json({
      success: true,
      data: {
        response: newResponse,
        currentStatus: problem.status,
      },
      message: 'Expert response submitted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/expert/problems/:id/status
const updateCaseStatus = async (req, res, next) => {
  try {
    let { status: targetStatus, reason, resolutionNotes } = req.body;

    if (!targetStatus) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Target status is required.' },
      });
    }

    // Normalize enum
    if (targetStatus === 'AWAITING_FARMER_INFO') {
      targetStatus = 'AWAITING_FARMER_INFORMATION';
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem report not found.' },
      });
    }

    if (
      req.user.role === 'expert' &&
      (!problem.assignedExpertId ||
        problem.assignedExpertId.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are not assigned to this case.' },
      });
    }

    // Validate transition
    const allowedNext = VALID_EXPERT_TRANSITIONS[problem.status] || [];
    if (!allowedNext.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS_TRANSITION',
          message: `Cannot transition status from ${problem.status} to ${targetStatus}. Allowed: [${allowedNext.join(', ')}]`,
        },
      });
    }

    const previousStatus = problem.status;
    problem.status = targetStatus;
    problem.lastActivityAt = new Date();

    if (targetStatus === 'RESOLVED') {
      problem.resolvedAt = new Date();
      problem.resolutionNotes = resolutionNotes
        ? resolutionNotes.trim()
        : reason || 'Case successfully resolved with specialist treatment protocol.';
      // Update expert solved count
      await User.findByIdAndUpdate(req.user._id, { $inc: { solvedCasesCount: 1 } });
    }

    await problem.save();

    await StatusHistory.create({
      problemId: problem._id,
      previousStatus,
      newStatus: targetStatus,
      changedBy: req.user._id,
      reason: reason || resolutionNotes || `Status updated to ${targetStatus}`,
    });

    // Notify farmer
    await Notification.create({
      recipientId: problem.farmerId,
      problemId: problem._id,
      type: targetStatus === 'RESOLVED' ? 'REPORT_RESOLVED' : 'STATUS_CHANGED',
      title: targetStatus === 'RESOLVED' ? 'Case Resolved' : 'Case Status Updated',
      message: `Your Case ${problem.reportNumber} status was updated to ${targetStatus}.`,
      link: `/farmer/reports`,
    });

    res.status(200).json({
      success: true,
      data: {
        problemId: problem._id,
        reportNumber: problem.reportNumber,
        previousStatus,
        currentStatus: problem.status,
      },
      message: `Case status successfully updated to ${targetStatus}.`,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/expert/problems/:id/similar-cases
const getSimilarCases = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);
    const similarData = await findSimilarSolvedCases(req.params.id, limit);

    res.status(200).json({
      success: true,
      data: {
        ...similarData,
        similarCases: similarData.candidates || [],
      },
      similarCases: similarData.candidates || [],
      candidates: similarData.candidates || [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignedProblems,
  getExpertCaseDetail,
  createExpertResponse,
  updateCaseStatus,
  getSimilarCases,
};

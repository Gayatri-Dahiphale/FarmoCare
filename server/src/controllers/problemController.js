const Problem = require('../models/Problem');
const Crop = require('../models/Crop');
const ProblemCategory = require('../models/ProblemCategory');
const Response = require('../models/Response');
const StatusHistory = require('../models/StatusHistory');
const Notification = require('../models/Notification');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Generate unique collision-resistant report number
 */
const generateReportNumber = async () => {
  const currentYear = new Date().getFullYear();
  const count = await Problem.countDocuments();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `FPR-${currentYear}-${(count + 1).toString().padStart(4, '0')}-${randomSuffix}`;
};

// POST /api/v1/problems
const createProblem = async (req, res, next) => {
  try {
    const {
      title,
      cropId,
      categoryId,
      description,
      problemStartDate,
    } = req.body;

    const district = req.body.district || req.body.location?.district;
    const village = req.body.village || req.body.location?.village;
    const state = req.body.state || req.body.location?.state || 'Maharashtra';
    const latitude = req.body.latitude || req.body.location?.latitude;
    const longitude = req.body.longitude || req.body.location?.longitude;
    const affectedArea = req.body.affectedArea || req.body.affectedAreaAcre;
    const growthStage = req.body.growthStage || req.body.cropStage;

    if (!title || !cropId || !categoryId || !description || !district) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title, crop, problem category, description, and district are required.',
        },
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cropId)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid crop selection.' },
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid problem category selection.' },
      });
    }

    const [cropDoc, categoryDoc] = await Promise.all([
      Crop.findById(cropId),
      ProblemCategory.findById(categoryId),
    ]);

    if (!cropDoc) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Selected crop does not exist.' },
      });
    }

    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Selected problem category does not exist.' },
      });
    }

    const reportNumber = await generateReportNumber();

    // Process uploaded images
    const imageAttachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        imageAttachments.push({
          url: file.url || `/uploads/${file.filename}`,
          storageKey: file.filename,
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        });
      }
    }

    const problem = await Problem.create({
      reportNumber,
      farmerId: req.user._id,
      title: title.trim(),
      cropId,
      categoryId,
      description: description.trim(),
      location: {
        village: village ? village.trim() : '',
        district: district.trim(),
        state: state ? state.trim() : 'Maharashtra',
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      },
      problemStartDate: problemStartDate ? new Date(problemStartDate) : undefined,
      affectedArea: affectedArea != null ? String(affectedArea).trim() : undefined,
      growthStage: growthStage != null ? String(growthStage).trim() : undefined,
      imageAttachments,
      status: 'SUBMITTED',
      submittedAt: new Date(),
      lastActivityAt: new Date(),
    });

    // Record initial status history
    await StatusHistory.create({
      problemId: problem._id,
      previousStatus: null,
      newStatus: 'SUBMITTED',
      changedBy: req.user._id,
      reason: 'Initial report submission by cultivator.',
    });

    // Notify administrators
    const admins = await User.find({ role: 'admin', accountStatus: 'active' });
    for (const admin of admins) {
      await Notification.create({
        recipientId: admin._id,
        problemId: problem._id,
        type: 'REPORT_SUBMITTED',
        title: 'New Incident Reported',
        message: `New problem ${reportNumber} submitted: ${title}`,
        link: `/admin/unassigned`,
      });
    }

    // Populate crop and category for the response
    await problem.populate('cropId categoryId');

    res.status(201).json({
      success: true,
      data: {
        problem,
      },
      message: 'Agricultural problem report submitted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/problems/my
const getMyProblems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const query = { farmerId: req.user._id };

    if (req.query.status) {
      query.status = req.query.status;
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
      ];
    }

    const [problems, totalItems] = await Promise.all([
      Problem.find(query)
        .populate('cropId', 'name localNames')
        .populate('categoryId', 'name')
        .populate('assignedExpertId', 'fullName designation institution rating')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Problem.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: problems,
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

// GET /api/v1/problems/:id
const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .populate('farmerId', 'fullName phone email location')
      .populate('cropId', 'name localNames season')
      .populate('categoryId', 'name description icon')
      .populate('assignedExpertId', 'fullName designation institution rating expertise');

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem report not found.' },
      });
    }

    // Authorization check: farmer can only view their own report; expert/admin can view assigned/any
    if (
      req.user.role === 'farmer' &&
      problem.farmerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You are not authorized to view this report.' },
      });
    }

    const [responses, statusHistory] = await Promise.all([
      Response.find({ problemId: problem._id })
        .populate('authorId', 'fullName name role designation institution')
        .sort({ createdAt: 1 })
        .lean(),
      StatusHistory.find({ problemId: problem._id })
        .populate('changedBy', 'fullName name role designation')
        .sort({ createdAt: 1 })
        .lean(),
    ]);

    const problemObj = problem.toObject();
    if (problemObj.farmerId && !problemObj.farmerId.name) {
      problemObj.farmerId.name = problemObj.farmerId.fullName;
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

// GET /api/v1/problems/:id/responses
const getProblemResponses = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem report not found.' },
      });
    }

    if (
      req.user.role === 'farmer' &&
      problem.farmerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied.' },
      });
    }

    const responses = await Response.find({ problemId: problem._id })
      .populate('authorId', 'fullName name role designation institution')
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: responses,
      responses,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/problems/:id/follow-ups
const createFollowUp = async (req, res, next) => {
  try {
    const rawMessage = req.body.message || req.body.question;
    const { issuePersists } = req.body;

    if (!rawMessage || String(rawMessage).trim() === '') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Follow-up message cannot be empty.' },
      });
    }
    const message = String(rawMessage).trim();

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem report not found.' },
      });
    }

    // Ownership check: only report owner can submit farmer follow-up
    if (problem.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Only the submitting farmer can add follow-ups.' },
      });
    }

    // Process any uploaded follow-up images
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        attachments.push({
          url: file.url || `/uploads/${file.filename}`,
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        });
      }
    }

    const followUp = await Response.create({
      problemId: problem._id,
      authorId: req.user._id,
      responseType: 'FARMER_FOLLOW_UP',
      message: message.trim(),
      issuePersists: issuePersists === undefined ? true : Boolean(issuePersists),
      attachments,
    });

    // If case was awaiting farmer information, transition to UNDER_REVIEW
    let statusChanged = false;
    if (problem.status === 'AWAITING_FARMER_INFORMATION') {
      problem.status = 'UNDER_REVIEW';
      statusChanged = true;

      await StatusHistory.create({
        problemId: problem._id,
        previousStatus: 'AWAITING_FARMER_INFORMATION',
        newStatus: 'UNDER_REVIEW',
        changedBy: req.user._id,
        reason: 'Farmer provided requested clarification.',
      });
    }

    problem.lastActivityAt = new Date();
    await problem.save();

    // Notify assigned expert
    if (problem.assignedExpertId) {
      await Notification.create({
        recipientId: problem.assignedExpertId,
        problemId: problem._id,
        type: 'FARMER_FOLLOW_UP',
        title: 'Farmer Follow-up Received',
        message: `Farmer added follow-up on Case ${problem.reportNumber}`,
        link: `/expert/cases/${problem._id}`,
      });
    }

    res.status(201).json({
      success: true,
      data: {
        followUp,
        currentStatus: problem.status,
      },
      message: 'Follow-up message sent successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/problems/:id/status-history
const getProblemStatusHistory = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem report not found.' },
      });
    }

    if (
      req.user.role === 'farmer' &&
      problem.farmerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied.' },
      });
    }

    const history = await StatusHistory.find({ problemId: problem._id })
      .populate('changedBy', 'fullName role designation')
      .sort({ createdAt: 1 })
      .lean();

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/problems
const getPublicProblems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.cropId) query.cropId = req.query.cropId;
    if (req.query.categoryId) query.categoryId = req.query.categoryId;

    const [problems, totalItems] = await Promise.all([
      Problem.find(query)
        .populate('cropId', 'name localNames scientificName')
        .populate('categoryId', 'name')
        .populate('assignedExpertId', 'fullName name designation')
        .sort({ submittedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Problem.countDocuments(query),
    ]);

    for (const p of problems) {
      p.reportNumber = p.reportNumber || `FC-${p._id.toString().slice(-4)}`;
      const resps = await Response.find({ problemId: p._id }).populate('authorId', 'fullName name').lean();
      p.responses = resps.map((r) => ({
        ...r,
        recommendations: r.message || r.recommendations,
        observations: r.observations,
        precautions: r.precautions,
      }));
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

module.exports = {
  createProblem,
  getMyProblems,
  getPublicProblems,
  getProblemById,
  getProblemResponses,
  createFollowUp,
  getProblemStatusHistory,
};

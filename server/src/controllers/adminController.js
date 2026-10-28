const Problem = require('../models/Problem');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const StatusHistory = require('../models/StatusHistory');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const bcrypt = require('bcryptjs');

// GET /api/v1/admin/dashboard
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalFarmers,
      totalExperts,
      totalProblems,
      unassignedProblems,
      underReviewProblems,
      awaitingInfoProblems,
      responseProvidedProblems,
      resolvedProblems,
      reopenedProblems,
      problemsByCategory,
      problemsByCrop,
      problemsByStatus,
      expertWorkload,
      recentActivity,
      recentProblemsList,
    ] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'expert', accountStatus: 'active' }),
      Problem.countDocuments(),
      Problem.countDocuments({ status: 'SUBMITTED', assignedExpertId: null }),
      Problem.countDocuments({ status: 'UNDER_REVIEW' }),
      Problem.countDocuments({ status: 'AWAITING_FARMER_INFORMATION' }),
      Problem.countDocuments({ status: 'RESPONSE_PROVIDED' }),
      Problem.countDocuments({ status: 'RESOLVED' }),
      Problem.countDocuments({ status: 'REOPENED' }),

      // Aggregates for Chart.js
      Problem.aggregate([
        { $lookup: { from: 'problemcategories', localField: 'categoryId', foreignField: '_id', as: 'cat' } },
        { $unwind: '$cat' },
        { $group: { _id: '$cat.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Problem.aggregate([
        { $lookup: { from: 'crops', localField: 'cropId', foreignField: '_id', as: 'crop' } },
        { $unwind: '$crop' },
        { $group: { _id: '$crop.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Problem.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Expert Workload Distribution
      User.aggregate([
        { $match: { role: 'expert', accountStatus: 'active' } },
        {
          $lookup: {
            from: 'problems',
            let: { expertId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$assignedExpertId', '$$expertId'] },
                      { $ne: ['$status', 'RESOLVED'] },
                    ],
                  },
                },
              },
            ],
            as: 'activeCases',
          },
        },
        {
          $project: {
            _id: 1,
            fullName: 1,
            designation: 1,
            activeCount: { $size: '$activeCases' },
            solvedCount: '$solvedCasesCount',
            rating: 1,
          },
        },
        { $sort: { activeCount: -1 } },
      ]),

      // Recent Activity
      StatusHistory.find()
        .populate('problemId', 'reportNumber title')
        .populate('changedBy', 'fullName role')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),

      // Recent Incident Submissions
      Problem.find()
        .populate('cropId', 'name')
        .populate('farmerId', 'fullName phone')
        .populate('assignedExpertId', 'fullName')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const summary = {
      totalFarmers,
      totalExperts,
      totalProblems,
      unassignedProblems,
      underReviewProblems,
      awaitingInfoProblems,
      responseProvidedProblems,
      resolvedProblems,
      reopenedProblems,
    };

    const charts = {
      byCategory: problemsByCategory,
      byCrop: problemsByCrop,
      byStatus: problemsByStatus,
      expertWorkload,
    };

    res.status(200).json({
      success: true,
      data: {
        summary,
        counters: summary,
        charts,
        byCategory: problemsByCategory,
        byCrop: problemsByCrop,
        byStatus: problemsByStatus,
        expertWorkload,
        recentProblems: recentProblemsList,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/problems
const getAllProblems = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.cropId) {
      query.cropId = req.query.cropId;
    }
    if (req.query.categoryId) {
      query.categoryId = req.query.categoryId;
    }
    if (req.query.expertId) {
      query.assignedExpertId = req.query.expertId;
    }
    if (req.query.isUnassigned === 'true') {
      query.assignedExpertId = null;
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
        .populate('farmerId', 'fullName phone email location')
        .populate('cropId', 'name localNames')
        .populate('categoryId', 'name')
        .populate('assignedExpertId', 'fullName designation')
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Problem.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: problems,
      problems,
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

// GET /api/v1/admin/unassigned
const getUnassignedProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find({
      $or: [{ assignedExpertId: null }, { status: 'SUBMITTED' }],
    })
      .populate('farmerId', 'fullName phone location')
      .populate('cropId', 'name localNames')
      .populate('categoryId', 'name')
      .sort({ submittedAt: 1 }) // oldest first for triage SLA
      .lean();

    res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/admin/problems/:id/assign
const assignExpert = async (req, res, next) => {
  try {
    const { expertId, assignmentNote, reason } = req.body;

    if (!expertId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Expert ID is required.' },
      });
    }

    const targetProblemId = req.params.id || req.body.problemId;
    const [problem, expert] = await Promise.all([
      Problem.findById(targetProblemId),
      User.findOne({ _id: expertId, role: 'expert', accountStatus: 'active' }),
    ]);

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem report not found.' },
      });
    }

    if (!expert) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EXPERT',
          message: 'Selected expert is invalid, inactive, or not an agronomist.',
        },
      });
    }

    const previousStatus = problem.status;
    problem.assignedExpertId = expert._id;
    if (problem.status === 'SUBMITTED' || !problem.status) {
      problem.status = 'ASSIGNED';
    }
    problem.lastActivityAt = new Date();
    await problem.save();

    const note = (assignmentNote || reason || '').trim() || undefined;

    // Create Assignment record
    await Assignment.create({
      problemId: problem._id,
      expertId: expert._id,
      assignedBy: req.user._id,
      assignmentStatus: 'ACTIVE',
      assignmentNote: note,
    });

    // Record status history
    await StatusHistory.create({
      problemId: problem._id,
      previousStatus,
      newStatus: problem.status,
      changedBy: req.user._id,
      reason: reason || `Assigned to ${expert.fullName} (${expert.designation || 'Agricultural Specialist'})`,
    });

    // Notify the assigned expert
    await Notification.create({
      recipientId: expert._id,
      problemId: problem._id,
      type: 'REPORT_ASSIGNED',
      title: 'New Case Assigned',
      message: `You have been assigned Case ${problem.reportNumber}: ${problem.title}`,
      link: `/expert/cases/${problem._id}`,
    });

    // Notify farmer
    await Notification.create({
      recipientId: problem.farmerId,
      problemId: problem._id,
      type: 'STATUS_CHANGED',
      title: 'Expert Assigned to Your Case',
      message: `Your report ${problem.reportNumber} has been assigned to expert ${expert.fullName}.`,
      link: `/farmer/reports`,
    });

    // Update expert active cases count
    await User.findByIdAndUpdate(expert._id, { $inc: { activeCasesCount: 1 } });

    // Audit log
    await AuditLog.create({
      actorId: req.user._id,
      action: 'CASE_ASSIGNED',
      targetType: 'Problem',
      targetId: problem._id,
      metadata: { expertId: expert._id, expertName: expert.fullName },
    });

    res.status(200).json({
      success: true,
      data: {
        problemId: problem._id,
        assignedExpert: expert.fullName,
        currentStatus: problem.status,
      },
      message: `Case ${problem.reportNumber} successfully assigned to ${expert.fullName}.`,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/admin/problems/:id/reassign
const reassignExpert = async (req, res, next) => {
  try {
    const { expertId, reason, assignmentNote } = req.body;

    const targetExpertId = req.body.expertId || req.body.newExpertId;
    if (!targetExpertId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'New expert ID is required.' },
      });
    }

    const targetProblemId = req.params.id || req.body.problemId;
    const [problem, newExpert] = await Promise.all([
      Problem.findById(targetProblemId),
      User.findOne({ _id: targetExpertId, role: 'expert', accountStatus: 'active' }),
    ]);

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem report not found.' },
      });
    }

    if (!newExpert) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_EXPERT', message: 'Selected expert is inactive or invalid.' },
      });
    }

    const previousExpertId = problem.assignedExpertId;

    // End previous active assignment
    await Assignment.updateMany(
      { problemId: problem._id, assignmentStatus: 'ACTIVE' },
      { assignmentStatus: 'ENDED', endedAt: new Date(), reassignmentReason: reason }
    );

    // Create new assignment
    await Assignment.create({
      problemId: problem._id,
      expertId: newExpert._id,
      assignedBy: req.user._id,
      assignmentStatus: 'ACTIVE',
      assignmentNote: assignmentNote ? assignmentNote.trim() : undefined,
      reassignmentReason: reason,
    });

    problem.assignedExpertId = newExpert._id;
    problem.lastActivityAt = new Date();
    await problem.save();

    await StatusHistory.create({
      problemId: problem._id,
      previousStatus: problem.status,
      newStatus: problem.status,
      changedBy: req.user._id,
      reason: `Reassigned to ${newExpert.fullName}. Reason: ${reason || 'Caseload rebalancing'}`,
    });

    // Notify new expert
    await Notification.create({
      recipientId: newExpert._id,
      problemId: problem._id,
      type: 'REPORT_ASSIGNED',
      title: 'Reassigned Case Transferred',
      message: `Case ${problem.reportNumber} has been reassigned to you.`,
      link: `/expert/cases/${problem._id}`,
    });

    // Audit log
    await AuditLog.create({
      actorId: req.user._id,
      action: 'CASE_REASSIGNED',
      targetType: 'Problem',
      targetId: problem._id,
      metadata: { previousExpertId, newExpertId: newExpert._id, reason },
    });

    res.status(200).json({
      success: true,
      data: {
        problemId: problem._id,
        assignedExpert: newExpert.fullName,
      },
      message: `Case successfully reassigned to ${newExpert.fullName}.`,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/users
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.role) query.role = req.query.role.toLowerCase();
    if (req.query.accountStatus) query.accountStatus = req.query.accountStatus.toLowerCase();
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { designation: searchRegex },
      ];
    }

    const [users, totalItems] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    const formattedUsers = users.map((u) => {
      delete u.passwordHash;
      return {
        ...u,
        name: u.fullName || u.name,
        isActive: u.accountStatus === 'active',
      };
    });

    res.status(200).json({
      success: true,
      data: formattedUsers,
      users: formattedUsers,
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

// POST /api/v1/admin/users
const createUser = async (req, res, next) => {
  try {
    const rawFullName = req.body.fullName || req.body.name;
    const rawRole = (req.body.role || '').toLowerCase();
    const rawDesignation = req.body.designation || req.body.specialization;
    const rawInstitution = req.body.institution || req.body.qualification;

    const {
      email,
      phone,
      password,
      expertise,
      serviceDistricts,
      location,
    } = req.body;

    if (!rawFullName || !password || !rawRole) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Full name, password, and role are required.' },
      });
    }

    const normalizedEmail = email ? email.trim().toLowerCase() : undefined;
    if (normalizedEmail) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: { code: 'EMAIL_EXISTS', message: 'Email is already registered.' },
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName: rawFullName.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : undefined,
      passwordHash,
      role: rawRole,
      accountStatus: 'active',
      designation: rawDesignation ? rawDesignation.trim() : undefined,
      institution: rawInstitution ? rawInstitution.trim() : undefined,
      expertise: Array.isArray(expertise) ? expertise : expertise ? [expertise] : [],
      serviceDistricts: Array.isArray(serviceDistricts)
        ? serviceDistricts
        : serviceDistricts
        ? [serviceDistricts]
        : [],
      location: location || {},
    });

    await AuditLog.create({
      actorId: req.user._id,
      action: 'USER_CREATED',
      targetType: 'User',
      targetId: user._id,
      metadata: { role: rawRole, email: normalizedEmail },
    });

    res.status(201).json({
      success: true,
      data: user.toSafeObject(),
      message: `${rawRole.toUpperCase()} account created successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/admin/users/:id/status
const updateUserStatus = async (req, res, next) => {
  try {
    let { accountStatus, isActive } = req.body;

    if (!accountStatus && typeof isActive === 'boolean') {
      accountStatus = isActive ? 'active' : 'inactive';
    }

    if (!['active', 'inactive', 'pending'].includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Allowed status: active, inactive, pending.' },
      });
    }

    // Safety guard: prevent admin from deactivating their own account
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SELF_MODIFICATION_BLOCKED',
          message: 'Administrators cannot deactivate their own active account.',
        },
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found.' },
      });
    }

    user.accountStatus = accountStatus;
    // Invalidate active JWTs on deactivation
    if (accountStatus === 'inactive') {
      user.tokenVersion = (user.tokenVersion || 1) + 1;
    }
    await user.save();

    await AuditLog.create({
      actorId: req.user._id,
      action: 'USER_STATUS_UPDATED',
      targetType: 'User',
      targetId: user._id,
      metadata: { previousStatus: user.accountStatus, newStatus: accountStatus },
    });

    res.status(200).json({
      success: true,
      data: user.toSafeObject(),
      message: `Account status updated to ${accountStatus}.`,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/admin/experts
const getExperts = async (req, res, next) => {
  try {
    const experts = await User.find({ role: 'expert', accountStatus: 'active' })
      .select('fullName email phone designation institution expertise rating activeCasesCount solvedCasesCount')
      .lean();
    const formatted = experts.map((e) => ({
      ...e,
      name: e.fullName,
      specialization: e.designation || (e.expertise && e.expertise[0]) || 'Plant Protection Specialist',
      qualification: e.institution || 'Certified Agronomist'
    }));
    res.status(200).json({
      success: true,
      data: formatted,
      experts: formatted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllProblems,
  getUnassignedProblems,
  assignExpert,
  reassignExpert,
  getUsers,
  getExperts,
  createUser,
  updateUserStatus,
};

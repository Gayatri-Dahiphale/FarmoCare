const Crop = require('../models/Crop');
const ProblemCategory = require('../models/ProblemCategory');
const Notification = require('../models/Notification');

// GET /api/v1/crops
const getCrops = async (req, res, next) => {
  try {
    const query = req.user && req.user.role === 'admin' ? {} : { isActive: true };
    const crops = await Crop.find(query).sort({ displayOrder: 1, name: 1 }).lean();
    res.status(200).json({ success: true, data: crops, crops });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/admin/crops
const createCrop = async (req, res, next) => {
  try {
    const { name, localNames, season, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Crop name is required.' },
      });
    }

    const crop = await Crop.create({
      name: name.trim(),
      normalizedName: name.trim().toLowerCase(),
      localNames: localNames || {},
      season: season ? season.trim() : undefined,
      description: description ? description.trim() : undefined,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: crop, message: 'Crop created successfully.' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/admin/crops/:id
const updateCrop = async (req, res, next) => {
  try {
    const { name, localNames, season, description, isActive } = req.body;
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Crop not found.' },
      });
    }

    if (name) {
      crop.name = name.trim();
      crop.normalizedName = name.trim().toLowerCase();
    }
    if (localNames) crop.localNames = localNames;
    if (season !== undefined) crop.season = season;
    if (description !== undefined) crop.description = description;
    if (isActive !== undefined) crop.isActive = Boolean(isActive);

    await crop.save();
    res.status(200).json({ success: true, data: crop, message: 'Crop updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/categories
const getCategories = async (req, res, next) => {
  try {
    const query = req.user && req.user.role === 'admin' ? {} : { isActive: true };
    const categories = await ProblemCategory.find(query).sort({ displayOrder: 1, name: 1 }).lean();
    res.status(200).json({ success: true, data: categories, categories });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/admin/categories
const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Category name is required.' },
      });
    }

    const category = await ProblemCategory.create({
      name: name.trim(),
      normalizedName: name.trim().toLowerCase(),
      description: description ? description.trim() : undefined,
      icon: icon ? icon.trim() : undefined,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Problem category created successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/admin/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon, isActive } = req.body;
    const category = await ProblemCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Problem category not found.' },
      });
    }

    if (name) {
      category.name = name.trim();
      category.normalizedName = name.trim().toLowerCase();
    }
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();
    res.status(200).json({
      success: true,
      data: category,
      message: 'Problem category updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/notifications
const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const skip = (page - 1) * limit;

    const query = { recipientId: req.user._id };
    if (req.query.unreadOnly === 'true') {
      query.isRead = false;
    }

    const [notifications, totalItems, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipientId: req.user._id, isRead: false }),
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
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

// PATCH /api/v1/notifications/:id/read
const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Notification not found.' },
      });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/notifications/read-all
const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipientId: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCrops,
  createCrop,
  updateCrop,
  getCategories,
  createCategory,
  updateCategory,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};

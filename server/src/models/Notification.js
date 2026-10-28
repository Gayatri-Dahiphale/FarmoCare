const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      default: null,
    },
    type: {
      type: String,
      enum: [
        'REPORT_SUBMITTED',
        'REPORT_ASSIGNED',
        'RESPONSE_ADDED',
        'INFORMATION_REQUESTED',
        'FARMER_FOLLOW_UP',
        'STATUS_CHANGED',
        'REPORT_RESOLVED',
        'GENERAL',
      ],
      default: 'GENERAL',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

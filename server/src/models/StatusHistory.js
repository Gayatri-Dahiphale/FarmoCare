const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },
    previousStatus: {
      type: String,
      enum: [
        'SUBMITTED',
        'ASSIGNED',
        'UNDER_REVIEW',
        'AWAITING_FARMER_INFORMATION',
        'RESPONSE_PROVIDED',
        'RESOLVED',
        'REOPENED',
        null,
      ],
      default: null,
    },
    newStatus: {
      type: String,
      enum: [
        'SUBMITTED',
        'ASSIGNED',
        'UNDER_REVIEW',
        'AWAITING_FARMER_INFORMATION',
        'RESPONSE_PROVIDED',
        'RESOLVED',
        'REOPENED',
      ],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

statusHistorySchema.index({ problemId: 1, createdAt: 1 });

module.exports = mongoose.model('StatusHistory', statusHistorySchema);

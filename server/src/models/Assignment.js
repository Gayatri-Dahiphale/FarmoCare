const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignmentStatus: {
      type: String,
      enum: ['ACTIVE', 'ENDED'],
      default: 'ACTIVE',
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    reassignmentReason: {
      type: String,
      trim: true,
    },
    assignmentNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

assignmentSchema.index({ problemId: 1, assignedAt: -1 });
assignmentSchema.index({ expertId: 1, assignmentStatus: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);

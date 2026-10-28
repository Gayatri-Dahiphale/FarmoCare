const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    responseType: {
      type: String,
      enum: [
        'EXPERT_RECOMMENDATION',
        'INFORMATION_REQUEST',
        'FARMER_FOLLOW_UP',
        'ADMIN_NOTE',
      ],
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    observations: {
      type: String,
      trim: true,
    },
    recommendations: [
      {
        type: String,
        trim: true,
      },
    ],
    requestedInformation: {
      type: String,
      trim: true,
    },
    precautionaryNotes: {
      type: String,
      trim: true,
    },
    issuePersists: {
      type: Boolean,
      default: true,
    },
    attachments: [
      {
        url: { type: String, required: true },
        filename: { type: String },
        mimeType: { type: String },
        size: { type: Number },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

responseSchema.index({ problemId: 1, createdAt: 1 });

module.exports = mongoose.model('Response', responseSchema);

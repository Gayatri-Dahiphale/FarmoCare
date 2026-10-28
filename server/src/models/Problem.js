const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    reportNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: [true, 'Crop is required'],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProblemCategory',
      required: [true, 'Problem category is required'],
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true,
    },
    location: {
      village: { type: String, trim: true },
      district: { type: String, trim: true, required: true },
      state: { type: String, trim: true, default: 'Maharashtra' },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    problemStartDate: { type: Date },
    affectedArea: { type: String, trim: true }, // e.g. "1.5 Acres", "500 sq meters"
    growthStage: { type: String, trim: true }, // e.g. "Vegetative", "Flowering", "Fruiting", "Seedling"
    imageAttachments: [
      {
        url: { type: String, required: true },
        storageKey: { type: String },
        filename: { type: String },
        mimeType: { type: String },
        size: { type: Number },
      },
    ],
    status: {
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
      default: 'SUBMITTED',
      required: true,
    },
    assignedExpertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionNotes: {
      type: String,
      trim: true,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

problemSchema.index({ farmerId: 1, submittedAt: -1 });
problemSchema.index({ assignedExpertId: 1, status: 1, updatedAt: -1 });
problemSchema.index({ status: 1, submittedAt: -1 });
problemSchema.index({ cropId: 1, categoryId: 1, status: 1 });

module.exports = mongoose.model('Problem', problemSchema);

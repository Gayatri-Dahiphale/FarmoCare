const mongoose = require('mongoose');

const problemCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    normalizedName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    localNames: {
      mr: { type: String, trim: true },
      hi: { type: String, trim: true },
    },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    displayOrder: { type: Number, default: 99 },
    isPredefined: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

problemCategorySchema.pre('validate', function (next) {
  if (this.name && !this.normalizedName) {
    this.normalizedName = this.name.trim().toLowerCase();
  }
  next();
});

module.exports = mongoose.model('ProblemCategory', problemCategorySchema);

const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Crop name is required'],
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
    season: { type: String, trim: true },
    displayOrder: { type: Number, default: 99 },
    isPredefined: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

cropSchema.pre('validate', function (next) {
  if (this.name && !this.normalizedName) {
    this.normalizedName = this.name.trim().toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Crop', cropSchema);

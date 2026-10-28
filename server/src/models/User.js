const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['farmer', 'expert', 'admin'],
      default: 'farmer',
      required: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
      required: true,
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    location: {
      village: { type: String, trim: true },
      district: { type: String, trim: true },
      state: { type: String, trim: true, default: 'Maharashtra' },
    },
    // Expert specific profile fields
    expertise: [{ type: String, trim: true }],
    serviceDistricts: [{ type: String, trim: true }],
    designation: { type: String, trim: true },
    institution: { type: String, trim: true },
    solvedCasesCount: { type: Number, default: 0 },
    activeCasesCount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    tokenVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, accountStatus: 1 });

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  obj.name = obj.fullName;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

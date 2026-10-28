const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion || 1,
    },
    process.env.JWT_SECRET || 'farmora_care_super_secure_jwt_secret_key_2026_academic_demo',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/v1/auth/register
const register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, location, preferredLanguage } = req.body;

    if (!fullName || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name and password are required.',
        },
      });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Either email or mobile number must be provided.',
        },
      });
    }

    // Security check: Never allow public registration to set role or accountStatus
    const normalizedEmail = email ? email.trim().toLowerCase() : undefined;
    const normalizedPhone = phone ? phone.trim() : undefined;

    if (normalizedEmail) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'EMAIL_EXISTS',
            message: 'An account with this email address already exists.',
          },
        });
      }
    }

    if (normalizedPhone) {
      const existing = await User.findOne({ phone: normalizedPhone });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'PHONE_EXISTS',
            message: 'An account with this phone number already exists.',
          },
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
      role: 'farmer', // strictly enforced
      accountStatus: 'active',
      location: location || {},
      preferredLanguage: preferredLanguage || 'en',
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      data: {
        user: newUser.toSafeObject(),
        token,
      },
      message: 'Farmer account registered successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const rawIdentifier = req.body.identifier || req.body.email || req.body.phone;
    const { password } = req.body;

    if (!rawIdentifier || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Please provide email/phone and password.',
        },
      });
    }

    const trimmedIdentifier = rawIdentifier.trim();
    const user = await User.findOne({
      $or: [
        { email: trimmedIdentifier.toLowerCase() },
        { phone: trimmedIdentifier },
      ],
    }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials. Please verify your login details.',
        },
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials. Please verify your login details.',
        },
      });
    }

    if (user.accountStatus !== 'active') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Your account is deactivated. Please contact the administrator.',
        },
      });
    }

    const token = generateToken(user);
    const safeUser = user.toSafeObject();

    res.status(200).json({
      success: true,
      token,
      user: safeUser,
      data: {
        user: safeUser,
        token,
      },
      message: 'Logged in successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/auth/me
const getMe = async (req, res) => {
  const safeUser = req.user.toSafeObject();
  res.status(200).json({
    success: true,
    user: safeUser,
    data: {
      user: safeUser,
    },
  });
};

// POST /api/v1/auth/logout
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};

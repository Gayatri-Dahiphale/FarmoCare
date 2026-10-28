require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const printUsage = () => {
  console.log(`
Usage:
  node src/create-user.js <role> <fullName> <email> <phone> <password> [designation] [institution]

Roles:
  expert | admin | farmer

Examples:
  # Create a new Expert:
  node src/create-user.js expert "Dr. Sunita Patil" sunita@farmora.care 9822114455 Expert@2026 "Crop Pathology" "MPKV Rahuri"

  # Create a new Admin:
  node src/create-user.js admin "Operations Lead" admin.lead@farmora.care 9822114466 Admin@2026 "State Coordinator"
`);
};

const run = async () => {
  const args = process.argv.slice(2);
  if (args.length < 5) {
    printUsage();
    process.exit(1);
  }

  const [role, fullName, email, phone, password, designation, institution] = args;
  const normalizedRole = role.toLowerCase();

  if (!['farmer', 'expert', 'admin'].includes(normalizedRole)) {
    console.error(`Error: Invalid role "${role}". Must be one of: expert, admin, farmer.`);
    process.exit(1);
  }

  try {
    await connectDB();

    const normalizedEmail = email ? email.trim().toLowerCase() : undefined;
    const normalizedPhone = phone ? phone.trim() : undefined;

    // Check existing
    const existing = await User.findOne({
      $or: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
      ],
    });

    if (existing) {
      console.error(`Error: User with email "${normalizedEmail}" or phone "${normalizedPhone}" already exists.`);
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
      role: normalizedRole,
      accountStatus: 'active',
      designation: designation ? designation.trim() : undefined,
      institution: institution ? institution.trim() : undefined,
    });

    console.log('\n==================================================');
    console.log(` SUCCESS: ${normalizedRole.toUpperCase()} Account Created!`);
    console.log('==================================================');
    console.log(`ID:          ${newUser._id}`);
    console.log(`Full Name:   ${newUser.fullName}`);
    console.log(`Role:        ${newUser.role}`);
    console.log(`Email/Login: ${newUser.email}`);
    console.log(`Phone/Login: ${newUser.phone}`);
    console.log(`Designation: ${newUser.designation || 'N/A'}`);
    console.log(`Institution: ${newUser.institution || 'N/A'}`);
    console.log('==================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Failed to create user:', err.message);
    process.exit(1);
  }
};

run();

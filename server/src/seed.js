require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Crop = require('./models/Crop');
const ProblemCategory = require('./models/ProblemCategory');
const Problem = require('./models/Problem');
const Response = require('./models/Response');
const StatusHistory = require('./models/StatusHistory');
const Assignment = require('./models/Assignment');
const Notification = require('./models/Notification');
const AuditLog = require('./models/AuditLog');

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    console.log('[Seeder] Connecting to database...');
    await connectDB();

    console.log('[Seeder] Cleaning existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Crop.deleteMany({}),
      ProblemCategory.deleteMany({}),
      Problem.deleteMany({}),
      Response.deleteMany({}),
      StatusHistory.deleteMany({}),
      Assignment.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    console.log('[Seeder] Seeding Categories...');
    const { PREDEFINED_CATEGORIES, PREDEFINED_CROPS } = require('./config/predefinedOptions');

    const categoriesData = [
      ...PREDEFINED_CATEGORIES,
      { name: 'Soil Problem', normalizedName: 'soil problem', description: 'Soil alkalinity, acidity, hardpan, drainage, root aeration', icon: 'Layers', displayOrder: 99, isPredefined: false },
      { name: 'Poor Crop Growth', normalizedName: 'poor crop growth', description: 'Stunted seedlings, abnormal flowering, fruit drop, poor tiller count', icon: 'Sprout', displayOrder: 99, isPredefined: false },
      { name: 'Other Agricultural Problems', normalizedName: 'other agricultural problems', description: 'General farm advisory, agronomy equipment', icon: 'HelpCircle', displayOrder: 99, isPredefined: false },
    ];
    const categories = await ProblemCategory.insertMany(categoriesData);
    const catMap = {};
    categories.forEach((c) => {
      catMap[c.name] = c._id;
    });
    // Add legacy name aliases
    catMap['Crop Disease'] = catMap['Crop diseases'];
    catMap['Pest Attack'] = catMap['Pest infestation'];
    catMap['Fertilizer Issue'] = catMap['Nutrient deficiency'];
    catMap['Irrigation Problem'] = catMap['Irrigation problems'];
    catMap['Weather/Crop Damage'] = catMap['Weather damage'];

    console.log('[Seeder] Seeding Crops...');
    const cropsData = [
      ...PREDEFINED_CROPS,
      { name: 'Capsicum', normalizedName: 'capsicum', localNames: { mr: 'ढोबळी मिरची', hi: 'शिमला मिर्च' }, season: 'All Season / Polyhouse', description: 'High value vegetable crop grown in polyhouses and open fields', displayOrder: 99, isPredefined: false },
      { name: 'Pomegranate', normalizedName: 'pomegranate', localNames: { mr: 'डाळिंब', hi: 'अनार' }, season: 'All Season (Bahar)', description: 'Export grade fruit crop of Solapur and Sangli', displayOrder: 99, isPredefined: false },
    ];
    const crops = await Crop.insertMany(cropsData);
    const cropMap = {};
    crops.forEach((c) => {
      cropMap[c.name] = c._id;
    });

    console.log('[Seeder] Creating Users with hashed passwords...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Farmora@Admin2026', salt);
    const expertPasswordHash = await bcrypt.hash('Expert@2026', salt);
    const farmerPasswordHash = await bcrypt.hash('Farmer@2026', salt);

    // Admin
    const admin = await User.create({
      fullName: 'Dr. Rajeshwar Deshmukh',
      email: 'admin@farmora.care',
      phone: '9822000001',
      passwordHash: adminPasswordHash,
      role: 'admin',
      accountStatus: 'active',
      designation: 'Director of Extension Education & AgriTech Operations',
      institution: 'State Agricultural Advisory Directorate',
      location: { district: 'Pune', state: 'Maharashtra' },
    });

    // Experts
    const expert1 = await User.create({
      fullName: 'Dr. Anita Shinde',
      email: 'dr.shinde@farmora.care',
      phone: '9822000002',
      passwordHash: expertPasswordHash,
      role: 'expert',
      accountStatus: 'active',
      designation: 'Horticultural Virologist & Polyhouse Specialist',
      institution: 'Mahatma Phule Krishi Vidyapeeth (MPKV), Rahuri',
      expertise: ['Capsicum', 'Tomato', 'Viral Vectors', 'Polyhouse Diseases'],
      serviceDistricts: ['Solapur', 'Pune', 'Ahmednagar'],
      rating: 4.9,
      solvedCasesCount: 184,
      location: { district: 'Solapur', state: 'Maharashtra' },
    });

    const expert2 = await User.create({
      fullName: 'Dr. Vijay Rao',
      email: 'dr.rao@farmora.care',
      phone: '9822000003',
      passwordHash: expertPasswordHash,
      role: 'expert',
      accountStatus: 'active',
      designation: 'Senior Plant Pathologist & Fungicide Specialist',
      institution: 'Central Institute for Cotton Research (CICR), Nagpur',
      expertise: ['Cotton', 'Soybean', 'Fungal Blight', 'Boll Rot'],
      serviceDistricts: ['Nagpur', 'Wardha', 'Amravati', 'Yavatmal'],
      rating: 4.8,
      solvedCasesCount: 142,
      location: { district: 'Nagpur', state: 'Maharashtra' },
    });

    const expert3 = await User.create({
      fullName: 'Dr. Sanjay Banerjee',
      email: 'dr.banerjee@farmora.care',
      phone: '9822000004',
      passwordHash: expertPasswordHash,
      role: 'expert',
      accountStatus: 'active',
      designation: 'Lead Agronomist & Soil Nutritionist',
      institution: 'Vasantrao Naik Marathwada Krishi Vidyapeeth (VNMKV)',
      expertise: ['Rice', 'Sugarcane', 'Soil Salinity', 'Micronutrients'],
      serviceDistricts: ['Kolhapur', 'Sangli', 'Satara', 'Nashik'],
      rating: 4.7,
      solvedCasesCount: 98,
      location: { district: 'Kolhapur', state: 'Maharashtra' },
    });

    // Farmers
    const farmer1 = await User.create({
      fullName: 'Ramesh Patil',
      email: 'ramesh.patil@farmora.care',
      phone: '9822000005',
      passwordHash: farmerPasswordHash,
      role: 'farmer',
      accountStatus: 'active',
      location: { village: 'Karmala', district: 'Solapur', state: 'Maharashtra' },
    });

    const farmer2 = await User.create({
      fullName: 'Suresh Deshmukh',
      email: 'suresh.deshmukh@farmora.care',
      phone: '9822000006',
      passwordHash: farmerPasswordHash,
      role: 'farmer',
      accountStatus: 'active',
      location: { village: 'Dindori', district: 'Nashik', state: 'Maharashtra' },
    });

    const farmer3 = await User.create({
      fullName: 'Kavita Jadhav',
      email: 'kavita.jadhav@farmora.care',
      phone: '9822000007',
      passwordHash: farmerPasswordHash,
      role: 'farmer',
      accountStatus: 'active',
      location: { village: 'Baramati', district: 'Pune', state: 'Maharashtra' },
    });

    console.log('[Seeder] Seeding Historical Resolved Problems (for Similar Solved Problems engine)...');

    // Historical Solved Case 1: Capsicum Virus
    const histCase1 = await Problem.create({
      reportNumber: 'FPR-2025-0842-7104',
      farmerId: farmer1._id,
      title: 'Severe leaf curling, mosaic mottling, and stunted shoot growth in Capsicum polyhouse',
      cropId: cropMap['Capsicum'],
      categoryId: catMap['Crop Disease'],
      description: 'Capsicum crop at 45 days after transplanting in polyhouse showing inward leaf curling, mottled chlorosis, vein banding, and severely stunted lateral branches. Lower leaves exhibit small yellow speckled rings.',
      location: { village: 'Karmala', district: 'Solapur', state: 'Maharashtra' },
      affectedArea: '1.2 Acres (Polyhouse)',
      growthStage: 'Vegetative to Early Flowering',
      status: 'RESOLVED',
      assignedExpertId: expert1._id,
      submittedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      resolutionNotes: 'Confirmed Chilli Veinal Mottle Virus (ChiVMV) vectored by aphids. Managed successfully with systemic vector suppression, yellow sticky traps, and micronutrient foliar spray.',
      imageAttachments: [
        {
          url: '/images/macro_leaf_pest.png',
          filename: 'capsicum_viral_curl.png',
          mimeType: 'image/png',
          size: 1678771,
        },
      ],
    });

    await Response.create({
      problemId: histCase1._id,
      authorId: expert1._id,
      responseType: 'EXPERT_RECOMMENDATION',
      message: 'The visual symptoms indicate Chilli Veinal Mottle Virus (ChiVMV) vectored by aphids (Aphis gossypii). Viral diseases cannot be cured with fungicides; vector eradication and plant vigor restoration are essential.',
      observations: 'Upward curling with mosaic chlorosis and interveinal yellowing is typical of viral transmission in high humidity polyhouse environments.',
      recommendations: [
        'Erect 15-20 Yellow Sticky Traps per acre at canopy height to monitor and mass-trap winged aphids.',
        'Foliar spray Acetamiprid 20% SP @ 0.5 g per litre water or Thiamethoxam 25% WG @ 0.35 g per litre to knock down vector populations.',
        'After 5 days, spray cold-pressed Neem Oil (10,000 ppm) @ 3 ml per litre with a non-ionic wetting agent.',
        'Foliar feed with Zinc EDTA 12% @ 1 g/L and Boron 20% @ 1 g/L to stimulate fresh leaf elongation.',
        'Rogue out and bury severely infected unrecoverable plants outside the polyhouse perimeter.',
      ],
      precautionaryNotes: 'Do not spray chemical insecticides during peak bee foraging hours if open pollination is practiced. Wear protective gear during polyhouse spraying.',
      createdAt: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000),
    });

    // Historical Solved Case 2: Cotton Pink Bollworm
    const histCase2 = await Problem.create({
      reportNumber: 'FPR-2025-0912-4412',
      farmerId: farmer2._id,
      title: 'Rosette flowers, internal boll damage, and premature leaf drop in Bt Cotton',
      cropId: cropMap['Cotton'],
      categoryId: catMap['Pest Attack'],
      description: 'Cotton crop at 90 days stage showing rosette-shaped flowers that fail to open properly. Upon splitting green bolls, found small pink caterpillars burrowed inside seeds with stained lint and rotting.',
      location: { village: 'Dindori', district: 'Nashik', state: 'Maharashtra' },
      affectedArea: '3.5 Acres',
      growthStage: 'Boll Formation / Maturation',
      status: 'RESOLVED',
      assignedExpertId: expert2._id,
      submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      resolutionNotes: 'Pink Bollworm (Pectinophora gossypiella) outbreak controlled through pheromone mass trapping, Emamectin Benzoate and Profenofos rotation.',
      imageAttachments: [
        {
          url: '/images/macro_leaf_pest.png',
          filename: 'cotton_bollworm.png',
          mimeType: 'image/png',
          size: 1678771,
        },
      ],
    });

    await Response.create({
      problemId: histCase2._id,
      authorId: expert2._id,
      responseType: 'EXPERT_RECOMMENDATION',
      message: 'This is an infestation of Pink Bollworm (Pectinophora gossypiella). Immediate multi-pronged control is mandatory to prevent yield collapse.',
      observations: 'Rosetted blooms and bore holes with frass near the pedicel confirm larval penetration into developing seeds.',
      recommendations: [
        'Install Gossyplure Pheromone Traps @ 8 per acre for monitoring; if trap catch exceeds 8 moths/day, initiate chemical spray immediately.',
        'Spray Emamectin Benzoate 5% SG @ 4.5 g per 10 litres water during late afternoon.',
        'If infestation persists after 7 days, alternate with Chlorantraniliprole 18.5% SC @ 3 ml per 10 litres water.',
        'Hand-pick and destroy all rosetted flowers and dropped bolls in a kerosene-water solution.',
      ],
      precautionaryNotes: 'Avoid repeating identical chemical classes consecutively to delay insecticide resistance development.',
      createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
    });

    // Historical Solved Case 3: Rice Bacterial Leaf Blight
    const histCase3 = await Problem.create({
      reportNumber: 'FPR-2025-0621-3918',
      farmerId: farmer3._id,
      title: 'Water-soaked lesions turning yellow-white wavy stripes from leaf tip in Basmati Rice',
      cropId: cropMap['Rice'],
      categoryId: catMap['Crop Disease'],
      description: 'Paddy field at maximum tillering stage after heavy continuous rainfall. Lesions began at leaf margins as water-soaked spots, then elongated into wavy yellow-gray blights extending toward the sheath. Milky bacterial ooze droplets observed in early morning.',
      location: { village: 'Baramati', district: 'Pune', state: 'Maharashtra' },
      affectedArea: '2.0 Acres',
      growthStage: 'Tillering to Panicle Initiation',
      status: 'RESOLVED',
      assignedExpertId: expert3._id,
      submittedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
      resolutionNotes: 'Bacterial Leaf Blight (Xanthomonas oryzae) successfully checked by withholding nitrogen, draining standing water, and spraying bactericide copper complex.',
      imageAttachments: [
        {
          url: '/images/macro_leaf_pest.png',
          filename: 'rice_blb.png',
          mimeType: 'image/png',
          size: 1678771,
        },
      ],
    });

    await Response.create({
      problemId: histCase3._id,
      authorId: expert3._id,
      responseType: 'EXPERT_RECOMMENDATION',
      message: 'Symptoms are characteristic of Bacterial Leaf Blight (BLB) caused by Xanthomonas oryzae pv. oryzae, aggravated by high nitrogen and stagnant humid water.',
      observations: 'Wavy margins and bacterial exudate droplet signs confirm bacterial rather than fungal blast origin.',
      recommendations: [
        'Drain excess standing water from the paddy plot for 48 hours to dry the root collar zone.',
        'Strictly halt further top-dressing of urea or nitrogenous fertilizers until new healthy leaves emerge.',
        'Apply Streptomycin Sulphate 90% + Tetracycline Hydrochloride 10% @ 6 g + Copper Oxychloride 50% WP @ 25 g per 10 litres water.',
        'Apply MOP (Muriate of Potash) @ 15 kg/acre to strengthen cell walls against bacterial invasion.',
      ],
      precautionaryNotes: 'Do not work in wet fields during early morning dew to prevent mechanical spreading of bacterial bacteria from plant to plant.',
      createdAt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000),
    });

    console.log('[Seeder] Seeding Live Active Cases for Testing...');

    // Live Case 1: Unassigned (for Admin to assign)
    const liveCase1 = await Problem.create({
      reportNumber: 'FC-9104',
      farmerId: farmer1._id,
      title: 'Severe Aphid & Mosaic Virus on Capsicum in Solapur polyhouse',
      cropId: cropMap['Capsicum'],
      categoryId: catMap['Crop Disease'],
      description: 'Capsicum crop 40 days old in polyhouse showing inward leaf curl, stunted apical growth, and yellow vein clearing. Lower leaf surfaces have active colonies of small green aphids. Temperature in polyhouse 29°C with 74% relative humidity.',
      location: { village: 'Karmala', district: 'Solapur', state: 'Maharashtra' },
      affectedArea: '1.8 Hectares',
      growthStage: 'Vegetative / Pre-flowering',
      status: 'SUBMITTED',
      assignedExpertId: null,
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      imageAttachments: [
        {
          url: '/images/macro_leaf_pest.png',
          filename: 'capsicum_field_sample.png',
          mimeType: 'image/png',
          size: 1678771,
        },
      ],
    });

    await StatusHistory.create({
      problemId: liveCase1._id,
      previousStatus: null,
      newStatus: 'SUBMITTED',
      changedBy: farmer1._id,
      reason: 'Farmer reported polyhouse crop problem with photos.',
    });

    // Live Case 2: Assigned to Dr. Shinde (Under Review)
    const liveCase2 = await Problem.create({
      reportNumber: 'FC-8921',
      farmerId: farmer2._id,
      title: 'Early shoot borer and leaf drying in Sugarcane ratoon crop',
      cropId: cropMap['Sugarcane'],
      categoryId: catMap['Pest Attack'],
      description: 'Sugarcane ratoon shoots dying from central whorl (dead hearts). Dead hearts emit foul odor when pulled out easily. Cut stems show caterpillar tunnel with red discoloration.',
      location: { village: 'Dindori', district: 'Nashik', state: 'Maharashtra' },
      affectedArea: '4.0 Acres',
      growthStage: 'Early Tillering (35 days)',
      status: 'UNDER_REVIEW',
      assignedExpertId: expert1._id,
      submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      imageAttachments: [
        {
          url: '/images/macro_leaf_pest.png',
          filename: 'sugarcane_borer.png',
          mimeType: 'image/png',
          size: 1678771,
        },
      ],
    });

    await Assignment.create({
      problemId: liveCase2._id,
      expertId: expert1._id,
      assignedBy: admin._id,
      assignmentStatus: 'ACTIVE',
      assignmentNote: 'Assigned to Dr. Shinde for urgent Nashik ratoon inspection.',
    });

    await StatusHistory.create({
      problemId: liveCase2._id,
      previousStatus: 'ASSIGNED',
      newStatus: 'UNDER_REVIEW',
      changedBy: expert1._id,
      reason: 'Expert opened case dossier for preliminary evaluation.',
    });

    // Live Case 3: Awaiting Farmer Information
    const liveCase3 = await Problem.create({
      reportNumber: 'FC-7820',
      farmerId: farmer3._id,
      title: 'Sudden yellowing and wilting of mature Pomegranate branches (Telya / Wilt concern)',
      cropId: cropMap['Pomegranate'],
      categoryId: catMap['Crop Disease'],
      description: 'Single branches of 4-year-old pomegranate trees drying up suddenly while adjacent branches remain green. Suspecting bacterial nodal blight or root rot.',
      location: { village: 'Baramati', district: 'Pune', state: 'Maharashtra' },
      affectedArea: '2.5 Acres (Ambe Bahar)',
      growthStage: 'Fruit Development',
      status: 'AWAITING_FARMER_INFORMATION',
      assignedExpertId: expert1._id,
      submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      lastActivityAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      imageAttachments: [
        {
          url: '/images/macro_leaf_pest.png',
          filename: 'pomegranate_branch.png',
          mimeType: 'image/png',
          size: 1678771,
        },
      ],
    });

    await Response.create({
      problemId: liveCase3._id,
      authorId: expert1._id,
      responseType: 'INFORMATION_REQUEST',
      message: 'To confirm whether this is Ceratocystis fimbriata wilt or stem borer injury, please provide additional cross-section photos of the trunk base.',
      requestedInformation: 'Please slice the bark of the affected branch collar and check if there are dark brown/black streaks in the inner vascular wood. Share a clear close-up photograph.',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    });

    console.log('[Seeder] Database successfully seeded!');
    console.log('[Seeder] Demo Credentials:');
    console.log('  Admin:   admin@farmora.care      / Farmora@Admin2026');
    console.log('  Expert:  dr.shinde@farmora.care  / Expert@2026');
    console.log('  Expert:  dr.rao@farmora.care     / Expert@2026');
    console.log('  Farmer:  ramesh.patil@farmora.care / Farmer@2026');
    console.log('  Farmer:  suresh.deshmukh@farmora.care / Farmer@2026');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

seedData();

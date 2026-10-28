const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const ProblemCategory = require('../models/ProblemCategory');
const { PREDEFINED_CROPS, PREDEFINED_CATEGORIES } = require('../config/predefinedOptions');

async function syncPredefinedData() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/farmora_care';
  console.log('[Sync] Connecting to MongoDB:', uri);
  await mongoose.connect(uri);

  console.log('[Sync] 1. Synchronizing Predefined Crops...');
  for (const cropData of PREDEFINED_CROPS) {
    const existing = await Crop.findOne({ normalizedName: cropData.normalizedName });
    if (existing) {
      existing.name = cropData.name;
      existing.localNames = cropData.localNames;
      existing.season = cropData.season;
      existing.description = cropData.description || existing.description;
      existing.displayOrder = cropData.displayOrder;
      existing.isPredefined = true;
      existing.isActive = true;
      await existing.save();
      console.log(`  ✓ Updated crop: ${cropData.name} (order: ${cropData.displayOrder})`);
    } else {
      const created = await Crop.create({
        ...cropData,
        isActive: true,
      });
      console.log(`  + Created crop: ${cropData.name} (order: ${cropData.displayOrder})`);
    }
  }

  // Ensure non-predefined crops have displayOrder 99 and isPredefined: false
  await Crop.updateMany(
    { normalizedName: { $nin: PREDEFINED_CROPS.map((c) => c.normalizedName) } },
    { $set: { isPredefined: false, displayOrder: 99 } }
  );

  console.log('[Sync] 2. Synchronizing Predefined Problem Categories...');
  // Mapping of old/legacy category names to new predefined categories
  const legacyCategoryMapping = {
    'pest attack': 'pest infestation',
    'crop disease': 'crop diseases',
    'fertilizer issue': 'nutrient deficiency',
    'irrigation problem': 'irrigation problems',
    'weather/crop damage': 'weather damage',
  };

  // If old category exists, migrate it to the new name and preserve its ObjectId
  for (const [oldNorm, newNorm] of Object.entries(legacyCategoryMapping)) {
    const oldCat = await ProblemCategory.findOne({ normalizedName: oldNorm });
    const targetPredefined = PREDEFINED_CATEGORIES.find((c) => c.normalizedName === newNorm);
    if (oldCat && targetPredefined) {
      oldCat.name = targetPredefined.name;
      oldCat.normalizedName = targetPredefined.normalizedName;
      oldCat.description = targetPredefined.description;
      oldCat.icon = targetPredefined.icon;
      oldCat.localNames = targetPredefined.localNames;
      oldCat.displayOrder = targetPredefined.displayOrder;
      oldCat.isPredefined = true;
      oldCat.isActive = true;
      await oldCat.save();
      console.log(`  ✓ Migrated legacy category '${oldNorm}' -> '${targetPredefined.name}' (id: ${oldCat._id})`);
    }
  }

  // Ensure each predefined category exists
  for (const catData of PREDEFINED_CATEGORIES) {
    const existing = await ProblemCategory.findOne({ normalizedName: catData.normalizedName });
    if (existing) {
      existing.name = catData.name;
      existing.description = catData.description;
      existing.icon = catData.icon;
      existing.localNames = catData.localNames;
      existing.displayOrder = catData.displayOrder;
      existing.isPredefined = true;
      existing.isActive = true;
      await existing.save();
      console.log(`  ✓ Updated category: ${catData.name} (order: ${catData.displayOrder})`);
    } else {
      await ProblemCategory.create({
        ...catData,
        isActive: true,
      });
      console.log(`  + Created category: ${catData.name} (order: ${catData.displayOrder})`);
    }
  }

  // Non-predefined categories keep displayOrder: 99
  await ProblemCategory.updateMany(
    { normalizedName: { $nin: PREDEFINED_CATEGORIES.map((c) => c.normalizedName) } },
    { $set: { isPredefined: false, displayOrder: 99 } }
  );

  const totalCrops = await Crop.countDocuments();
  const totalCategories = await ProblemCategory.countDocuments();
  console.log(`[Sync] Complete. Total Crops: ${totalCrops}, Total Categories: ${totalCategories}`);

  await mongoose.disconnect();
}

if (require.main === module) {
  syncPredefinedData()
    .then(() => {
      console.log('[Sync] Success.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Sync] Error:', err);
      process.exit(1);
    });
}

module.exports = syncPredefinedData;

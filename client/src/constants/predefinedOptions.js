/**
 * Central Predefined Crops and Problem Categories for Farmora Care UI
 */
import {
  Bug,
  ShieldAlert,
  FlaskConical,
  Droplets,
  CloudRain,
  Sparkles,
} from 'lucide-react';

export const PREDEFINED_CROP_NAMES = [
  'Wheat',
  'Rice',
  'Cotton',
  'Soybean',
  'Sugarcane',
  'Tomato',
  'Onion',
  'Maize',
  'Other',
];

export const PREDEFINED_CATEGORIES_METADATA = [
  {
    name: 'Pest infestation',
    icon: Bug,
    iconName: 'Bug',
    description: 'Insects, bollworms, aphids, mites, thrips, caterpillars, stem borers',
    localNames: { mr: 'कीड प्रादुर्भाव', hi: 'कीट प्रकोप' },
    color: 'emerald',
  },
  {
    name: 'Crop diseases',
    icon: ShieldAlert,
    iconName: 'ShieldAlert',
    description: 'Fungal, bacterial, viral blights, rusts, wilts, powdery mildew, rot',
    localNames: { mr: 'पीक रोग', hi: 'फसल रोग' },
    color: 'rose',
  },
  {
    name: 'Nutrient deficiency',
    icon: FlaskConical,
    iconName: 'FlaskConical',
    description: 'Nitrogen, zinc, potassium deficiency, chlorosis, fertilizer scorch',
    localNames: { mr: 'अन्नद्रव्य कमतरता', hi: 'पोषक तत्वों की कमी' },
    color: 'amber',
  },
  {
    name: 'Irrigation problems',
    icon: Droplets,
    iconName: 'Droplets',
    description: 'Water stress, moisture deficit, over-watering, drip clogging, waterlogging',
    localNames: { mr: 'पाणी व सिंचन समस्या', hi: 'सिंचाई की समस्याएं' },
    color: 'blue',
  },
  {
    name: 'Weather damage',
    icon: CloudRain,
    iconName: 'CloudRain',
    description: 'Hailstorm, unseasonal heavy rain, lodging, frost, sun scald, heat stress',
    localNames: { mr: 'हवामान नुकसान', hi: 'मौसम से नुकसान' },
    color: 'slate',
  },
  {
    name: 'Weed management',
    icon: Sparkles,
    iconName: 'Sparkles',
    description: 'Weed competition, parasitic weeds (Cuscuta/Striga), unwanted overgrowth',
    localNames: { mr: 'तण व्यवस्थापन', hi: 'खरपतवार प्रबंधन' },
    color: 'teal',
  },
];

export const CROP_IMAGE_MAP = {
  wheat: '/images/crop_wheat.png',
  rice: '/images/crop_rice.png',
  cotton: '/images/crop_cotton.png',
  soybean: '/images/crop_soybean.png',
  sugarcane: '/images/crop_sugarcane.png',
  tomato: '/images/crop_tomato.png',
  onion: '/images/crop_onion.png',
  maize: '/images/crop_maize.png',
};

export const getCropImageUrl = (cropOrName) => {
  if (!cropOrName) return null;
  const name = (typeof cropOrName === 'string' ? cropOrName : (cropOrName.normalizedName || cropOrName.name || '')).toLowerCase();
  for (const [key, path] of Object.entries(CROP_IMAGE_MAP)) {
    if (name.includes(key)) return path;
  }
  return null;
};


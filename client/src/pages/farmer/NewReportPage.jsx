import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiClient } from '../../api/apiClient';
import { PREDEFINED_CROP_NAMES, getCropImageUrl } from '../../constants/predefinedOptions';
import {
  Camera,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  Sprout,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Bug,
  ShieldAlert,
  FlaskConical,
  Droplets,
  CloudRain,
  Sparkles,
  Check,
} from 'lucide-react';

const getCategoryIcon = (catName, iconName) => {
  const norm = (catName || '').toLowerCase();
  if (norm.includes('pest') || iconName === 'Bug') return Bug;
  if (norm.includes('disease') || iconName === 'ShieldAlert') return ShieldAlert;
  if (norm.includes('nutrient') || norm.includes('fertilizer') || iconName === 'FlaskConical') return FlaskConical;
  if (norm.includes('irrigation') || norm.includes('water') || iconName === 'Droplets') return Droplets;
  if (norm.includes('weather') || iconName === 'CloudRain') return CloudRain;
  if (norm.includes('weed') || iconName === 'Sparkles') return Sparkles;
  return Sprout;
};

export default function NewReportPage() {
  const navigate = useNavigate();
  const { t, getCropName, getCategoryName } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [customCropName, setCustomCropName] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    cropId: '',
    categoryId: '',
    description: '',
    village: '',
    district: '',
    state: 'Maharashtra',
    problemStartDate: '',
    affectedArea: '',
    growthStage: '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [cropsRes, catRes] = await Promise.all([
        apiClient.get('/crops'),
        apiClient.get('/categories'),
      ]);
      const cropList =
        cropsRes.crops ||
        cropsRes.data?.crops ||
        (Array.isArray(cropsRes.data?.data) ? cropsRes.data.data : null) ||
        (Array.isArray(cropsRes.data) ? cropsRes.data : []) ||
        [];
      const catList =
        catRes.categories ||
        catRes.data?.categories ||
        (Array.isArray(catRes.data?.data) ? catRes.data.data : null) ||
        (Array.isArray(catRes.data) ? catRes.data : []) ||
        [];
      setCrops(cropList);
      setCategories(catList);
    } catch (err) {
      console.error('Error fetching form options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      setError('You can upload a maximum of 5 photographs.');
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        setError(`File ${file.name} is not an allowed image format (JPEG, PNG, WebP).`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} exceeds the 10MB limit.`);
        continue;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedFiles([...selectedFiles, ...validFiles]);
    setPreviews([...previews, ...newPreviews]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...previews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const selectedCropObj = crops.find((c) => c._id === formData.cropId);
  const isOtherCropSelected = selectedCropObj?.name === 'Other' || selectedCropObj?.normalizedName === 'other';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.cropId || !formData.categoryId || !formData.description || !formData.district) {
      setError('Please fill in all mandatory fields (Title, Crop, Category, Description, District).');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      const submissionData = { ...formData };
      if (isOtherCropSelected && customCropName.trim()) {
        submissionData.description = `${submissionData.description}\n\n[Cultivated Crop specified by farmer: ${customCropName.trim()}]`;
      }

      Object.keys(submissionData).forEach((key) => {
        if (submissionData[key]) data.append(key, submissionData[key]);
      });

      selectedFiles.forEach((file) => {
        data.append('images', file);
      });

      const res = await apiClient('/problems', {
        method: 'POST',
        body: data,
      });

      const createdProblem = res.data?.problem || res.problem || res.data;
      if (createdProblem && createdProblem._id) {
        navigate(`/reports/${createdProblem._id}`);
      } else {
        navigate('/farmer/reports');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit problem report.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sort crops strictly following the user's required order 1-8 + Other
  const sortedCrops = [...crops].sort((a, b) => {
    const idxA = PREDEFINED_CROP_NAMES.indexOf(a.name);
    const idxB = PREDEFINED_CROP_NAMES.indexOf(b.name);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return (a.displayOrder || 99) - (b.displayOrder || 99);
  });

  const predefinedCategoryNames = [
    'Pest infestation',
    'Crop diseases',
    'Nutrient deficiency',
    'Irrigation problems',
    'Weather damage',
    'Weed management',
  ];

  const primaryCategories = categories
    .filter((c) => predefinedCategoryNames.some((p) => p.toLowerCase() === c.name.toLowerCase()))
    .sort((a, b) => {
      const idxA = predefinedCategoryNames.findIndex((p) => p.toLowerCase() === a.name.toLowerCase());
      const idxB = predefinedCategoryNames.findIndex((p) => p.toLowerCase() === b.name.toLowerCase());
      return idxA - idxB;
    });

  const otherCategories = categories.filter(
    (c) => !predefinedCategoryNames.some((p) => p.toLowerCase() === c.name.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-farm px-3 py-1 rounded-full bg-sprout">
          {t('appName')} • {t('reportProblem')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
          {t('newReportTitle')}
        </h1>
        <p className="text-sm text-charcoal-muted leading-relaxed">
          {t('newReportSubtitle')}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-sm text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="card-farm p-6 sm:p-8 space-y-6">
        {/* Section 1: Core Problem & Predefined Crop */}
        <div className="space-y-5">
          <h2 className="text-base font-bold text-forest border-b border-charcoal-border pb-2">
            1. Problem Title & Cultivated Crop
          </h2>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                {t('reportTitleLabel')} *
              </label>
              <span className={`text-[11px] font-mono ${formData.title.length > 140 ? 'text-amber-600 font-bold' : 'text-charcoal-muted'}`}>
                {formData.title.length}/150
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={150}
              name="title"
              placeholder={t('reportTitlePlaceholder')}
              value={formData.title}
              onChange={handleInputChange}
              className="input-farm text-base sm:text-sm"
            />
          </div>

          {/* Predefined Crop Dropdown & Visual Photographic Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                {t('cropLabel', 'Affected Crop')} *
              </label>
              <span className="text-xs text-charcoal-muted">
                Tap a crop or select from dropdown
              </span>
            </div>

            {/* Visual Crop Photographic Cards (8 Predefined Crops) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
              {sortedCrops.filter((c) => getCropImageUrl(c)).slice(0, 8).map((crop) => {
                const isSelected = formData.cropId === crop._id;
                const imageUrl = getCropImageUrl(crop);
                return (
                  <button
                    key={crop._id}
                    type="button"
                    onClick={() => setFormData({ ...formData, cropId: crop._id })}
                    className={`group text-left p-2 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-farm bg-sprout/70 ring-2 ring-farm shadow-xs'
                        : 'border-charcoal-border bg-white hover:border-farm/50 hover:bg-pale-green/30'
                    }`}
                    aria-label={`Select ${crop.name} crop`}
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-sprout shrink-0 border border-farm/20">
                      <img
                        src={imageUrl}
                        alt={`${crop.name} crop leaf and field sample`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-bold truncate ${isSelected ? 'text-forest' : 'text-charcoal group-hover:text-forest'}`}>
                        {getCropName(crop)}
                      </div>
                      {crop.season && (
                        <div className="text-[10px] text-charcoal-muted truncate">
                          {crop.season}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-farm text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <select
              required
              name="cropId"
              value={formData.cropId}
              onChange={handleInputChange}
              className="input-farm text-base sm:text-sm font-medium"
              disabled={loadingOptions}
            >
              <option value="">{t('selectCropPlaceholder', '-- Select Cultivated Crop --')}</option>
              {sortedCrops.map((c, idx) => (
                <option key={c._id} value={c._id}>
                  {idx < 8 ? `${idx + 1}. ` : ''}{getCropName(c)} {c.season ? `(${c.season})` : ''}
                </option>
              ))}
            </select>

            {/* If Other crop selected, prompt for specific crop name */}
            {isOtherCropSelected && (
              <div className="mt-3 p-3.5 rounded-xl bg-sprout/40 border border-farm/30 space-y-1.5">
                <label className="block text-xs font-bold text-forest">
                  Specify Crop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Turmeric, Ginger, Guava, Marigold..."
                  value={customCropName}
                  onChange={(e) => setCustomCropName(e.target.value)}
                  className="input-farm bg-white text-sm"
                />
                <p className="text-[11px] text-charcoal-muted">
                  Your custom crop name will be highlighted directly to the reviewing agronomist.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Predefined Problem Categories (Selectable Cards) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                {t('categoryLabel', 'Problem Category')} *
              </label>
              <span className="text-xs text-charcoal-muted">
                Select 1 agricultural challenge
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {primaryCategories.map((cat, idx) => {
                const Icon = getCategoryIcon(cat.name, cat.icon);
                const isSelected = formData.categoryId === cat._id;
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => setFormData({ ...formData, categoryId: cat._id })}
                    className={`relative p-4 rounded-xl border text-left transition-all flex flex-col justify-between group cursor-pointer ${
                      isSelected
                        ? 'border-forest bg-sprout/60 shadow-sm ring-2 ring-forest/20'
                        : 'border-charcoal-border bg-white hover:border-farm/60 hover:bg-pale-green/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-forest text-white' : 'bg-sprout text-farm group-hover:bg-forest group-hover:text-white'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-forest bg-forest text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-farm/70">#{idx + 1}</span>
                        <h4 className="font-bold text-forest text-sm leading-tight">
                          {getCategoryName(cat)}
                        </h4>
                      </div>
                      <p className="text-[11px] text-charcoal-muted leading-snug mt-1 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Other / Legacy Categories Fallback */}
            {otherCategories.length > 0 && (
              <div className="pt-2">
                <details className="text-xs text-charcoal-muted cursor-pointer">
                  <summary className="font-semibold text-farm hover:underline">
                    Need another category? View additional options
                  </summary>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {otherCategories.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => setFormData({ ...formData, categoryId: cat._id })}
                        className={`p-2.5 rounded-lg border text-left text-xs ${
                          formData.categoryId === cat._id
                            ? 'border-forest bg-sprout font-bold text-forest'
                            : 'border-slate-200 bg-white hover:border-farm'
                        }`}
                      >
                        {getCategoryName(cat)}
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
              Detailed Symptom Description *
            </label>
            <textarea
              required
              name="description"
              rows={4}
              placeholder="Describe symptoms in detail: leaf color, texture, spots, presence of insects/frass, wilting patterns, or recent fertilizer applications..."
              value={formData.description}
              onChange={handleInputChange}
              className="input-farm"
            />
          </div>
        </div>

        {/* Section 2: Photographic Evidence */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-charcoal-border pb-2">
            <h2 className="text-base font-bold text-forest">
              2. Photographic Evidence
            </h2>
            <span className="text-xs text-charcoal-muted font-medium">
              Max 5 images (JPEG, PNG, WebP)
            </span>
          </div>

          {/* Photo Diagnosis Guidelines Strip */}
          <div className="p-4 rounded-xl bg-sprout/40 border border-farm/25 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-farm" /> Photo Diagnostic Reference Guidelines
              </span>
              <span className="text-[11px] text-charcoal-muted">Illustrative guidelines only</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-charcoal-border/70">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-leaf/30 bg-sprout">
                  <img
                    src="/images/macro_healthy_leaf.png"
                    alt="Healthy crop foliage reference showing natural leaf venation"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-forest">1. Healthy Leaf</div>
                  <div className="text-[11px] text-charcoal-muted leading-tight mt-0.5">
                    Clear foliage showing normal veins for baseline comparison
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-charcoal-border/70">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-leaf/30 bg-sprout">
                  <img
                    src="/images/macro_leaf_pest.png"
                    alt="Pest-affected leaf showing aphid feeding marks and damage"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-forest">2. Pest & Leaf Spots</div>
                  <div className="text-[11px] text-charcoal-muted leading-tight mt-0.5">
                    Close-ups of lesions, discoloration, or insect clusters
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-charcoal-border/70">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-leaf/30 bg-sprout">
                  <img
                    src="/images/macro_stem_damage.png"
                    alt="Damaged stem and collar root rot symptom"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-forest">3. Stem & Root Collar</div>
                  <div className="text-[11px] text-charcoal-muted leading-tight mt-0.5">
                    Inspect stem base near soil line for rot or borers
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-charcoal-muted italic">
              Note: Reference photos are illustrative guidelines to help you capture useful symptoms. Please upload actual photographs of your field problem below.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-charcoal-border hover:border-farm rounded-xl p-6 text-center bg-sprout/20 transition-colors cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2 pointer-events-none">
              <UploadCloud className="w-10 h-10 text-farm mx-auto" />
              <div className="text-sm font-bold text-forest">
                Click to browse or drag & drop crop photographs
              </div>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                Tip: Take clear, well-lit photos showing both healthy and diseased leaves for higher diagnostic accuracy.
              </p>
            </div>
          </div>

          {/* Thumbnail Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-charcoal-border group h-24">
                  <img src={preview} alt="Evidence preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Geographic & Crop Parameters */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-forest border-b border-charcoal-border pb-2">
            3. Farm Location & Growth Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Village / Locality
              </label>
              <input
                type="text"
                name="village"
                placeholder="e.g. Karmala"
                value={formData.village}
                onChange={handleInputChange}
                className="input-farm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                District *
              </label>
              <input
                type="text"
                required
                name="district"
                placeholder="e.g. Solapur"
                value={formData.district}
                onChange={handleInputChange}
                className="input-farm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="input-farm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Approx. Start Date
              </label>
              <input
                type="date"
                name="problemStartDate"
                value={formData.problemStartDate}
                onChange={handleInputChange}
                className="input-farm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Affected Area
              </label>
              <input
                type="text"
                name="affectedArea"
                placeholder="e.g. 1.5 Acres / 50 Plants"
                value={formData.affectedArea}
                onChange={handleInputChange}
                className="input-farm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Crop Growth Stage
              </label>
              <input
                type="text"
                name="growthStage"
                placeholder="e.g. Flowering / Vegetative"
                value={formData.growthStage}
                onChange={handleInputChange}
                className="input-farm"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-charcoal-border">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary py-3 px-8 text-sm font-bold shadow-md"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Submit Report to Agronomists
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

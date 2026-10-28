import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ShieldAlert,
  Sprout,
  CheckCircle2,
  Droplet,
  AlertTriangle
} from 'lucide-react';

const FORMULARY_DATA = [
  {
    name: 'Imidacloprid 17.8% SL',
    type: 'Insecticide (Neonicotinoid)',
    category: 'Pest Attack',
    target: 'Thrips, Aphids, Jassids, Whitefly (Vector control)',
    dosage: '0.3 to 0.5 ml per liter of water (50-60 ml/acre)',
    crops: 'Cotton, Chilli, Tomato, Okra, Rice',
    phi: '15-21 days',
    safety: 'Harmful to bees; strictly avoid spraying during active honeybee pollination hours.'
  },
  {
    name: 'Fipronil 5% SC',
    type: 'Insecticide (Phenylpyrazole)',
    category: 'Pest Attack',
    target: 'Stem borer, Gall midge, Leaf folder, Thrips',
    dosage: '2.0 ml per liter of water (400 ml/acre)',
    crops: 'Rice, Chilli, Cotton, Cabbage',
    phi: '7-14 days',
    safety: 'Wear nitrile protective gloves. Do not contaminate fish-bearing irrigation ponds.'
  },
  {
    name: 'Emamectin Benzoate 5% SG',
    type: 'Insecticide (Avermectin derivative)',
    category: 'Pest Attack',
    target: 'Helicoverpa armigera, Pink Bollworm, Fall Armyworm, Diamondback Moth',
    dosage: '0.4 g per liter of water (80-100 g/acre)',
    crops: 'Cotton, Gram/Chickpea, Tomato, Maize, Cabbage',
    phi: '3-5 days',
    safety: 'Rapidly absorbed by plant cuticle. Spray in evening hours.'
  },
  {
    name: 'Mancozeb 75% WP',
    type: 'Contact Fungicide (Dithiocarbamate)',
    category: 'Crop Disease',
    target: 'Early & Late Blight, Leaf Spots, Downy Mildew, Rust',
    dosage: '2.0 to 2.5 g per liter of water (600-800 g/acre)',
    crops: 'Potato, Tomato, Groundnut, Wheat, Grapes',
    phi: '7 days',
    safety: 'Broad-spectrum multisite inhibitor. Highly effective as preventive barrier before rain.'
  },
  {
    name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
    type: 'Systemic Fungicide (Strobilurin + Triazole)',
    category: 'Crop Disease',
    target: 'Powdery Mildew, Anthracnose, Sheath Blight, Dieback',
    dosage: '1.0 ml per liter of water (200 ml/acre)',
    crops: 'Chilli, Tomato, Rice, Apple, Mango',
    phi: '5-10 days',
    safety: 'Dual mode of action (preventive & curative). Rotate with copper to avoid resistance.'
  },
  {
    name: 'Copper Oxychloride 50% WP + Streptocycline',
    type: 'Bactericide / Fungicide Combination',
    category: 'Crop Disease',
    target: 'Bacterial Leaf Blight (BLB), Bacterial Canker, Black Rot',
    dosage: 'COC 2.5 g/L + Streptocycline 0.1 g/L (6g packet in 60L water)',
    crops: 'Rice, Citrus, Pomegranate, Tomato, Cotton',
    phi: '14 days',
    safety: 'Do not tank-mix with acidic solutions or organophosphates.'
  },
  {
    name: 'Trichoderma viride 1.5% WP (Bio-Fungicide)',
    type: 'Organic Bio-agent',
    category: 'Crop Disease',
    target: 'Fusarium Wilt, Root Rot, Damping Off, Collar Rot',
    dosage: 'Seed treatment: 5-10g/kg seed; Soil drench: 2.5 kg/acre in 100kg FYM',
    crops: 'Soybean, Cotton, Pulses, Vegetables, Ginger',
    phi: '0 days (Organic / Nil)',
    safety: 'Live spore formulation. Never tank-mix with chemical fungicides.'
  },
  {
    name: 'Azadirachtin 10,000 PPM (Neem Extract)',
    type: 'Organic Botanical Insecticide',
    category: 'Pest Attack',
    target: 'Whitefly, Leaf miner, Caterpillars, Mites (Anti-feedant & oviposition deterrent)',
    dosage: '2.0 ml per liter of water',
    crops: 'All Organic & Conventional Horticultural Crops',
    phi: '0 days',
    safety: 'Completely safe for beneficial insects and predators when applied at dusk.'
  }
];

export default function FormularyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = FORMULARY_DATA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.crops.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Clinical Reference & Formulary
          </div>
          <h1 className="text-3xl font-extrabold text-forest-green font-serif">
            Agronomist Chemical & Bio-Formulary
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            CIB&RC approved dosage guidelines, pre-harvest intervals (PHI), and safety precautions for Indian agricultural conditions.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="card-farm p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search chemical name, target pest, or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white"
              />
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-farm-green bg-white text-slate-700"
              >
                <option value="">All Problem Types</option>
                <option value="Pest Attack">Pest Attack</option>
                <option value="Crop Disease">Crop Disease</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formulary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item, index) => (
            <div key={index} className="card-farm p-6 flex flex-col justify-between hover:border-farm-green transition-all shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-forest-green font-serif">{item.name}</h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 bg-light-green text-forest-green rounded-full shrink-0">
                    {item.type}
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-700 mt-3">
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Target Pests / Pathogens:</span>
                    <p className="text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">{item.target}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                      <span className="font-bold text-emerald-900 block text-[11px] uppercase">Standard Dosage</span>
                      <p className="font-semibold text-emerald-800 text-xs mt-0.5">{item.dosage}</p>
                    </div>

                    <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100">
                      <span className="font-bold text-amber-900 block text-[11px] uppercase">Pre-Harvest Interval (PHI)</span>
                      <p className="font-semibold text-amber-800 text-xs mt-0.5">{item.phi}</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Approved Crops:</span>
                    <p className="text-slate-600">{item.crops}</p>
                  </div>

                  <div className="p-2.5 bg-red-50/40 rounded-lg border border-red-100">
                    <span className="font-bold text-red-900 flex items-center gap-1 text-[11px] uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      Safety & Precaution:
                    </span>
                    <p className="text-red-800 text-xs mt-0.5">{item.safety}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

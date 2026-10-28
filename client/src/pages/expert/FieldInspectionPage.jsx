import React, { useState } from 'react';
import {
  MapPin,
  Camera,
  CheckCircle2,
  Calendar,
  Layers,
  Thermometer,
  Droplets,
  Wind,
  Save,
  Clock,
  ClipboardList
} from 'lucide-react';

export default function FieldInspectionPage() {
  const [reportNumber, setReportNumber] = useState('FC-9104');
  const [inspectionData, setInspectionData] = useState({
    village: 'Baramati, Pune',
    gpsCoordinates: '18.1517° N, 74.5774° E',
    canopyCoverage: '75%',
    soilMoistureStatus: 'Adequate (Field capacity ~65%)',
    infestationDensity: 'High (Approx 28 thrips per leaf underside)',
    weatherConditions: 'Warm & humid (31°C, 68% RH)',
    visualObservations: 'Upward leaf curling, vein thickening, stunted terminal shoots. Clear signs of Thrips-induced ChiVMV viral vector damage.',
    immediateRemedy: 'Recommended evening misting with systemic insecticide followed by biological barrier.'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="min-h-screen bg-pale-green/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-farm-green uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" />
            Field Telemetry & In-Situ Audit
          </div>
          <h1 className="text-3xl font-extrabold text-forest-green font-serif">
            On-Field Agronomic Inspection
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Record localized microclimate telemetry, soil condition, and pest population density during on-site farm visits.
          </p>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-farm-green shrink-0" />
            <span className="text-sm font-semibold">Field inspection entry logged into permanent audit telemetry.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="card-farm p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-forest-green border-b border-light-green pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-farm-green" />
              Inspection Geolocation & Target Case
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Case ID Reference</label>
                <input
                  type="text"
                  value={reportNumber}
                  onChange={(e) => setReportNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-farm-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">GPS Coordinates</label>
                <input
                  type="text"
                  value={inspectionData.gpsCoordinates}
                  readOnly
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="card-farm p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-forest-green border-b border-light-green pb-3 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-farm-green" />
              Microclimate & Soil Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Soil Moisture</label>
                <input
                  type="text"
                  value={inspectionData.soilMoistureStatus}
                  onChange={(e) => setInspectionData({ ...inspectionData, soilMoistureStatus: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Canopy Coverage</label>
                <input
                  type="text"
                  value={inspectionData.canopyCoverage}
                  onChange={(e) => setInspectionData({ ...inspectionData, canopyCoverage: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Weather & Temp</label>
                <input
                  type="text"
                  value={inspectionData.weatherConditions}
                  onChange={(e) => setInspectionData({ ...inspectionData, weatherConditions: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Pest/Pathogen Population Density</label>
              <input
                type="text"
                value={inspectionData.infestationDensity}
                onChange={(e) => setInspectionData({ ...inspectionData, infestationDensity: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">In-Situ Microscopic & Field Findings</label>
              <textarea
                rows={3}
                value={inspectionData.visualObservations}
                onChange={(e) => setInspectionData({ ...inspectionData, visualObservations: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-farm-green"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5"
            >
              <Save className="w-4 h-4" />
              Save Field Inspection Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

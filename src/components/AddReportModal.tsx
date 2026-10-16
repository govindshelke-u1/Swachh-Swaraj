import React, { useState } from 'react';
import { GarbageReport } from '../types';
import { X, AlertTriangle, MapPin, Send } from 'lucide-react';

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Partial<GarbageReport>) => void;
  currentWard: string;
}

export const AddReportModal: React.FC<AddReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentWard
}) => {
  const [place, setPlace] = useState('');
  const [source, setSource] = useState<GarbageReport['source']>('Citizen report');
  const [category, setCategory] = useState<GarbageReport['category']>('Mixed Waste');
  const [severity, setSeverity] = useState<GarbageReport['severity']>('Medium');
  const [notes, setNotes] = useState('');
  const [lat, setLat] = useState('18.5235');
  const [lng, setLng] = useState('73.8572');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!place.trim()) return;

    onSubmit({
      place,
      ward: currentWard,
      source,
      category,
      severity,
      notes,
      lat: parseFloat(lat) || 18.522,
      lng: parseFloat(lng) || 73.856
    });

    onClose();
    setPlace('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              ♨
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Report Garbage Hotspot</h3>
              <p className="text-[11px] text-slate-500">Record a citizen complaint or field sanitation inspection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Location / Street Landmark *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={place}
                onChange={e => setPlace(e.target.value)}
                placeholder="e.g. Shivaji Chowk Corner, Near Milk Dairy"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Source</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as GarbageReport['source'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Citizen report">Citizen report (App / Toll-free)</option>
                <option value="Field inspection">Field inspection (Sanitation crew)</option>
                <option value="IoT Overflow">IoT Overflow sensor</option>
                <option value="Sanitation Supervisor">Sanitation Supervisor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Severity / Urgency</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as GarbageReport['severity'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Low">Low (Isolated litter)</option>
                <option value="Medium">Medium (Accumulated debris)</option>
                <option value="High">High (Roadside overflow)</option>
                <option value="Critical">Critical (Blocked drainage / health hazard)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category of Waste</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as GarbageReport['category'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Mixed Waste">Mixed General Waste</option>
                <option value="Plastic & Dry">Plastic & Dry Packaging</option>
                <option value="Organic / Kitchen">Organic / Kitchen / Market</option>
                <option value="Commercial Dump">Commercial / Shop Dump</option>
                <option value="Debris">Construction Debris</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Municipal Ward</label>
              <input
                type="text"
                disabled
                value={currentWard}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={e => setLat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={e => setLng(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Observations / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe dumping patterns, nearby shops, or specific issues..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Hotspot Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

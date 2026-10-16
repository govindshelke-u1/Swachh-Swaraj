import React, { useState } from 'react';
import { Dustbin } from '../types';
import { X, Trash2, MapPin, CheckCircle2 } from 'lucide-react';

interface AddBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bin: Partial<Dustbin>) => void;
  currentWard: string;
}

export const AddBinModal: React.FC<AddBinModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentWard
}) => {
  const [place, setPlace] = useState('');
  const [type, setType] = useState('Wet & Dry (2-compartment)');
  const [capacityLiters, setCapacityLiters] = useState(120);
  const [lat, setLat] = useState('18.5215');
  const [lng, setLng] = useState('73.8545');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!place.trim()) return;

    onSubmit({
      place,
      ward: currentWard,
      type,
      capacityLiters,
      lat: parseFloat(lat) || 18.522,
      lng: parseFloat(lng) || 73.856,
      status: 'Active'
    });

    onClose();
    setPlace('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ♜
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Add Municipal Dustbin</h3>
              <p className="text-[11px] text-slate-500">Register new waste infrastructure to ward inventory</p>
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
            <label className="block text-slate-700 font-semibold mb-1">Installation Location / Address *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={place}
                onChange={e => setPlace(e.target.value)}
                placeholder="e.g. Opposite Municipal Dispensary, Station Road"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Dustbin Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Wet & Dry (2-compartment)">Wet & Dry (2-compartment)</option>
                <option value="General waste">General Waste Single Bin</option>
                <option value="Recyclables (3-bin station)">3-Bin Segregation Station</option>
                <option value="Smart Sensor Compactor">Smart Sensor Compactor (Solar)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Capacity (Liters)</label>
              <select
                value={capacityLiters}
                onChange={e => setCapacityLiters(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value={60}>60 Liters (Pedestrian pole-mount)</option>
                <option value={80}>80 Liters (Standard street bin)</option>
                <option value={120}>120 Liters (Commercial roadside)</option>
                <option value={240}>240 Liters (Heavy traffic market bin)</option>
                <option value={1100}>1,100 Liters (Community dumper hopper)</option>
              </select>
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Register Dustbin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { CitizenReport, CitizenData } from '../types';
import { api } from '../services/api';
import {
  Camera,
  MapPin,
  Send,
  Star,
  Award,
  FileText,
  Medal,
  CheckCircle2,
  AlertCircle,
  Search,
  Building2,
  Home,
  Printer,
  X,
  Upload,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface CitizenPortalProps {
  onBackToHome: () => void;
  onGoToMunicipal: () => void;
  citizenData: CitizenData;
  onUpdateCitizenData: (data: CitizenData) => void;
  showToast: (msg: string) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  onBackToHome,
  onGoToMunicipal,
  citizenData,
  onUpdateCitizenData,
  showToast
}) => {
  // Form State
  const [citizenName, setCitizenName] = useState('Govind Shelke');
  const [address, setAddress] = useState('Near Market Road, Ward 4');
  const [description, setDescription] = useState('');
  const [photoData, setPhotoData] = useState<string>('');
  const [lat, setLat] = useState<number>(18.5235);
  const [lng, setLng] = useState<number>(73.8572);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize Citizen Pinning Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 14,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const initialMarker = L.marker([lat, lng], {
      draggable: true,
      icon: L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="width: 32px; height: 32px; background: #ea580c; border: 3px solid #fff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
            <span style="transform: rotate(45deg); color: #fff; font-weight: bold; font-size: 14px;">📍</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    }).addTo(map);

    initialMarker.bindPopup('<b>Selected Location</b><br>Drag pin or click map to move').openPopup();

    initialMarker.on('dragend', () => {
      const pos = initialMarker.getLatLng();
      setLat(Number(pos.lat.toFixed(5)));
      setLng(Number(pos.lng.toFixed(5)));
    });

    map.on('click', e => {
      const { lat: newLat, lng: newLng } = e.latlng;
      setLat(Number(newLat.toFixed(5)));
      setLng(Number(newLng.toFixed(5)));
      initialMarker.setLatLng([newLat, newLng]);
    });

    markerRef.current = initialMarker;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Search on Map
  const handleMapSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearchQuery.trim() || !mapInstanceRef.current) return;

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        mapSearchQuery + ', Maharashtra, India'
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        const p = data[0];
        const newLat = parseFloat(p.lat);
        const newLng = parseFloat(p.lon);
        mapInstanceRef.current.flyTo([newLat, newLng], 16);
        setLat(Number(newLat.toFixed(5)));
        setLng(Number(newLng.toFixed(5)));
        setAddress(p.display_name.split(',').slice(0, 3).join(', '));
        if (markerRef.current) markerRef.current.setLatLng([newLat, newLng]);
        showToast('Location found and pinned on map.');
      } else {
        showToast('Place not found. You can click directly on the map to place your pin.');
      }
    } catch {
      showToast('Search service unavailable. Please click directly on the map.');
    }
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showToast('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be 5MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoData(reader.result as string);
      showToast('Photo uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  // Preset Sample Photos for Fast Testing
  const setSamplePhoto = (url: string, label: string) => {
    setPhotoData(url);
    showToast(`Loaded ${label}`);
  };

  // Submit Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      showToast('Please provide an address or landmark.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.submitCitizenReport({
        citizenName,
        address,
        description: description || 'Roadside garbage accumulation reported by citizen.',
        lat,
        lng,
        photo: photoData
      });

      // Update state
      onUpdateCitizenData({
        ...citizenData,
        reports: [result.report, ...citizenData.reports]
      });

      showToast('Report submitted! It is now pending municipal officer verification.');
      setDescription('');
    } catch (err: any) {
      showToast(err.message || 'Error submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate Officer Verification (Allows instant gratification in demo!)
  const handleSimulateVerification = async (reportId: string) => {
    try {
      const result = await api.verifyCitizenReport(reportId, 'genuine');
      const updatedReports = citizenData.reports.map(r =>
        r.id === reportId ? { ...r, status: 'Genuine · Star awarded' as const, earned: true } : r
      );
      const newStars = citizenData.stars + 1;
      const newCerts = newStars % 10 === 0 ? citizenData.certificates + 1 : citizenData.certificates;

      onUpdateCitizenData({
        ...citizenData,
        stars: newStars,
        certificates: newCerts,
        reports: updatedReports
      });

      showToast(`Demo Officer verified report ${reportId}! +1 Star awarded.`);
      if (newStars % 10 === 0) {
        setIsCertModalOpen(true);
      }
    } catch {
      showToast('Report verified locally.');
    }
  };

  const progressPercent = (citizenData.stars % 10) * 10;
  const currentRank =
    citizenData.medals > 0
      ? 'Swachh Swaraj Medalist'
      : citizenData.certificates > 0
      ? 'Certificate Earner'
      : citizenData.stars >= 5
      ? 'Senior Contributor'
      : 'Cleanliness Contributor';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Top Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            ♻
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                SWACHH SWARAJ
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Citizen Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Cleaner Cities • Healthier Tomorrow</p>
          </div>
        </div>

        {/* Portal Switchers */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home / Landing</span>
          </button>
          <button
            onClick={onGoToMunicipal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Municipal Portal →</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full p-4 md:p-6 space-y-5">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 z-10 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your city. Your contribution. 🌱</h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Spot garbage, take a photo, pin the location, and help your municipal corporation create cleaner wards. Every verified report awards you a star and brings you closer to an official Certificate of Appreciation.
            </p>
          </div>

          <div className="z-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center shrink-0 min-w-[170px]">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200 block font-semibold">
              Certificate Progress
            </span>
            <strong className="text-3xl font-black text-white block my-0.5">
              {citizenData.stars % 10} / 10
            </strong>
            <span className="text-[10px] text-emerald-200">stars to next certificate</span>
          </div>
        </section>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
              ★
            </div>
            <div>
              <strong className="text-2xl font-black text-slate-900 leading-tight">{citizenData.stars}</strong>
              <small className="text-[11px] text-slate-500 block">Verified stars</small>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
              ♧
            </div>
            <div>
              <strong className="text-2xl font-black text-slate-900 leading-tight">
                {citizenData.reports.length}
              </strong>
              <small className="text-[11px] text-slate-500 block">Reports submitted</small>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              ▤
            </div>
            <div>
              <strong className="text-2xl font-black text-slate-900 leading-tight">
                {citizenData.certificates}
              </strong>
              <small className="text-[11px] text-slate-500 block">Certificates earned</small>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
              🏅
            </div>
            <div>
              <strong className="text-2xl font-black text-slate-900 leading-tight">{citizenData.medals}</strong>
              <small className="text-[11px] text-slate-500 block">Medals earned</small>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Form & Reports + Right Rewards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Report Garbage Form */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>📸 Report a Garbage Hotspot</span>
                </h3>
                <p className="text-xs text-slate-500">Share a photo and pinpoint the location for the municipal crew.</p>
              </div>

              <form onSubmit={handleSubmitReport} className="p-5 space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={e => setCitizenName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Photo Upload Zone */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Upload Photo of Cleanliness Issue <span className="text-rose-500">*</span>
                  </label>

                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 text-center hover:bg-slate-100 transition relative">
                    <input
                      type="file"
                      id="citizenPhotoInput"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label htmlFor="citizenPhotoInput" className="cursor-pointer block space-y-1">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <strong className="block text-xs text-slate-800">Click to upload photo or take picture</strong>
                      <span className="text-[11px] text-slate-400">JPG, PNG, or WEBP (Max 5MB)</span>
                    </label>

                    {/* Quick Demo Photo Presets */}
                    <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
                      <span className="text-slate-400">Quick test photos:</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSamplePhoto(
                            'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&q=80',
                            'Overflowing waste bags'
                          )
                        }
                        className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                      >
                        Sample 1 (Bags)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSamplePhoto(
                            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&q=80',
                            'Plastic street litter'
                          )
                        }
                        className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                      >
                        Sample 2 (Plastic)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSamplePhoto(
                            'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&q=80',
                            'Overflowing corner bin'
                          )
                        }
                        className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                      >
                        Sample 3 (Bin Dump)
                      </button>
                    </div>
                  </div>

                  {/* Photo Preview */}
                  {photoData && (
                    <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-200 max-h-44 bg-slate-900">
                      <img src={photoData} alt="Preview" className="w-full h-44 object-cover" />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white">
                        Attached Photo
                      </span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Address / Landmark <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="e.g. Near Bus Stand, Shivaji Chowk, Ward 4"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Interactive Map Picker */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Pin Location on Map <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={mapSearchQuery}
                      onChange={e => setMapSearchQuery(e.target.value)}
                      placeholder="Search street, chowk or area in Pune..."
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleMapSearch}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs"
                    >
                      Search
                    </button>
                  </div>

                  <div className="h-52 w-full rounded-xl border border-slate-200 overflow-hidden relative">
                    <div ref={mapContainerRef} className="w-full h-full" />
                  </div>

                  <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Click anywhere on the map or drag the pin to adjust position.</span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    What did you notice?
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the garbage pile, odor, overflowing bin, or timing..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Report...' : 'Submit Cleanliness Report →'}</span>
                </button>

                <p className="text-[10px] text-slate-400 text-center">
                  Your report will be marked <strong>Pending Verification</strong>. A star is added once verified by an authorized municipal officer.
                </p>
              </form>
            </section>

            {/* My Reports List */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">🧾 My Submitted Reports</h3>
                  <p className="text-xs text-slate-500">Track verification status of your contributions</p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  {citizenData.reports.length}
                </span>
              </div>

              <div className="p-4 space-y-3">
                {citizenData.reports.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No reports submitted yet.</p>
                ) : (
                  citizenData.reports.map(rep => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={rep.photo}
                          alt="Report photo"
                          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <strong className="text-slate-900 block font-semibold">{rep.address}</strong>
                          <span className="text-[11px] text-slate-400 block">
                            {rep.id} • {rep.date}
                          </span>
                          <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{rep.description}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            rep.status === 'Genuine · Star awarded'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : rep.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {rep.status}
                        </span>

                        {rep.status === 'Pending Verification' && (
                          <button
                            onClick={() => handleSimulateVerification(rep.id)}
                            className="px-2 py-1 rounded bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-semibold transition"
                            title="Simulate municipal verification in this prototype"
                          >
                            Simulate Officer Verification
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column (5 cols): Rewards & Roadmap */}
          <div className="lg:col-span-5 space-y-5">
            {/* Rewards Card */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{currentRank}</h3>
                  <p className="text-xs text-slate-500">
                    {citizenData.stars > 0
                      ? 'Thank you for keeping Maharashtra clean!'
                      : 'Your first verified star starts your journey.'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold">
                  🌟
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Certificate Progress</span>
                  <strong className="text-amber-700">{citizenData.stars % 10} of 10 stars</strong>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* 10 Star Grid */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const currentCycleStars = citizenData.stars % 10;
                  const isEarned = i < currentCycleStars || (citizenData.stars > 0 && currentCycleStars === 0);
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xl transition ${
                        isEarned
                          ? 'bg-amber-100 border-2 border-amber-400 text-amber-600 shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-300'
                      }`}
                    >
                      {isEarned ? '★' : '☆'}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                One verified genuine report = <strong>1 Star</strong>. Collect 10 stars to unlock your official Certificate of Appreciation. 10 certificates award the Swachh Swaraj Civic Medal!
              </div>
            </section>

            {/* Achievement Roadmap */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">🏆 Achievement Roadmap</h3>
                <p className="text-xs text-slate-500">Government recognition for civic contributors</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">⭐</span>
                    <div>
                      <strong className="block text-slate-800">Verified Contributor</strong>
                      <span className="text-[11px] text-slate-400">Earn stars from genuine reports</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {citizenData.stars} stars
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">📜</span>
                    <div>
                      <strong className="block text-slate-800">Cleanliness Certificate</strong>
                      <span className="text-[11px] text-slate-400">Collect 10 verified stars</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {citizenData.certificates} earned
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🏅</span>
                    <div>
                      <strong className="block text-slate-800">Swachh Swaraj Medal</strong>
                      <span className="text-[11px] text-slate-400">Collect 10 certificates</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                    {citizenData.medals} earned
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCertModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Award className="w-4 h-4" />
                <span>View & Print Certificate Preview</span>
              </button>
            </section>

            {/* Community Guidelines */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                🌿 Community Guidelines
              </h4>
              <ul className="space-y-1.5 text-slate-600 text-[11px] list-disc pl-4">
                <li>Report authentic garbage piles and overflowing municipal bins.</li>
                <li>Avoid duplicate submissions for the same spot within 48 hours.</li>
                <li>Never enter unsafe roadways or private premises to take photos.</li>
                <li>Municipal field teams prioritize spots with multiple citizen reports.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Certificate Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-800">🎉 Official Certificate Preview</h3>
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Certificate Box */}
            <div className="border-4 border-double border-amber-500/80 p-6 rounded-xl bg-[#fffdf7] text-slate-800 space-y-3 shadow-inner">
              <div className="text-3xl">🌿</div>
              <div className="text-[10px] tracking-widest uppercase font-bold text-amber-700">
                SWACHH SWARAJ • MAHARASHTRA
              </div>
              <h2 className="text-xl font-serif font-extrabold text-emerald-900">Certificate of Appreciation</h2>
              <p className="text-xs text-slate-600 italic">This certificate of civic appreciation is presented to</p>
              <h3 className="text-lg font-bold text-slate-900 border-b border-amber-300 pb-1 w-fit mx-auto px-4">
                {citizenName || 'Citizen Contributor'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                in recognition of active civic participation, geo-reporting garbage hotspots, and earning verified cleanliness contribution stars toward a cleaner and healthier Maharashtra.
              </p>
              <div className="pt-3 flex justify-between items-center text-[10px] text-slate-400 border-t border-amber-200/60">
                <span>Verified: {new Date().toLocaleDateString('en-GB')}</span>
                <span className="font-bold text-amber-800">Pune Municipal Corporation</span>
              </div>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

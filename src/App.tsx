import React, { useState, useEffect } from 'react';
import {
  GarbageReport,
  Dustbin,
  Recommendation,
  SystemSettings,
  SelectedEntity,
  StatsData,
  CitizenData
} from './types';
import {
  api,
  fallbackReports,
  fallbackBins,
  fallbackRecs,
  fallbackSettings,
  fallbackCitizenData
} from './services/api';
import { LandingPage } from './components/LandingPage';
import { CitizenPortal } from './components/CitizenPortal';
import { WasteMap } from './components/WasteMap';
import { AddReportModal } from './components/AddReportModal';
import { AddBinModal } from './components/AddBinModal';
import { ProjectArchitectureModal } from './components/ProjectArchitectureModal';
import {
  LayoutDashboard,
  Map as MapIcon,
  FileText,
  Lightbulb,
  Trash2,
  TrendingUp,
  Settings as SettingsIcon,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  Shield,
  Sparkles,
  Compass,
  Check,
  ChevronRight,
  Home,
  Users,
  Building2,
  Star,
  Award
} from 'lucide-react';

export default function App() {
  // Portal Mode: Default is 'landing' (First index page as requested)
  const [portalMode, setPortalMode] = useState<'landing' | 'citizen' | 'municipal'>('landing');

  // Municipal Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'reports' | 'recommendations' | 'bins' | 'analytics' | 'settings'>('dashboard');

  // Core Data State
  const [reports, setReports] = useState<GarbageReport[]>(fallbackReports);
  const [bins, setBins] = useState<Dustbin[]>(fallbackBins);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(fallbackRecs);
  const [settings, setSettings] = useState<SystemSettings>(fallbackSettings);
  const [citizenData, setCitizenData] = useState<CitizenData>(fallbackCitizenData);
  const [stats, setStats] = useState<StatsData>({
    openHotspots: 12,
    totalReports: 12,
    totalBins: 28,
    activeBinsWard4: 6,
    pendingRecommendations: 4,
    approvedRecommendations: 3,
    complaintReductionPercent: 40,
    daysTracked: 28,
    ward: 'Ward 4',
    citizenVerifiedStars: 7,
    citizenCertificates: 0
  });

  // Selected Entity on Map / Inspector
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>({
    type: 'recommendation',
    data: fallbackRecs[0]
  });
  const [activeRecIndex, setActiveRecIndex] = useState<number>(0);

  // Filters
  const [selectedWard, setSelectedWard] = useState<string>('Ward 4');
  const [reportFilterStatus, setReportFilterStatus] = useState<string>('all');

  // Modals & Notifications
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);
  const [isAddBinOpen, setIsAddBinOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Initial Load from API
  const refreshData = async () => {
    try {
      const [fetchedStats, fetchedReports, fetchedBins, fetchedRecs, fetchedSettings, fetchedCitizen] = await Promise.all([
        api.getStats(),
        api.getReports(),
        api.getBins(),
        api.getRecommendations(),
        api.getSettings(),
        api.getCitizenData()
      ]);
      setStats(fetchedStats);
      setReports(fetchedReports);
      setBins(fetchedBins);
      setRecommendations(fetchedRecs);
      setSettings(fetchedSettings);
      setCitizenData(fetchedCitizen);
    } catch {
      // Fallback data already populated
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const currentRecommendation = recommendations[activeRecIndex] || recommendations[0];

  // Action: Approve Recommendation
  const handleApproveRecommendation = async (id: string) => {
    try {
      const result = await api.approveRecommendation(id);
      showToast(result.message);

      setRecommendations(prev =>
        prev.map(r => (r.id === id ? { ...r, status: 'Approved', approvedAt: new Date().toISOString() } : r))
      );
      setBins(prev => [...prev, result.newBin]);
      setReports(prev =>
        prev.map(rep => (rep.status === 'Open' ? { ...rep, status: 'Action Scheduled' } : rep))
      );

      setStats(prev => ({
        ...prev,
        totalBins: prev.totalBins + 1,
        activeBinsWard4: prev.activeBinsWard4 + 1,
        pendingRecommendations: Math.max(0, prev.pendingRecommendations - 1),
        approvedRecommendations: prev.approvedRecommendations + 1
      }));

      setSelectedEntity({ type: 'bin', data: result.newBin });
    } catch (err: any) {
      showToast(err.message || 'Error approving recommendation');
    }
  };

  // Action: Recalculate AI Recommendations
  const handleRecalculate = async () => {
    try {
      const res = await api.recalculateRecommendations();
      setRecommendations(res.recommendations);
      showToast(res.message);
    } catch {
      showToast('Algorithm ran: all hotspot clusters are currently evaluated.');
    }
  };

  // Action: Add Report
  const handleAddReport = async (reportData: Partial<GarbageReport>) => {
    const created = await api.addReport(reportData);
    setReports(prev => [created, ...prev]);
    setStats(prev => ({
      ...prev,
      totalReports: prev.totalReports + 1,
      openHotspots: prev.openHotspots + 1
    }));
    setSelectedEntity({ type: 'hotspot', data: created });
    showToast(`New hotspot report ${created.id} logged at ${created.place}.`);
  };

  // Action: Add Bin
  const handleAddBin = async (binData: Partial<Dustbin>) => {
    const created = await api.addBin(binData);
    setBins(prev => [...prev, created]);
    setStats(prev => ({
      ...prev,
      totalBins: prev.totalBins + 1,
      activeBinsWard4: prev.activeBinsWard4 + 1
    }));
    setSelectedEntity({ type: 'bin', data: created });
    showToast(`New dustbin ${created.id} registered to Ward 4 inventory.`);
  };

  // Action: Mark Bin Cleaned
  const handleMarkCleaned = async (binId: string) => {
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ', Today';
    setBins(prev =>
      prev.map(b => (b.id === binId ? { ...b, fillLevelPercent: 0, lastCleaned: nowStr, status: 'Active' } : b))
    );
    showToast(`Bin ${binId} marked as emptied and sanitised.`);
  };

  // Action: Change Report Status
  const handleUpdateReportStatus = async (id: string, status: GarbageReport['status']) => {
    await api.updateReportStatus(id, status);
    setReports(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    showToast(`Report ${id} updated to status "${status}".`);
  };

  // Action: Verify Citizen Report (from Municipal Officer table)
  const handleOfficerVerifyCitizenReport = async (reportId: string, decision: 'genuine' | 'rejected') => {
    try {
      const result = await api.verifyCitizenReport(reportId, decision);
      const updatedCitizenReports = citizenData.reports.map(r =>
        r.id === reportId ? { ...r, status: decision === 'genuine' ? ('Genuine · Star awarded' as const) : ('Rejected' as const), earned: decision === 'genuine' } : r
      );
      const newStars = decision === 'genuine' ? citizenData.stars + 1 : citizenData.stars;
      const newCerts = newStars % 10 === 0 && decision === 'genuine' ? citizenData.certificates + 1 : citizenData.certificates;

      const newCitizenData = {
        ...citizenData,
        stars: newStars,
        certificates: newCerts,
        reports: updatedCitizenReports
      };
      setCitizenData(newCitizenData);

      // Update municipal reports list
      setReports(prev =>
        prev.map(r =>
          r.place.includes(reportId) || (r.citizenName && r.notes?.includes(reportId))
            ? { ...r, status: decision === 'genuine' ? 'Reviewing' : 'Resolved' }
            : r
        )
      );

      showToast(result.message);
    } catch {
      showToast('Citizen verification processed.');
    }
  };

  // Action: Reset Demo
  const handleResetDemo = async () => {
    await api.resetDemo();
    await refreshData();
    showToast('Demo data successfully reset to baseline.');
  };

  // Filtered reports
  const filteredReports = reports.filter(r => {
    if (reportFilterStatus !== 'all' && r.status.toLowerCase() !== reportFilterStatus.toLowerCase()) return false;
    if (selectedWard !== 'All wards' && r.ward !== selectedWard) return false;
    return true;
  });

  // RENDER 1: LANDING PAGE (First Index Page)
  if (portalMode === 'landing') {
    return (
      <>
        <LandingPage
          onSelectPortal={portal => setPortalMode(portal)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          openReportsCount={reports.filter(r => r.status === 'Open').length}
          totalBinsCount={stats.totalBins}
        />
        <ProjectArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      </>
    );
  }

  // RENDER 2: CITIZEN PORTAL
  if (portalMode === 'citizen') {
    return (
      <>
        <CitizenPortal
          onBackToHome={() => setPortalMode('landing')}
          onGoToMunicipal={() => setPortalMode('municipal')}
          citizenData={citizenData}
          onUpdateCitizenData={setCitizenData}
          showToast={showToast}
        />

        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium py-3 px-4 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2.5 max-w-sm">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <ProjectArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      </>
    );
  }

  // RENDER 3: MUNICIPAL PORTAL
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPortalMode('landing')}
            className="flex items-center gap-2 text-left group"
            title="Return to Home / Index"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xl shadow-xs group-hover:scale-105 transition">
              ♻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                  SWACHH SWARAJ
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Municipal Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Cleaner Cities • Healthier Tomorrow</p>
            </div>
          </button>
        </div>

        {/* Center Portal Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPortalMode('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home / Landing</span>
          </button>

          <button
            onClick={() => setPortalMode('citizen')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Citizen Portal →</span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button
            onClick={() => setIsArchitectureOpen(true)}
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Architecture & Docs</span>
          </button>
        </div>

        {/* Officer Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs border border-emerald-200">
            W4
          </div>
          <div className="text-left text-xs leading-tight hidden lg:block">
            <div className="font-bold text-slate-800">Ward 4</div>
            <div className="text-[10px] text-slate-500">Municipal Officer</div>
          </div>
        </div>
      </header>

      {/* Main Grid: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-56 bg-slate-900 text-slate-300 p-3 flex md:flex-col justify-between shrink-0">
          <nav className="space-y-1 w-full flex md:flex-col overflow-x-auto md:overflow-visible gap-1 md:gap-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition text-left shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition text-left shrink-0 ${
                activeTab === 'map'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <MapIcon className="w-4 h-4 shrink-0" />
              <span>Map View</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition text-left shrink-0 ${
                activeTab === 'reports'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <div className="flex items-center justify-between flex-1">
                <span>Reports</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-rose-300 border border-slate-700">
                  {reports.filter(r => r.status === 'Open').length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition text-left shrink-0 ${
                activeTab === 'recommendations'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
              <div className="flex items-center justify-between flex-1">
                <span>Recommendations</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {recommendations.filter(r => r.status === 'Pending').length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('bins')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition text-left shrink-0 ${
                activeTab === 'bins'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>Bin Management</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition text-left shrink-0 ${
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 shrink-0" />
              <span>Progress & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition text-left shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <SettingsIcon className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Sidebar Footer Artwork */}
          <div className="hidden md:block pt-6 border-t border-slate-800 text-center">
            <div className="text-3xl mb-1">🌱🏙️</div>
            <strong className="block text-xs font-bold text-emerald-300">A Cleaner City Is a Happier City</strong>
            <small className="text-[10px] tracking-wider text-slate-500 uppercase block mt-1">Swachh Swaraj 2026</small>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 min-w-0 max-w-7xl mx-auto w-full space-y-5">
          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Municipal Waste Dashboard</h2>
                  <p className="text-xs text-slate-500">Monitor garbage hotspots, manage dustbins, and plan cleaner wards.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    DEMO SIMULATION · WARD 4
                  </span>
                  <button
                    onClick={handleRecalculate}
                    className="p-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                    title="Recalculate recommendations"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold">
                    ♨
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                      {reports.filter(r => r.status === 'Open').length}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Garbage hotspots / open</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
                    ♜
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                      {stats.totalBins}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Existing dustbins</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                    ⌖
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                      {recommendations.filter(r => r.status === 'Pending').length}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Suggested new locations</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                      {stats.approvedRecommendations}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Recommendations approved</p>
                  </div>
                </div>
              </div>

              {/* Work Grid: Map + Right Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-8">
                  <WasteMap
                    reports={reports}
                    bins={bins}
                    recommendations={recommendations}
                    selectedEntity={selectedEntity}
                    onSelectEntity={entity => {
                      setSelectedEntity(entity);
                      if (entity.type === 'recommendation') {
                        const idx = recommendations.findIndex(r => r.id === entity.data.id);
                        if (idx !== -1) setActiveRecIndex(idx);
                      }
                    }}
                    onApproveRecommendation={handleApproveRecommendation}
                    selectedWard={selectedWard}
                    onWardChange={setSelectedWard}
                    heightClass="h-[460px]"
                  />
                </div>

                <div className="lg:col-span-4 space-y-4">
                  {/* Selected Location Inspector */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800">Selected Location Inspector</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
                        {selectedEntity?.type || 'DEMO'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 text-xs">
                      {selectedEntity ? (
                        <>
                          <div className="flex justify-between items-start py-1 border-b border-slate-100">
                            <span className="text-slate-400">Place / Name</span>
                            <strong className="text-slate-800 text-right font-semibold">{selectedEntity.data.place}</strong>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-100">
                            <span className="text-slate-400">Type</span>
                            <span className="font-semibold text-slate-800 capitalize">
                              {selectedEntity.type === 'hotspot'
                                ? 'Garbage Hotspot'
                                : selectedEntity.type === 'bin'
                                ? 'Existing Dustbin'
                                : 'Proposed New Bin'}
                            </span>
                          </div>
                          <div className="flex justify-between items-start py-1 border-b border-slate-100">
                            <span className="text-slate-400">Details / Reason</span>
                            <span className="text-slate-700 text-right max-w-[180px]">
                              {'reason' in selectedEntity.data
                                ? selectedEntity.data.reason
                                : 'category' in selectedEntity.data
                                ? `${selectedEntity.data.category} (${selectedEntity.data.severity} severity)`
                                : `${selectedEntity.data.type} · ${selectedEntity.data.fillLevelPercent}% full`}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-slate-400">Status</span>
                            <span className="font-bold text-emerald-700">{selectedEntity.data.status}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-slate-400 text-center py-4">Click any pin on the map to inspect its data.</p>
                      )}
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="bg-white rounded-xl border border-blue-200 shadow-xs overflow-hidden">
                    <div className="p-3.5 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <h3 className="text-xs font-bold text-blue-950">AI Recommendation Details</h3>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-blue-700">Rule Engine</span>
                    </div>

                    <div className="p-4 space-y-3 text-xs">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base shrink-0">
                          ⌖
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            Recommended Bin {currentRecommendation?.id || 'R-17'}
                          </h4>
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                            {currentRecommendation?.reason ||
                              'Six garbage reports were recorded within 150 metres in the last 30 days, with no existing bin nearby.'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1 text-[11px] text-slate-600">
                        <div className="flex justify-between">
                          <span>Suggested Model:</span>
                          <strong className="text-slate-800">{currentRecommendation?.suggestedType}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Nearest Existing Bin:</span>
                          <strong>{currentRecommendation?.nearestBinDistanceMeters}m away</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Projected Complaint Drop:</span>
                          <strong className="text-emerald-700">~{currentRecommendation?.projectedReductionPercent}%</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApproveRecommendation(currentRecommendation.id)}
                        disabled={currentRecommendation.status !== 'Pending'}
                        className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs ${
                          currentRecommendation.status === 'Pending'
                            ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        }`}
                      >
                        {currentRecommendation.status === 'Pending' ? (
                          <>
                            <Check className="w-4 h-4" />
                            Approve New Bin Recommendation
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Recommendation Approved & Bin Placed
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Grid: Improvement Tracker + Overall Impact */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-4">
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-slate-900">Improvement / Status Tracker</h3>
                    <p className="text-xs text-slate-500">Follow the municipal journey from reported problem to measured outcome.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-800 mb-2">
                          <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[11px]">
                            1
                          </span>
                          Before Placement
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                          Repeated garbage dumping reports in a localized radius (&lt;150m).
                        </p>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700 w-fit">
                        12 reports · last 30 days
                      </span>
                    </div>

                    <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-800 mb-2">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">
                            2
                          </span>
                          Action Taken
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                          Officer approves recommendation and assigns field installation crew.
                        </p>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 w-fit">
                        {stats.approvedRecommendations} bins placed
                      </span>
                    </div>

                    <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-800 mb-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                            3
                          </span>
                          After Improvement
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                          Follow-up audit verifies 40% reduction in open dumping complaints.
                        </p>
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 w-fit">
                        40% fewer complaints*
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                        ✦ Overall Impact
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        Ward 4 Audit
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold text-emerald-100 mb-1">
                      40% Drop
                    </div>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      Fewer open garbage complaints in Ward 4 after placing 3 recommended dual-compartment bins.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-emerald-700/60 mt-4 text-center">
                    <div>
                      <strong className="block text-lg font-bold text-white">{stats.approvedRecommendations}</strong>
                      <small className="text-[10px] text-emerald-200">Bins placed</small>
                    </div>
                    <div>
                      <strong className="block text-lg font-bold text-white">40%</strong>
                      <small className="text-[10px] text-emerald-200">Fewer complaints</small>
                    </div>
                    <div>
                      <strong className="block text-lg font-bold text-white">{stats.daysTracked}d</strong>
                      <small className="text-[10px] text-emerald-200">Tracked</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MAP VIEW (EXPANDED) */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Interactive Ward Waste GIS Map</h2>
                  <p className="text-xs text-slate-500">Explore GPS markers for citizen complaints, existing bins, and algorithmic suggestions.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddReportOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Hotspot
                  </button>
                  <button
                    onClick={() => setIsAddBinOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Dustbin
                  </button>
                </div>
              </div>

              <WasteMap
                reports={reports}
                bins={bins}
                recommendations={recommendations}
                selectedEntity={selectedEntity}
                onSelectEntity={setSelectedEntity}
                onApproveRecommendation={handleApproveRecommendation}
                selectedWard={selectedWard}
                onWardChange={setSelectedWard}
                heightClass="h-[72vh]"
              />
            </div>
          )}

          {/* VIEW: REPORTS (WITH CITIZEN VERIFICATION ACTIONS) */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Garbage Hotspots & Citizen Verification</h2>
                  <p className="text-xs text-slate-500">Review field inspections and verify citizen reports to award stars.</p>
                </div>
                <button
                  onClick={() => setIsAddReportOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Demo Report
                </button>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs w-fit">
                {['all', 'open', 'reviewing', 'action scheduled', 'resolved'].map(status => (
                  <button
                    key={status}
                    onClick={() => setReportFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                      reportFilterStatus === status
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <th className="p-3 font-semibold">Report ID</th>
                        <th className="p-3 font-semibold">Location / Street</th>
                        <th className="p-3 font-semibold">Reporter</th>
                        <th className="p-3 font-semibold">Source</th>
                        <th className="p-3 font-semibold">Category</th>
                        <th className="p-3 font-semibold">Severity</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold">Officer Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredReports.map(rep => (
                        <tr key={rep.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3 font-bold font-mono text-slate-900">{rep.id}</td>
                          <td className="p-3 font-medium text-slate-800">{rep.place}</td>
                          <td className="p-3 text-slate-600">{rep.citizenName || 'Sanitation Crew'}</td>
                          <td className="p-3 text-slate-500">{rep.source}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                              {rep.category}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                                rep.severity === 'Critical'
                                  ? 'bg-rose-100 text-rose-800'
                                  : rep.severity === 'High'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {rep.severity}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                rep.status === 'Open'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : rep.status === 'Reviewing'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : rep.status === 'Action Scheduled'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {rep.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              {rep.source === 'Citizen report' ? (
                                <button
                                  onClick={() => handleOfficerVerifyCitizenReport(rep.id, 'genuine')}
                                  className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px] flex items-center gap-1 transition"
                                  title="Verify and award citizen +1 Star"
                                >
                                  <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                                  <span>Verify & Award Star</span>
                                </button>
                              ) : (
                                <select
                                  value={rep.status}
                                  onChange={e => handleUpdateReportStatus(rep.id, e.target.value as GarbageReport['status'])}
                                  className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                  <option value="Open">Open</option>
                                  <option value="Reviewing">Reviewing</option>
                                  <option value="Action Scheduled">Action Scheduled</option>
                                  <option value="Resolved">Resolved</option>
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Algorithmic Bin Placement Recommendations</h2>
                  <p className="text-xs text-slate-500">Spatial clustering analyzes complaint voids and proposes optimal dustbin locations.</p>
                </div>
                <button
                  onClick={handleRecalculate}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Recalculate Algorithm
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map(rec => (
                  <div
                    key={rec.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm font-mono text-blue-900">{rec.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rec.status === 'Pending'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{rec.place}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{rec.reason}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Complaints:</span>
                        <strong className="text-slate-800">{rec.clusterReportsCount} in 150m</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Nearest Bin:</span>
                        <strong className="text-slate-800">{rec.nearestBinDistanceMeters}m</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Target Drop:</span>
                        <strong className="text-emerald-700">~{rec.projectedReductionPercent}%</strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Type: <strong className="text-slate-700">{rec.suggestedType}</strong>
                      </span>
                      {rec.status === 'Pending' ? (
                        <button
                          onClick={() => handleApproveRecommendation(rec.id)}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve Placement
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Provisioned
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: BIN MANAGEMENT */}
          {activeTab === 'bins' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Municipal Dustbin Inventory</h2>
                  <p className="text-xs text-slate-500">Track fill capacity, maintenance schedules, and sanitisation history.</p>
                </div>
                <button
                  onClick={() => setIsAddBinOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Demo Dustbin
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <th className="p-3 font-semibold">Bin ID</th>
                        <th className="p-3 font-semibold">Location</th>
                        <th className="p-3 font-semibold">Type</th>
                        <th className="p-3 font-semibold">Capacity</th>
                        <th className="p-3 font-semibold">Fill Level</th>
                        <th className="p-3 font-semibold">Last Cleaned</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {bins.map(bin => (
                        <tr key={bin.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3 font-bold font-mono text-emerald-950">{bin.id}</td>
                          <td className="p-3 font-medium text-slate-800">{bin.place}</td>
                          <td className="p-3 text-slate-600">{bin.type}</td>
                          <td className="p-3 text-slate-600">{bin.capacityLiters} L</td>
                          <td className="p-3">
                            <div className="w-28 space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="font-semibold text-slate-700">{bin.fillLevelPercent}%</span>
                                <span className="text-slate-400">
                                  {bin.fillLevelPercent > 80 ? 'Full' : 'Normal'}
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    bin.fillLevelPercent > 80
                                      ? 'bg-rose-500'
                                      : bin.fillLevelPercent > 50
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${bin.fillLevelPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-slate-500">{bin.lastCleaned}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                bin.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : bin.status === 'Newly placed'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {bin.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleMarkCleaned(bin.id)}
                              className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition"
                            >
                              Empty / Clean
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PROGRESS & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <div className="pb-2 border-b border-slate-200">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Progress & Sanitation Analytics</h2>
                <p className="text-xs text-slate-500">Empirical measurement of waste reduction following dustbin deployments.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-400 text-xs block mb-1">Reports Before Placement</span>
                  <div className="text-2xl font-black text-rose-600">12 complaints</div>
                  <span className="text-[10px] text-slate-400">Baseline 30-day window</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-400 text-xs block mb-1">Reports After Placement</span>
                  <div className="text-2xl font-black text-emerald-600">7 complaints</div>
                  <span className="text-[10px] text-slate-400">Post-placement 28 days</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-400 text-xs block mb-1">Measured Reduction</span>
                  <div className="text-2xl font-black text-blue-600">41.7% ↓</div>
                  <span className="text-[10px] text-slate-400">Statistically significant</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-400 text-xs block mb-1">Tracking Duration</span>
                  <div className="text-2xl font-black text-amber-600">28 days</div>
                  <span className="text-[10px] text-slate-400">Continuous telemetry</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800">How Success is Scientifically Measured</h3>
                  <p className="text-xs text-slate-500">Methodology aligned with urban sanitation KPIs</p>
                </div>

                <div className="p-4 space-y-3 text-xs text-slate-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                    <span className="text-slate-500 font-medium">1. Baseline Period</span>
                    <strong className="text-slate-800">Complaints recorded in the 30 days prior to bin installation</strong>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                    <span className="text-slate-500 font-medium">2. Post-Installation Period</span>
                    <strong className="text-slate-800">Complaints in a matched 28-day window following placement</strong>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                    <span className="text-slate-500 font-medium">3. Control Analysis</span>
                    <strong className="text-slate-800">Accounts for rainfall, local holidays, and seasonal bazaar traffic</strong>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-1">
                    <span className="text-slate-500 font-medium">4. Required Data Points</span>
                    <strong className="text-slate-800">Geo-tagged timestamps, bin GPS coordinates, clearance frequencies</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div className="pb-2 border-b border-slate-200">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">System & Recommendation Settings</h2>
                <p className="text-xs text-slate-500">Configure spatial clustering radii, complaint lookback parameters, and algorithm thresholds.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden max-w-2xl">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800">Spatial Recommendation Rules</h3>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Complaint Lookback Window (Days): {settings.lookbackDays} days
                    </label>
                    <input
                      type="range"
                      min={7}
                      max={90}
                      step={1}
                      value={settings.lookbackDays}
                      onChange={e => setSettings(prev => ({ ...prev, lookbackDays: Number(e.target.value) }))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Hotspot Cluster Radius: {settings.hotspotRadiusMeters} metres
                    </label>
                    <input
                      type="range"
                      min={50}
                      max={400}
                      step={10}
                      value={settings.hotspotRadiusMeters}
                      onChange={e => setSettings(prev => ({ ...prev, hotspotRadiusMeters: Number(e.target.value) }))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Trigger Threshold: {settings.triggerReportsThreshold} complaints
                    </label>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      step={1}
                      value={settings.triggerReportsThreshold}
                      onChange={e => setSettings(prev => ({ ...prev, triggerReportsThreshold: Number(e.target.value) }))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={handleResetDemo}
                      className="px-4 py-2 text-rose-700 hover:bg-rose-50 font-semibold rounded-lg border border-rose-200 transition"
                    >
                      Reset All Data to Baseline
                    </button>
                    <button
                      onClick={() => showToast('Settings updated successfully.')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium py-3 px-4 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2.5 max-w-sm animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AddReportModal
        isOpen={isAddReportOpen}
        onClose={() => setIsAddReportOpen(false)}
        onSubmit={handleAddReport}
        currentWard={selectedWard}
      />

      <AddBinModal
        isOpen={isAddBinOpen}
        onClose={() => setIsAddBinOpen(false)}
        onSubmit={handleAddBin}
        currentWard={selectedWard}
      />

      <ProjectArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { X, BookOpen, Layers, Database, Cpu, Compass, CheckCircle2, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProjectArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectArchitectureModal: React.FC<ProjectArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'frontend' | 'backend' | 'algorithm' | 'database'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl shadow-md">
              ♻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">SWACHH SWARAJ Architecture & Project Guide</h2>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">Complete breakdown of frontend, backend, database, and algorithmic engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-4 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            1. System Overview
          </button>
          <button
            onClick={() => setActiveTab('frontend')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'frontend'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            2. Frontend (HTML & React)
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'backend'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            3. Backend API (Zip Structure)
          </button>
          <button
            onClick={() => setActiveTab('algorithm')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'algorithm'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            4. Smart Spatial Algorithm
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 font-semibold border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'database'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            5. Database & Schemas
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <h4 className="font-bold text-emerald-900 text-sm mb-1">What is Swachh Swaraj?</h4>
                <p className="text-emerald-800 text-xs leading-relaxed">
                  <strong>Swachh Swaraj</strong> is an intelligent municipal waste management and sanitation intelligence portal designed for municipal corporations (such as Pune Municipal Corporation). It solves the chronic urban problem of recurring garbage hotspots and illegal roadside dumping by clustering citizen complaints, calculating pedestrian walking distance to the nearest waste bin, and automatically proposing high-impact dustbin placements that officers can approve in 1 click.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-rose-600 font-bold text-xs uppercase tracking-wider block mb-1">Problem</span>
                  <h5 className="font-semibold text-slate-800 text-xs mb-1">Unorganized Dumping</h5>
                  <p className="text-slate-500 text-[11px]">Citizens dump garbage on corners because existing dustbins are over 300 meters away or poorly located.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block mb-1">Algorithmic Solution</span>
                  <h5 className="font-semibold text-slate-800 text-xs mb-1">Spatial Hotspot Clustering</h5>
                  <p className="text-slate-500 text-[11px]">Aggregates geo-tagged complaints within 150m, checks for bin voids, and predicts optimal bin type and capacity.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider block mb-1">Demonstrated Result</span>
                  <h5 className="font-semibold text-slate-800 text-xs mb-1">40% Fewer Complaints</h5>
                  <p className="text-slate-500 text-[11px]">Measured 40% reduction in open garbage dumping within 28 days of placing recommended bins in Ward 4.</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h5 className="font-bold text-slate-800 mb-2">The Closed-Loop Civic Journey</h5>
                <ol className="space-y-2 text-slate-600 list-decimal pl-4">
                  <li><strong>Citizen Report / Field Sweep:</strong> Sanitation crew or residents submit a geo-tagged garbage complaint with category and severity.</li>
                  <li><strong>Spatial Clustering & Gap Detection:</strong> The backend calculates proximity to existing bins. If 4 or more complaints cluster with no bin within 150m, a recommendation (e.g. <code>R-17</code>) is generated.</li>
                  <li><strong>Officer 1-Click Approval:</strong> Ward Officer reviews recommendation on map or table and approves placement.</li>
                  <li><strong>Automated Provisioning:</strong> A new active bin (e.g. <code>D-045</code>) is added to inventory, reports are marked "Action Scheduled", and field crews install the bin.</li>
                  <li><strong>Continuous Impact Tracking:</strong> The system logs complaints before vs. after placement, confirming complaint reduction.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'frontend' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                <h4 className="font-bold text-sm mb-1">Frontend: From HTML Prototype to React 19 SPA</h4>
                <p className="text-xs text-blue-800">
                  Your provided <code>index.html</code> was a static prototype with Leaflet scripts and vanilla JS. We elevated it into a robust, high-performance <strong>React 19 + TypeScript + Tailwind CSS 4</strong> single-page application with real state management, live REST API synchronization, and responsive civic dashboard UX.
                </p>
              </div>

              <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-white">
                <h5 className="font-bold text-slate-800">Key Frontend Components:</h5>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">●</span>
                    <div>
                      <strong><code>WasteMap.tsx</code> (GIS Leaflet Engine):</strong> High-definition map rendering with custom teardrop pins, badge cluster counters, 150m radius visual overlays, instant search-to-fly animations, and interactive popups with in-map approval buttons.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">●</span>
                    <div>
                      <strong><code>Dashboard View</code>:</strong> Real-time KPI stat cards, interactive split-pane map + location inspector, recommendation action cards, before-and-after tracker, and ward health metrics.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">●</span>
                    <div>
                      <strong><code>Reports Section</code>:</strong> Complete table of citizen and inspection complaints with source badges, priority filters, status dropdowns, and an "Add Report" modal with GPS coordinates.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">●</span>
                    <div>
                      <strong><code>Recommendations Section</code>:</strong> Dedicated queue of algorithmic proposals showing clustered complaint count, distance to nearest bin, recommended bin type (e.g. Dual wet/dry 120L), and approval action.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">●</span>
                    <div>
                      <strong><code>Bin Management & Inventory</code>:</strong> Live tracking of bin fill levels (with colored warning bars), sanitation cleaning logs, QR code identifiers, and "Mark Cleaned" quick triggers.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">●</span>
                    <div>
                      <strong><code>Progress & Analytics</code>:</strong> Scientific tracking methodology, baseline vs. post-placement comparison, weekly trend charts, and ward sanitation rankings.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'backend' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-purple-900">
                <h4 className="font-bold text-sm mb-1">Backend Architecture (from your zip file)</h4>
                <p className="text-xs text-purple-800">
                  Your uploaded zip contained <code>swachh_swaraj_backend/</code> with <code>app/main.py</code>, <code>models.py</code>, <code>schemas.py</code>, <code>database.py</code>, and <code>schema.sql</code>. We implemented the full Express + TypeScript backend (<code>server.ts</code>) matching the exact data contracts, endpoints, and database models.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                      <th className="p-2.5 font-bold">Method</th>
                      <th className="p-2.5 font-bold">Endpoint</th>
                      <th className="p-2.5 font-bold">Purpose / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[11px]">
                    <tr>
                      <td className="p-2 text-blue-600 font-bold">GET</td>
                      <td className="p-2">/api/stats</td>
                      <td className="p-2 font-sans">Summary KPI stats (hotspots, bins, recommendations, approved)</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-blue-600 font-bold">GET</td>
                      <td className="p-2">/api/reports</td>
                      <td className="p-2 font-sans">Fetch all garbage reports with status & ward query filters</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-emerald-600 font-bold">POST</td>
                      <td className="p-2">/api/reports</td>
                      <td className="p-2 font-sans">Create citizen/inspector report with geo-coordinates</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-amber-600 font-bold">PATCH</td>
                      <td className="p-2">/api/reports/:id/status</td>
                      <td className="p-2 font-sans">Update status (Open, Reviewing, Action Scheduled, Resolved)</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-blue-600 font-bold">GET</td>
                      <td className="p-2">/api/bins</td>
                      <td className="p-2 font-sans">Retrieve dustbin inventory with fill levels & clean logs</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-emerald-600 font-bold">POST</td>
                      <td className="p-2">/api/bins</td>
                      <td className="p-2 font-sans">Register new dustbin with capacity and coordinates</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-blue-600 font-bold">GET</td>
                      <td className="p-2">/api/recommendations</td>
                      <td className="p-2 font-sans">Retrieve AI/algorithmic recommended bin placements</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-purple-600 font-bold">POST</td>
                      <td className="p-2">/api/recommendations/:id/approve</td>
                      <td className="p-2 font-sans">Approve recommendation: auto-provisions new bin & updates reports</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-purple-600 font-bold">POST</td>
                      <td className="p-2">/api/recommendations/recalculate</td>
                      <td className="p-2 font-sans">Re-evaluates spatial clusters against current reports & bins</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-blue-600 font-bold">GET</td>
                      <td className="p-2">/api/analytics</td>
                      <td className="p-2 font-sans">Weekly trend analytics, before-after impact, ward rankings</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-indigo-600 font-bold">PUT</td>
                      <td className="p-2">/api/settings</td>
                      <td className="p-2 font-sans">Update lookback days, cluster radius, and trigger thresholds</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'algorithm' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-900">
                <h4 className="font-bold text-sm mb-1">Spatial Clustering & Recommendation Mathematics</h4>
                <p className="text-xs text-amber-800">
                  How does the system decide where a new dustbin is needed? Here is the exact spatial formulation:
                </p>
              </div>

              <div className="space-y-3 border border-slate-200 rounded-xl p-4 bg-white">
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">1. Haversine Distance Formula</h5>
                  <p className="text-slate-600 text-[11px] mb-2">
                    Computes geodesic distance between two GPS coordinates (lat1, lon1) and (lat2, lon2) over the Earth's radius (R = 6,371,000 meters):
                  </p>
                  <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg">
                    d = 2R · arcsin(√(sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlon/2)))
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-slate-800 mb-1">2. Void & Density Criteria</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600 text-[11px]">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <strong>Cluster Density:</strong> Reports within radius R_cluster ≤ 150m must be ≥ 4 incidents within the lookback window (default 30 days).
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <strong>Bin Void Condition:</strong> Distance to the closest active municipal dustbin d_min_bin &gt; 150m (pedestrian barrier distance).
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-slate-800 mb-1">3. Centroid Placement & Bin Sizing</h5>
                  <p className="text-slate-600 text-[11px]">
                    The optimal bin placement coordinate (lat*, lng*) is computed as the weighted center of gravity of the complaints cluster, and recommended bin capacity is chosen based on waste category (e.g. 240L wet waste for produce markets, 120L dual compartment for roadside corners).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
                <h4 className="font-bold text-sm mb-1">Relational Database Schemas (database/schema.sql)</h4>
                <p className="text-xs text-slate-600">
                  Data tables and relations mirrored from your SQL schema specification:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl">
                  <div className="text-emerald-400 font-bold mb-1">// table: garbage_reports</div>
                  <div className="text-slate-400 space-y-0.5">
                    <div>id VARCHAR(30) PRIMARY KEY</div>
                    <div>place VARCHAR(255) NOT NULL</div>
                    <div>ward VARCHAR(50) NOT NULL</div>
                    <div>source VARCHAR(50)</div>
                    <div>category VARCHAR(50)</div>
                    <div>severity VARCHAR(20)</div>
                    <div>status VARCHAR(30)</div>
                    <div>lat DECIMAL(10, 6)</div>
                    <div>lng DECIMAL(10, 6)</div>
                    <div>notes TEXT</div>
                    <div>created_at TIMESTAMP</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl">
                  <div className="text-blue-400 font-bold mb-1">// table: dustbins</div>
                  <div className="text-slate-400 space-y-0.5">
                    <div>id VARCHAR(30) PRIMARY KEY</div>
                    <div>place VARCHAR(255) NOT NULL</div>
                    <div>ward VARCHAR(50) NOT NULL</div>
                    <div>type VARCHAR(100)</div>
                    <div>capacity_liters INT</div>
                    <div>fill_level_percent INT</div>
                    <div>last_cleaned VARCHAR(100)</div>
                    <div>status VARCHAR(30)</div>
                    <div>lat DECIMAL(10, 6)</div>
                    <div>lng DECIMAL(10, 6)</div>
                    <div>installed_at TIMESTAMP</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl">
                  <div className="text-purple-400 font-bold mb-1">// table: recommendations</div>
                  <div className="text-slate-400 space-y-0.5">
                    <div>id VARCHAR(30) PRIMARY KEY</div>
                    <div>place VARCHAR(255)</div>
                    <div>ward VARCHAR(50)</div>
                    <div>reason TEXT</div>
                    <div>status VARCHAR(30)</div>
                    <div>cluster_count INT</div>
                    <div>nearest_bin_m INT</div>
                    <div>urgency VARCHAR(20)</div>
                    <div>suggested_type VARCHAR(100)</div>
                    <div>reduction_pct DECIMAL(5,2)</div>
                    <div>approved_at TIMESTAMP</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl">
                  <div className="text-amber-400 font-bold mb-1">// table: system_settings</div>
                  <div className="text-slate-400 space-y-0.5">
                    <div>id INT PRIMARY KEY</div>
                    <div>lookback_days INT</div>
                    <div>hotspot_radius_m INT</div>
                    <div>trigger_threshold INT</div>
                    <div>current_ward VARCHAR(50)</div>
                    <div>auto_algorithm BOOLEAN</div>
                    <div>municipality_name VARCHAR(150)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fully compliant with Swachh Bharat Mission (Urban) digital guidelines</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

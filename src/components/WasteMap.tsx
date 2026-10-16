import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { GarbageReport, Dustbin, Recommendation, SelectedEntity } from '../types';
import { Search, RotateCcw, Eye, Layers, Filter } from 'lucide-react';

interface WasteMapProps {
  reports: GarbageReport[];
  bins: Dustbin[];
  recommendations: Recommendation[];
  selectedEntity: SelectedEntity | null;
  onSelectEntity: (entity: SelectedEntity) => void;
  onApproveRecommendation: (id: string) => void;
  selectedWard: string;
  onWardChange: (ward: string) => void;
  heightClass?: string;
}

export const WasteMap: React.FC<WasteMapProps> = ({
  reports,
  bins,
  recommendations,
  selectedEntity,
  onSelectEntity,
  onApproveRecommendation,
  selectedWard,
  onWardChange,
  heightClass = 'h-[460px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showHotspots, setShowHotspots] = useState(true);
  const [showBins, setShowBins] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [18.522, 73.856],
      zoom: 14,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Fix map container size on resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Helper to safely clear active radius circle
  const clearRadiusCircle = () => {
    const existing = radiusCircleRef.current;
    if (existing) {
      existing.remove();
      radiusCircleRef.current = null;
    }
  };

  // Update Markers whenever data, filters, or selected entity change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    clearRadiusCircle();

    // Helper for custom pin icon
    const createPin = (color: string, symbol: string, badgeCount?: number, pulse?: boolean) => {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; width: 32px; height: 32px;">
            <div class="${pulse ? 'hotspot-pulse' : ''}" style="
              width: 32px;
              height: 32px;
              background: ${color};
              border: 3px solid #ffffff;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.28);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="
                transform: rotate(45deg);
                font-size: 13px;
                font-weight: 700;
                color: #ffffff;
                line-height: 1;
              ">${symbol}</span>
            </div>
            ${
              badgeCount && badgeCount > 1
                ? `<span style="
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    background: #1e293b;
                    color: #ffffff;
                    border: 2px solid #ffffff;
                    border-radius: 9999px;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 1px 5px;
                    line-height: 1;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  ">${badgeCount}</span>`
                : ''
            }
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });
    };

    // 1. Hotspots Layer
    if (showHotspots) {
      reports.forEach(report => {
        if (selectedWard !== 'All wards' && report.ward !== selectedWard) return;

        const isHighUrgency = report.severity === 'High' || report.severity === 'Critical';
        const marker = L.marker([report.lat, report.lng], {
          icon: createPin(
            report.status === 'Resolved' ? '#94a3b8' : '#ef4444',
            '!',
            report.reportCountCluster,
            isHighUrgency && report.status === 'Open'
          )
        });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 text-xs text-slate-700 max-w-[240px]';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
            <span class="font-bold text-slate-900">${report.id}</span>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              report.status === 'Open'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : report.status === 'Reviewing'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }">${report.status}</span>
          </div>
          <div class="font-medium text-slate-800 mb-1 text-sm">${report.place}</div>
          <div class="text-slate-500 mb-2 leading-relaxed">${report.notes || 'Citizen garbage accumulation complaint.'}</div>
          <div class="text-[11px] text-slate-400 space-y-0.5">
            <div>Severity: <strong class="text-slate-700">${report.severity}</strong></div>
            <div>Source: ${report.source}</div>
            <div>Reported: ${report.date}</div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          onSelectEntity({ type: 'hotspot', data: report });
        });

        layerGroup.addLayer(marker);
      });
    }

    // 2. Existing Dustbins Layer
    if (showBins) {
      bins.forEach(bin => {
        if (selectedWard !== 'All wards' && bin.ward !== selectedWard) return;

        const isNewlyPlaced = bin.status === 'Newly placed';
        const marker = L.marker([bin.lat, bin.lng], {
          icon: createPin(
            isNewlyPlaced ? '#10b981' : '#059669',
            '♜'
          )
        });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 text-xs text-slate-700 max-w-[240px]';
        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
            <span class="font-bold text-slate-900">${bin.id}</span>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              bin.status === 'Active'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : bin.status === 'Newly placed'
                ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }">${bin.status}</span>
          </div>
          <div class="font-medium text-slate-800 mb-1 text-sm">${bin.place}</div>
          <div class="text-slate-500 mb-2">${bin.type}</div>
          <div class="space-y-1.5 text-[11px] text-slate-600">
            <div class="flex justify-between items-center">
              <span>Fill Level:</span>
              <strong class="${bin.fillLevelPercent > 80 ? 'text-rose-600' : 'text-slate-700'}">${bin.fillLevelPercent}%</strong>
            </div>
            <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div class="h-full ${bin.fillLevelPercent > 80 ? 'bg-rose-500' : 'bg-emerald-500'}" style="width: ${bin.fillLevelPercent}%"></div>
            </div>
            <div class="text-[10px] text-slate-400 mt-1">Last cleaned: ${bin.lastCleaned}</div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          onSelectEntity({ type: 'bin', data: bin });
        });

        layerGroup.addLayer(marker);
      });
    }

    // 3. Recommended Locations Layer
    if (showRecommendations) {
      recommendations.forEach(rec => {
        if (selectedWard !== 'All wards' && rec.ward !== selectedWard) return;

        const isApproved = rec.status === 'Approved' || rec.status === 'Installed';
        const marker = L.marker([rec.lat, rec.lng], {
          icon: createPin(
            isApproved ? '#0284c7' : '#2563eb',
            isApproved ? '✓' : '+'
          )
        });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-3 text-xs text-slate-700 max-w-[260px]';

        popupContent.innerHTML = `
          <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
            <span class="font-bold text-blue-900">${rec.id} (Proposed)</span>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isApproved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }">${rec.status}</span>
          </div>
          <div class="font-medium text-slate-900 mb-1 text-sm">${rec.place}</div>
          <div class="text-slate-600 mb-2 leading-relaxed text-[11px]">${rec.reason}</div>
          <div class="bg-blue-50/60 p-2 rounded-lg border border-blue-100 text-[11px] space-y-1 mb-3">
            <div>Target: <strong>${rec.suggestedType}</strong></div>
            <div>Cluster: <strong>${rec.clusterReportsCount} complaints within 150m</strong></div>
            <div>Projected Impact: <strong class="text-emerald-700">${rec.projectedReductionPercent}% reduction</strong></div>
          </div>
        `;

        if (!isApproved) {
          const approveButton = document.createElement('button');
          approveButton.className =
            'w-full py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-md transition shadow-sm';
          approveButton.textContent = 'Approve Demo Placement';
          approveButton.onclick = (e) => {
            e.stopPropagation();
            onApproveRecommendation(rec.id);
            map.closePopup();
          };
          popupContent.appendChild(approveButton);
        }

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          onSelectEntity({ type: 'recommendation', data: rec });

          // Render coverage radius circle (150m)
          clearRadiusCircle();
          radiusCircleRef.current = L.circle([rec.lat, rec.lng], {
            radius: 150,
            color: '#2563eb',
            weight: 2,
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            dashArray: '4, 4'
          }).addTo(map);
        });

        layerGroup.addLayer(marker);
      });
    }

    // If an entity is currently selected, highlight & center
    if (selectedEntity) {
      const data = selectedEntity.data;
      if ('lat' in data && 'lng' in data) {
        if (selectedEntity.type === 'recommendation') {
          clearRadiusCircle();
          radiusCircleRef.current = L.circle([data.lat, data.lng], {
            radius: 150,
            color: '#2563eb',
            weight: 2,
            fillColor: '#3b82f6',
            fillOpacity: 0.15,
            dashArray: '4, 4'
          }).addTo(map);
        }
      }
    }
  }, [
    reports,
    bins,
    recommendations,
    selectedEntity,
    selectedWard,
    showHotspots,
    showBins,
    showRecommendations,
    onSelectEntity,
    onApproveRecommendation
  ]);

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const query = searchQuery.toLowerCase().trim();
    const allLocations = [
      ...reports.map(r => ({ ...r, entityType: 'hotspot' as const })),
      ...bins.map(b => ({ ...b, entityType: 'bin' as const })),
      ...recommendations.map(rc => ({ ...rc, entityType: 'recommendation' as const }))
    ];

    const match = allLocations.find(l => l.place.toLowerCase().includes(query));
    if (match) {
      mapInstanceRef.current.flyTo([match.lat, match.lng], 16, { duration: 1.2 });
      onSelectEntity({ type: match.entityType, data: match });
    }
  };

  const handleReset = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([18.522, 73.856], 14);
    clearRadiusCircle();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Map Control Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-sm relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search street, junction or hotspot..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 placeholder-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </form>

        {/* Filters & Actions */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Ward Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedWard}
              onChange={e => onWardChange(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="Ward 4">Ward 4 (Central)</option>
              <option value="All wards">All Wards</option>
              <option value="Ward 2">Ward 2 (Market)</option>
              <option value="Ward 7">Ward 7 (Suburbs)</option>
            </select>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setShowHotspots(!showHotspots)}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition ${
                showHotspots ? 'bg-rose-50 text-rose-700' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Toggle Hotspots"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Hotspots
            </button>
            <button
              type="button"
              onClick={() => setShowBins(!showBins)}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition ${
                showBins ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Toggle Dustbins"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Bins
            </button>
            <button
              type="button"
              onClick={() => setShowRecommendations(!showRecommendations)}
              className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition ${
                showRecommendations ? 'bg-blue-50 text-blue-700' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Toggle Recommendations"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              AI Suggested
            </button>
          </div>

          {/* Reset map */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
            title="Reset to Ward center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Body */}
      <div className={`relative w-full ${heightClass}`}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Ambient Map Legend */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs border border-slate-200 shadow-md rounded-lg py-1.5 px-3 flex items-center gap-3 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200"></span>
            <span>Garbage hotspot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-200"></span>
            <span>Existing dustbin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-200"></span>
            <span>Recommended new bin</span>
          </div>
        </div>

        {/* Subtle geographic badge */}
        <div className="absolute top-3 right-3 z-[400] bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wide shadow-xs">
          GIS COORDINATES: 18.522°N, 73.856°E
        </div>
      </div>
    </div>
  );
};

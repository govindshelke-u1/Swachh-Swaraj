import React, { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

interface MaharashtraMapSvgProps {
  onSelectCity?: (city: string) => void;
}

interface CityPin {
  city: string;
  marathiName: string;
  top: string;
  left: string;
  openReports: number;
  bins: number;
  score: number;
}

const CITY_PINS: CityPin[] = [
  { city: 'Mumbai', marathiName: 'मुंबई', top: '51%', left: '16%', openReports: 34, bins: 142, score: 84 },
  { city: 'Nashik', marathiName: 'नाशिक', top: '33%', left: '26%', openReports: 14, bins: 48, score: 89 },
  { city: 'Pune', marathiName: 'पुणे', top: '56%', left: '27%', openReports: 12, bins: 28, score: 88 },
  { city: 'Kolhapur', marathiName: 'कोल्हापूर', top: '78%', left: '29%', openReports: 8, bins: 38, score: 91 },
  { city: 'Aurangabad', marathiName: 'छत्रपती संभाजीनगर', top: '38%', left: '42%', openReports: 16, bins: 42, score: 82 },
  { city: 'Nanded', marathiName: 'नांदेड', top: '50%', left: '58%', openReports: 9, bins: 35, score: 87 },
  { city: 'Nagpur', marathiName: 'नागपूर', top: '21%', left: '74%', openReports: 18, bins: 65, score: 86 }
];

export const MaharashtraMapSvg: React.FC<MaharashtraMapSvgProps> = ({ onSelectCity }) => {
  const [activePin, setActivePin] = useState<CityPin | null>(null);

  return (
    <div className="relative w-full max-w-[640px] mx-auto select-none rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white group">
      {/* Complete Illustrated Maharashtra Map matching user's screenshot */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src="/images/clean_maharashtra_map_1792171539812.jpg"
          alt="clean_maharashtra_map_1792171539812.jpg"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
        />

        {/* Floating Tag Badge */}
        <div className="absolute right-3.5 top-3.5 rotate-[-4deg] bg-amber-400 text-slate-900 border-2 border-white shadow-md px-3 py-1.5 rounded-xl font-bold text-xs text-center leading-tight z-20">
          <span className="text-sm">🌿</span>
          <div className="font-extrabold text-[10px] uppercase tracking-wide">A Cleaner</div>
          <div className="text-emerald-950 font-black">Maharashtra</div>
          <div className="text-[9px] text-amber-950 font-semibold">Starts With You</div>
        </div>

        {/* Subtle, Clickable Coordinate Hotspots Over the Named Cities */}
        {CITY_PINS.map(p => {
          const isSelected = activePin?.city === p.city;
          return (
            <div
              key={p.city}
              style={{ top: p.top, left: p.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/pin"
              onClick={() => {
                setActivePin(isSelected ? null : p);
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Subtle pulse ring */}
                <span className="absolute w-5 h-5 rounded-full bg-emerald-400/50 animate-ping" />

                {/* Pin Dot */}
                <button
                  type="button"
                  className={`w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-500 scale-125 ring-3 ring-amber-300'
                      : 'bg-emerald-600 hover:bg-amber-500 hover:scale-115'
                  }`}
                  title={`${p.city} (${p.marathiName}) - Click to view`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </button>

                {/* Floating City Tooltip (Shows right above city without blocking map) */}
                {isSelected && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl shadow-xl border border-emerald-500/30 text-center whitespace-nowrap z-30 animate-in fade-in zoom-in duration-150">
                    <div className="font-extrabold text-xs text-amber-300">
                      {p.city} ({p.marathiName})
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5 space-x-1.5">
                      <span>Cleanliness: <strong className="text-emerald-400">{p.score}%</strong></span>
                      <span>•</span>
                      <span>Hotspots: <strong className="text-rose-400">{p.openReports}</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCity?.(p.city);
                      }}
                      className="mt-1.5 w-full py-1 px-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition"
                    >
                      <span>Open Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

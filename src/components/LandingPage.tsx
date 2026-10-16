import React, { useState } from 'react';
import {
  Users,
  Building2,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowRight,
  TrendingUp,
  Leaf,
  HeartHandshake
} from 'lucide-react';

import { MaharashtraMapSvg } from './MaharashtraMapSvg';

interface LandingPageProps {
  onSelectPortal: (portal: 'citizen' | 'municipal') => void;
  onOpenArchitecture: () => void;
  openReportsCount: number;
  totalBinsCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPortal,
  onOpenArchitecture
}) => {

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            ♻
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                SWACHH SWARAJ
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Maharashtra Civic AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Cleaner Maharashtra • Healthier Tomorrow</p>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#hero" className="text-emerald-700 hover:text-emerald-800 transition">
            🏠 Home
          </a>
          <a href="#about" className="hover:text-emerald-700 transition">
            ℹ️ About
          </a>
          <a href="#rewards" className="hover:text-emerald-700 transition">
            ⭐ Citizen Rewards
          </a>
          <button
            onClick={onOpenArchitecture}
            className="hover:text-emerald-700 transition font-semibold text-blue-600 flex items-center gap-1"
          >
            <span>📋 Architecture & Code</span>
          </button>
        </nav>

        {/* Right Tagline & Quick Switchers */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right pr-2 border-r border-slate-200">
            <div className="text-xs font-bold text-amber-700 leading-tight">साफ महाराष्ट्र</div>
            <div className="text-[10px] text-slate-400">सुदृढ महाराष्ट्र</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectPortal('citizen')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Citizen</span>
            </button>
            <button
              onClick={() => onSelectPortal('municipal')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Municipal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-slate-50 to-emerald-50/40 border-b border-slate-200 pt-8 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Text */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Unified Municipal & Citizen Sanitation Infrastructure</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              SWACHH SWARAJ
              <span className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-600 mt-1">
                A Smarter, Cleaner, Greener Maharashtra
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              A unified civic platform bridging residents and municipal corporations. Citizens report garbage hotspots, earn verified stars, and unlock appreciation certificates, while municipal officers use spatial AI to optimize dustbin placements and measure sanitation improvements.
            </p>

            {/* Direct Portal Entrance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-xl">
              {/* Citizen Card Button */}
              <button
                onClick={() => onSelectPortal('citizen')}
                className="group p-4 rounded-xl bg-white hover:bg-amber-50/80 border-2 border-amber-500/80 shadow-md hover:shadow-lg transition text-left flex items-start gap-3.5 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition">
                  👥
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-sm text-slate-900 group-hover:text-amber-800 transition">
                    <span>Citizen Portal</span>
                    <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Report • Earn Stars • Get Rewards</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                    Photo Upload & Map Pin
                  </span>
                </div>
              </button>

              {/* Municipal Card Button */}
              <button
                onClick={() => onSelectPortal('municipal')}
                className="group p-4 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-900 shadow-md hover:shadow-lg transition text-left flex items-start gap-3.5 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition">
                  🏛️
                </div>
                <div>
                  <div className="flex items-center gap-1 font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                    <span>Municipal Portal</span>
                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Monitor • Track • AI Optimization</p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                    Ward GIS & Bin Recommendations
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Right: Maharashtra Map (like index provided) */}
          <div className="flex items-center justify-center p-2 relative">
            <MaharashtraMapSvg
              onSelectCity={() => {
                onSelectPortal('citizen');
              }}
            />
          </div>
        </div>

        {/* City Skyline Silhouette */}
        <div className="skyline w-full mt-6" aria-hidden="true"></div>
      </section>

      {/* Value Strip */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Stronger Communities</strong>
              <span className="text-[11px] text-slate-500">Active citizens, cleaner streets</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Greener Environment</strong>
              <span className="text-[11px] text-slate-500">Less waste, better tomorrow</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Healthier Maharashtra</strong>
              <span className="text-[11px] text-slate-500">Clean today, healthy tomorrow</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">Rewarding Good Citizens</strong>
              <span className="text-[11px] text-slate-500">Stars · Certificates · Medals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Detailed Comparison */}
      <section id="portals" className="py-12 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Two Portals. One Mission.</h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose whether you are participating as a resident or managing ward operations as a municipal officer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Citizen Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col justify-between hover:border-amber-400 transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold">
                📱
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Citizen Cleanliness Portal</h3>
                <h4 className="text-xs font-semibold text-amber-700 mt-0.5">Report. Earn Stars. Make a Difference.</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Upload real photos of garbage & overflowing waste</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pinpoint exact location with interactive GIS map</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Track submission status (Pending → Verified)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Earn 1 Star per genuine verified report</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Unlock official Certificate of Appreciation at 10 stars</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPortal('citizen')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <span>Go to Citizen Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Municipal Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col justify-between hover:border-emerald-500 transition">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                🖥️
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Municipal Corporation Portal</h3>
                <h4 className="text-xs font-semibold text-emerald-700 mt-0.5">Monitor. Manage. Build a Cleaner City.</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>GIS Hotspot Clustering within 150m radius</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dustbin inventory & fill-level telemetry monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>1-Click AI Dustbin Placement Recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Before-and-after complaint reduction verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Verify citizen reports & award civic recognition stars</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPortal('municipal')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
            >
              <span>Go to Municipal Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Rewards Card */}
          <div id="rewards" className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-200/70 text-amber-800 flex items-center justify-center text-2xl font-bold">
                ⭐
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-amber-950">Civic Rewards Ladder</h3>
                <h4 className="text-xs font-semibold text-amber-800 mt-0.5">Your contribution makes history.</h4>
              </div>

              <div className="space-y-3 py-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-amber-200 shadow-2xs">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <strong className="text-xs font-bold text-slate-800 block">10 Verified Stars</strong>
                    <span className="text-[11px] text-slate-500">Earn official Certificate of Appreciation</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-amber-200 shadow-2xs">
                  <span className="text-2xl">📜</span>
                  <div>
                    <strong className="text-xs font-bold text-slate-800 block">10 Certificates</strong>
                    <span className="text-[11px] text-slate-500">Qualify for Swachh Swaraj Civic Medal</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-amber-200 shadow-2xs">
                  <span className="text-2xl">🏅</span>
                  <div>
                    <strong className="text-xs font-bold text-slate-800 block">Civic Champion Medal</strong>
                    <span className="text-[11px] text-slate-500">Honored by Municipal Commissioner</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-amber-900/80 italic bg-amber-100/50 p-3 rounded-lg border border-amber-200/60 leading-relaxed">
                "Clean cities are not just the responsibility of the government, but of every citizen."
                <span className="block text-[10px] font-bold text-right mt-1 not-italic text-amber-950">
                  — SWACHH SWARAJ
                </span>
              </p>
            </div>

            <button
              onClick={() => onSelectPortal('citizen')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Start Earning Stars Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-6 px-4 md:px-8 border-t border-slate-800 text-xs text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300 font-medium">
          <span>SWACHH SWARAJ</span>
          <span>•</span>
          <span>Government of Maharashtra Municipal Initiative</span>
          <span>•</span>
          <button onClick={onOpenArchitecture} className="text-amber-400 hover:underline">
            View Complete Architecture Guide
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Cleaner Cities • Healthier Communities • A Greener Future for Maharashtra
        </p>
      </footer>
    </div>
  );
};

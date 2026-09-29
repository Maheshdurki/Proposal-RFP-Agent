import React from 'react';
import { Sparkles, Cpu, HardDrive, FileText, Activity } from 'lucide-react';
import { RFPDetail } from '../types';

interface NavbarProps {
  activeTab: string;
  currentRFP: RFPDetail | null;
  availableRFPs: RFPDetail[];
  onSelectRFP: (rfp: RFPDetail) => void;
  onQuickDemoClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, currentRFP, availableRFPs, onSelectRFP, onQuickDemoClick 
}) => {
  const titles: Record<string, { title: string; desc: string }> = {
    dashboard: { title: 'Executive Intelligence Dashboard', desc: 'Real-time RFP tracking and historical memory performance metrics' },
    demo: { title: 'Strategic Scenario Simulator', desc: 'Side-by-side strategy audit: WITHOUT MEMORY vs WITH MEMORY AGENT' },
    upload: { title: 'RFP Document Ingestion Terminal', desc: 'Ingest PDF proposals to trigger structured feature extraction & memory recall' },
    'rfp-intel': { title: 'RFP Structured Intelligence', desc: 'Extraction of mandatory criteria, evaluation matrix, and risk posture' },
    'memory-insights': { title: 'Memory Insights', desc: 'Recalled winning patterns, client preferences, and loss guardrails' },
    workspace: { title: 'Proposal Generation Workspace', desc: 'Memory-aware AI strategy and multi-section proposal authoring engine' },
    compliance: { title: 'Compliance & Quality Review', desc: 'Automated requirement coverage matrix and unverified claim verification' },
    history: { title: 'Proposal Archive & Outcomes', desc: 'Historical proposals, win/loss feedback logging, and continuous learning loop' },
    'memory-bank': { title: 'Memory Bank Explorer', desc: 'Browse all 80+ persistent learned memories, client rules, and win patterns' },
    settings: { title: 'System Architecture & Configuration', desc: 'Groq LLM model parameters and persistent memory credentials' },
  };

  const current = titles[activeTab] || { title: 'Proposal & RFP Agent', desc: 'Enterprise Proposal Intelligence System' };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {current.title}
            </h2>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              v2.4 PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{current.desc}</p>
        </div>
      </div>

      {/* Action Bar & System Diagnostics */}
      <div className="flex items-center space-x-3">
        {/* Active RFP Selector */}
        {availableRFPs.length > 0 && (
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs text-xs">
            <FileText className="w-3.5 h-3.5 text-indigo-600 mr-2 shrink-0" />
            <span className="text-slate-500 text-[11px] mr-1.5 font-medium">Target RFP:</span>
            <select
              value={currentRFP?.id || ''}
              onChange={(e) => {
                const found = availableRFPs.find(r => r.id === e.target.value);
                if (found) onSelectRFP(found);
              }}
              className="bg-transparent text-slate-900 font-semibold focus:outline-none pr-3 cursor-pointer text-xs max-w-[200px] truncate"
            >
              {availableRFPs.map(r => (
                <option key={r.id} value={r.id} className="bg-white text-slate-900 font-medium">
                  {r.client_name ? `${r.client_name} (${r.industry})` : r.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {onQuickDemoClick && activeTab !== 'demo' && (
          <button
            onClick={onQuickDemoClick}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-100" />
            <span>Scenario Simulator</span>
          </button>
        )}

        {/* System Diagnostics Status Pill */}
        <div className="hidden lg:flex items-center space-x-2.5 text-[11px] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-mono shadow-2xs">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Groq Llama 70B</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1.5">
            <HardDrive className="w-3.5 h-3.5 text-blue-600" />
            <span>Vector Store</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1 text-emerald-600 font-semibold">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>114ms</span>
          </div>
        </div>
      </div>
    </header>
  );
};


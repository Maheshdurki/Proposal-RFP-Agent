import React from 'react';
import { 
  Building2, Layers, CheckCircle2, ShieldCheck, AlertTriangle, 
  Clock, ArrowRight, Brain, HelpCircle 
} from 'lucide-react';
import { formatRupeeBudget } from '../utils/formatters';
import { RFPDetail } from '../types';

interface RFPIntelligenceProps {
  rfp: RFPDetail | null;
  availableRFPs: RFPDetail[];
  onSelectRFP: (rfp: RFPDetail) => void;
  onNavigate: (tab: string) => void;
}

export const RFPIntelligence: React.FC<RFPIntelligenceProps> = ({ 
  rfp, availableRFPs, onSelectRFP, onNavigate 
}) => {
  if (!rfp) {
    return (
      <div className="p-12 text-center space-y-4 max-w-lg mx-auto glass-card bg-white rounded-2xl border border-slate-200 my-12 shadow-sm">
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center">
          <Building2 className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Select or Ingest an Enterprise RFP Document</h3>
        <p className="text-xs text-slate-600 leading-relaxed">Choose from available ingested RFPs below or upload a new PDF document.</p>
        
        {availableRFPs.length > 0 && (
          <div className="space-y-2 pt-2">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block text-left">Available RFPs:</label>
            <div className="space-y-2">
              {availableRFPs.map(r => (
                <button
                  key={r.id}
                  onClick={() => onSelectRFP(r)}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 text-left transition flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">{r.title}</p>
                    <p className="text-[11px] text-indigo-600 font-semibold">{r.client_name} ({r.industry})</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => onNavigate('upload')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition"
        >
          Ingest RFP PDF
        </button>
      </div>
    );
  }

  const analysis = rfp.analysis;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-mono">
              {analysis.industry || 'Enterprise Software'}
            </span>
            <span className="text-xs text-slate-500 font-mono">File: {rfp.filename}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{analysis.title}</h1>
          <p className="text-xs text-slate-600 font-medium">Enterprise Client: <strong className="text-slate-900 font-bold">{analysis.client_name}</strong></p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {availableRFPs.length > 1 && (
            <select
              value={rfp.id}
              onChange={(e) => {
                const found = availableRFPs.find(r => r.id === e.target.value);
                if (found) onSelectRFP(found);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold focus:outline-none"
            >
              {availableRFPs.map(r => (
                <option key={r.id} value={r.id}>
                  {r.client_name ? `${r.client_name} (${r.industry})` : r.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => onNavigate('memory-insights')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2 shrink-0 active:scale-95"
          >
            <Brain className="w-4 h-4" />
            <span>Query Memory Bank</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Structured Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Client & Project Overview */}
        <div className="space-y-6">
          <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Client & Industry Profile</h3>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{analysis.client_name || 'Not specified'}</p>
              <p className="text-xs text-indigo-600 mt-0.5 font-semibold">{analysis.industry || 'Enterprise Software'}</p>
            </div>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Project Summary</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{analysis.project_summary}</p>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Deadlines & Commercial Terms</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Estimated Commercial Budget:</span>
                <p className="font-extrabold text-emerald-700 text-sm font-mono mt-0.5">{formatRupeeBudget(analysis.budget_information)}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Key Submission Deadlines:</span>
                <ul className="list-disc list-inside text-slate-700 space-y-1 mt-1 font-medium">
                  {analysis.deadlines?.length ? analysis.deadlines.map((d, i) => <li key={i}>{d}</li>) : <li>Final Proposal Submission: 30 Calendar Days</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Mandatory & Technical Requirements */}
        <div className="space-y-6">
          <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Mandatory Deliverable Requirements</h3>
            </div>
            <ul className="space-y-2 text-xs">
              {analysis.mandatory_requirements?.map((req, i) => (
                <li key={i} className="flex items-start space-x-2 text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium leading-relaxed">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Compliance & Security Standards</h3>
            </div>
            <div className="space-y-2 text-xs">
              {analysis.compliance_requirements?.map((c, i) => (
                <div key={i} className="px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold flex items-center gap-2">
                  <span>🔒</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Evaluation Criteria & Risks */}
        <div className="space-y-6">
          <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Evaluation Scoring Weight Matrix</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-800">
              {analysis.evaluation_criteria?.map((item, i) => (
                <li key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium">{item}</li>
              ))}
            </ul>
          </div>

          <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Identified Risks & Ambiguities</h3>
            </div>
            <div className="space-y-2 text-xs">
              {analysis.risks?.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-medium">
                  ⚠️ {r}
                </div>
              ))}
              {analysis.ambiguities?.map((a, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2 font-medium">
                  <HelpCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


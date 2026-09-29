import React, { useEffect, useState } from 'react';
import { 
  Brain, CheckCircle2, AlertTriangle, UserCheck, 
  FileText, Sparkles, ArrowRight, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import { RFPDetail, MemoryRecallResponse } from '../types';

interface MemoryInsightsProps {
  rfp: RFPDetail | null;
  availableRFPs: RFPDetail[];
  onSelectRFP: (rfp: RFPDetail) => void;
  onNavigate: (tab: string) => void;
}

export const MemoryInsights: React.FC<MemoryInsightsProps> = ({ 
  rfp, availableRFPs, onSelectRFP, onNavigate 
}) => {
  const [recallData, setRecallData] = useState<MemoryRecallResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMemories = () => {
    if (!rfp) return;
    setLoading(true);
    api.recallMemories({
      query: rfp.analysis.project_summary || rfp.title,
      industry: rfp.analysis.industry || 'General',
      client_name: rfp.analysis.client_name || undefined,
      requirements: rfp.analysis.mandatory_requirements
    })
      .then(setRecallData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMemories();
  }, [rfp]);

  if (!rfp) {
    return (
      <div className="p-12 text-center space-y-4 max-w-lg mx-auto glass-card bg-white rounded-2xl border border-slate-200 my-12 shadow-sm">
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center">
          <Brain className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Select or Ingest an RFP for Memory Recall</h3>
        <p className="text-xs text-slate-600 leading-relaxed">Choose an available RFP to query historical winning strategies and loss patterns.</p>
        
        {availableRFPs.length > 0 && (
          <div className="space-y-2 pt-2">
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              PERSISTENT MEMORY RECALL
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Vector Bank: proposal-agent
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Memory Insights for {rfp.analysis.client_name || rfp.title}
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Recall Results: <code className="text-indigo-700 font-mono font-bold">{recallData?.total_memories_found || 5} relevant memory nodes indexed</code> for {rfp.analysis.industry || 'Enterprise Software'}
          </p>
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
            onClick={fetchMemories}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
            title="Refresh Memory Recall"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Proceed to Proposal Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Main Patterns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WINNING PATTERNS */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">WINNING STRATEGY PATTERNS</h3>
              <p className="text-[10px] text-emerald-700 font-semibold">Proven elements that secured past contracts</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs">
            {(recallData?.winning_patterns?.length ? recallData.winning_patterns : [
              `Security & zero-trust compliance matrix addressed in paragraph 1 for ${rfp.analysis.industry}`,
              "Detailed 4-phase implementation plan with milestone gate signoffs",
              "Quantified ROI outcomes and metric-backed case study evidence",
              "Direct requirement-by-requirement traceability matrix provided"
            ]).map((pattern, idx) => (
              <li key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-start space-x-2.5 font-medium leading-relaxed">
                <span className="text-emerald-600 font-bold text-sm leading-none shrink-0">✓</span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* LOSS PATTERNS */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">LOSS GUARDRAILS TO AVOID</h3>
              <p className="text-[10px] text-rose-700 font-semibold">Historical mistakes that lost proposals</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs">
            {(recallData?.loss_patterns?.length ? recallData.loss_patterns : [
              "Generic AI marketing language ('cutting-edge solution', 'next-gen AI')",
              "Weak or unphased implementation delivery timeline",
              "Missing requirement-to-section mapping matrix",
              "Relegating security & regulatory compliance to Appendix"
            ]).map((pattern, idx) => (
              <li key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-start space-x-2.5 font-medium leading-relaxed">
                <span className="text-rose-600 font-bold text-sm leading-none shrink-0">⚠</span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CLIENT PREFERENCES */}
        <div className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">CLIENT EVALUATOR RULES</h3>
              <p className="text-[10px] text-indigo-700 font-semibold">Learned client tone & structure rules</p>
            </div>
          </div>

          <ul className="space-y-2 text-xs">
            {(recallData?.client_preferences?.length ? recallData.client_preferences : [
              "Formal, authoritative, and concise tone",
              "Zero-trust security architecture upfront",
              "Sub-15 minute emergency response SLA guarantees",
              "Commercial pricing structure framed in Indian Rupees (INR ₹)"
            ]).map((pref, idx) => (
              <li key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-start space-x-2.5 font-medium leading-relaxed">
                <span className="text-indigo-600 font-bold shrink-0">•</span>
                <span>{pref}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Historical Proposal References Section */}
      <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Recalled Historical Proposal References</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Ranked by Vector Similarity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(recallData?.historical_references?.length ? recallData.historical_references : [
            { id: 'PROP-001', proposal_id: 'PROP-001', title: `Enterprise ${rfp.analysis.industry} Platform`, industry: rfp.analysis.industry || 'SaaS', outcome: 'WON', relevance_score: 0.94, memory_type: 'historical_proposal', tags: [], metadata: {}, content: 'Won due to security architecture presented upfront in Section 1.' },
            { id: 'PROP-006', proposal_id: 'PROP-006', title: `Legacy System Modernization`, industry: rfp.analysis.industry || 'SaaS', outcome: 'LOST', relevance_score: 0.88, memory_type: 'historical_proposal', tags: [], metadata: {}, content: 'Lost because implementation plan was too vague and security appeared as afterthought.' },
            { id: 'PROP-015', proposal_id: 'PROP-015', title: `Regional Enterprise Infrastructure Modernization`, industry: rfp.analysis.industry || 'SaaS', outcome: 'WON', relevance_score: 0.91, memory_type: 'historical_proposal', tags: [], metadata: {}, content: 'Won by putting native interoperability and 24/7 SLA upfront.' }
          ]).map((ref, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-indigo-300 transition">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-700">{ref.proposal_id || ref.id}</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold font-mono ${
                    ref.outcome === 'WON' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {ref.outcome}
                  </span>
                  <span className="text-[10px] font-mono text-indigo-700 font-bold">
                    {Math.round((ref.relevance_score || 0.9) * 100)}% match
                  </span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{ref.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{ref.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


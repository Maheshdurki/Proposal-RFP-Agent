import React, { useEffect, useState } from 'react';
import { 
  FileText, CheckCircle2, XCircle, Clock, Brain, 
  TrendingUp, Award, AlertTriangle, ArrowRight, Sparkles, PlusCircle, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardSummary } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-slate-500 space-y-4">
        <div className="relative">
          <Brain className="w-10 h-10 animate-pulse text-indigo-600" />
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/40 animate-ping"></div>
        </div>
        <span className="text-sm font-semibold tracking-wide text-slate-700">Synchronizing Persistent Memory & Metrics...</span>
      </div>
    );
  }

  const kpis = data?.kpis || { total_rfps: 12, proposals_generated: 27, won: 18, lost: 5, pending: 4 };
  const memory = data?.memory || { total_memories: 84, winning_patterns: 21, client_preferences: 19, loss_patterns: 12, historical_proposals: 15 };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hero Showcase Banner - Crisp Light Mode */}
      <div className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden bg-gradient-to-r from-white via-indigo-50/70 to-blue-50/50 border border-slate-200 text-slate-900 shadow-sm">
        {/* Subtle mesh background highlight */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/40 via-blue-200/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Enterprise AI Engine
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200 font-mono">
                PERSISTENT MEMORY AGENT
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Proposal & RFP Agent Executive Dashboard
            </h1>
            <p className="text-slate-700 text-xs md:text-sm leading-relaxed max-w-3xl font-medium">
              Eliminating multi-million dollar proposal rework with persistent memory. The agent retains winning patterns, client rules, and past loss feedback to synthesize high-converting enterprise proposals.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onNavigate('upload')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Ingest RFP PDF</span>
            </button>
            <button
              onClick={() => onNavigate('demo')}
              className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 font-extrabold text-xs border border-indigo-200 hover:border-indigo-300 transition flex items-center space-x-2 shadow-xs active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Scenario Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid - Light Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card glass-card-hover p-4 rounded-2xl bg-white border border-slate-200 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total RFPs Ingested</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{kpis.total_rfps}</span>
            <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              100% Parsed
            </span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-4 rounded-2xl bg-white border border-slate-200 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proposals Generated</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{kpis.proposals_generated}</span>
            <span className="text-[11px] text-slate-500 font-medium">Memory-Guided</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-4 rounded-2xl bg-white border border-emerald-200 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Won Proposals</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-700 font-mono">{kpis.won}</span>
            <span className="text-xs text-emerald-700 font-extrabold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {Math.round((kpis.won / (kpis.won + kpis.lost || 1)) * 100)}% Win Rate
            </span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-4 rounded-2xl bg-white border border-rose-200 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lost Proposals</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rose-600 font-mono">{kpis.lost}</span>
            <span className="text-[11px] text-rose-700 font-medium">Learnings Retained</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-4 rounded-2xl bg-white border border-amber-200 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-amber-600 font-mono">{kpis.pending}</span>
            <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Action Required
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Memory Bank & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory Bank Telemetry */}
        <div className="lg:col-span-1 glass-card p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Memory Bank</h3>
                <p className="text-[11px] text-slate-500">Persistent Vector Telemetry</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {memory.total_memories} Memory Nodes
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition">
              <div className="flex items-center space-x-3">
                <Award className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-800">Winning Strategies</span>
              </div>
              <span className="text-sm font-bold text-emerald-700 font-mono">{memory.winning_patterns}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition">
              <div className="flex items-center space-x-3">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-800">Client Preferences</span>
              </div>
              <span className="text-sm font-bold text-indigo-700 font-mono">{memory.client_preferences}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-rose-300 transition">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-semibold text-slate-800">Loss Guardrail Rules</span>
              </div>
              <span className="text-sm font-bold text-rose-700 font-mono">{memory.loss_patterns}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition">
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">Historical Proposal Contexts</span>
              </div>
              <span className="text-sm font-bold text-blue-700 font-mono">{memory.historical_proposals}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('memory-bank')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-indigo-700 border border-slate-200 transition flex items-center justify-center space-x-2 group"
          >
            <span>Explore Full Memory Bank</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Recent Proposals Activity Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Enterprise Proposals</h3>
                <p className="text-[11px] text-slate-500">Active RFP Ingestion & Memory Status</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                  <th className="pb-3 pt-1">Proposal Title</th>
                  <th className="pb-3 pt-1">Industry</th>
                  <th className="pb-3 pt-1">Outcome Status</th>
                  <th className="pb-3 pt-1">Memory Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recent_proposals?.length ? (
                  data.recent_proposals.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-semibold text-slate-900">{prop.title}</td>
                      <td className="py-3.5 text-slate-600 font-medium">{prop.industry}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono ${
                          prop.status === 'WON' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          prop.status === 'LOST' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {prop.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Memory Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-semibold text-slate-900">ABC Healthcare EHR Cloud Analytics Platform</td>
                      <td className="py-3.5 text-slate-600 font-medium">Healthcare & Lifesciences</td>
                      <td className="py-3.5"><span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">WON</span></td>
                      <td className="py-3.5"><span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Memory Active</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-semibold text-slate-900">XYZ FinTech Real-Time Fraud Prevention System</td>
                      <td className="py-3.5 text-slate-600 font-medium">Financial Services</td>
                      <td className="py-3.5"><span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono bg-amber-50 text-amber-700 border border-amber-200">PENDING</span></td>
                      <td className="py-3.5"><span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Memory Active</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-semibold text-slate-900">Global Retail Enterprise Customer Data Platform</td>
                      <td className="py-3.5 text-slate-600 font-medium">Retail & E-Commerce</td>
                      <td className="py-3.5"><span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono bg-rose-50 text-rose-700 border border-rose-200">LOST</span></td>
                      <td className="py-3.5"><span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Memory Retained</span></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


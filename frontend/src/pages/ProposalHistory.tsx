import React, { useEffect, useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { api } from '../services/api';
import { ProposalDetail } from '../types';

interface ProposalHistoryProps {
  onSelectProposal: (prop: ProposalDetail) => void;
  onNavigate: (tab: string) => void;
}

export const ProposalHistory: React.FC<ProposalHistoryProps> = ({ onSelectProposal, onNavigate }) => {
  const [proposals, setProposals] = useState<ProposalDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.listProposals()
      .then(setProposals)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = proposals.filter(p => filter === 'ALL' || p.status === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Proposal Archive & Learning Ledger</h1>
          <p className="text-xs text-slate-500">All generated proposals, memory postures, and historical win/loss outcome records</p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
          {['ALL', 'WON', 'LOST', 'DRAFT', 'PENDING'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filter === f ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
            <tr>
              <th className="p-4">Proposal Title</th>
              <th className="p-4">Client / Industry</th>
              <th className="p-4">Memory Mode</th>
              <th className="p-4">Outcome Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-900">{p.title}</td>
                  <td className="p-4 text-slate-800">
                    <div className="font-semibold">{p.content?.client_name || 'Enterprise Client'}</div>
                    <div className="text-[11px] text-indigo-600 font-medium">{p.content?.industry || 'General'}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold ${
                      p.with_memory ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {p.with_memory ? '🧠 Memory Active' : 'Baseline (No Memory)'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono ${
                      p.status === 'WON' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      p.status === 'LOST' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => { onSelectProposal(p); onNavigate('workspace'); }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>View</span>
                    </button>
                    <a
                      href={`/api/proposals/${p.id}/export/docx`}
                      download
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition inline-flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DOCX</span>
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No proposal records found matching filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


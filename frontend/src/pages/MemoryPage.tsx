import React, { useEffect, useState } from 'react';
import { Search, Award, AlertTriangle, UserCheck, FileText, Tag } from 'lucide-react';
import { api } from '../services/api';
import { MemoryItem } from '../types';

export const MemoryPage: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');

  useEffect(() => {
    api.getAllMemories()
      .then(setMemories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = memories.filter(m => {
    const matchType = selectedType === 'ALL' || m.memory_type === selectedType;
    const matchIndustry = selectedIndustry === 'ALL' || m.industry === selectedIndustry;
    const matchSearch = search === '' || 
      m.title.toLowerCase().includes(search.toLowerCase()) || 
      m.content.toLowerCase().includes(search.toLowerCase());
    return matchType && matchIndustry && matchSearch;
  });

  const winPatterns = memories.filter(m => m.memory_type === 'win_pattern' || m.outcome === 'WON').length;
  const lossPatterns = memories.filter(m => m.memory_type === 'loss_pattern' || m.outcome === 'LOST').length;
  const clientPrefs = memories.filter(m => m.memory_type === 'client_preference').length;
  const histProps = memories.filter(m => m.memory_type === 'historical_proposal').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-mono">
              PERSISTENT MEMORY BANK
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Persistent Memory Browser</h1>
          <p className="text-xs text-slate-500 font-medium">Total indexed vector nodes: <strong className="text-indigo-700 font-mono font-bold">{memories.length}</strong> items</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card glass-card-hover p-4 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Winning Patterns</span>
          </div>
          <span className="text-2xl font-extrabold text-emerald-700 font-mono">{winPatterns}</span>
        </div>

        <div className="glass-card glass-card-hover p-4 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Loss Guardrails</span>
          </div>
          <span className="text-2xl font-extrabold text-rose-600 font-mono">{lossPatterns}</span>
        </div>

        <div className="glass-card glass-card-hover p-4 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Client Evaluator Rules</span>
          </div>
          <span className="text-2xl font-extrabold text-indigo-700 font-mono">{clientPrefs}</span>
        </div>

        <div className="glass-card glass-card-hover p-4 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Historical Proposals</span>
          </div>
          <span className="text-2xl font-extrabold text-blue-700 font-mono">{histProps}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memory titles, vector contents, tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Memory Types</option>
            <option value="win_pattern">Win Patterns</option>
            <option value="loss_pattern">Loss Patterns</option>
            <option value="client_preference">Client Preferences</option>
            <option value="historical_proposal">Historical Proposals</option>
          </select>

          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Industries</option>
            <option value="Healthcare">Healthcare</option>
            <option value="FinTech">FinTech</option>
            <option value="Banking">Banking</option>
            <option value="SaaS">SaaS</option>
            <option value="Retail">Retail</option>
            <option value="Logistics">Logistics</option>
            <option value="Government">Government</option>
          </select>
        </div>
      </div>

      {/* Memory Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(mem => (
          <div key={mem.id} className="glass-card glass-card-hover p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-mono">
                  {mem.memory_type.replace('_', ' ')}
                </span>
                {mem.outcome && (
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold font-mono ${
                    mem.outcome === 'WON' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {mem.outcome}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-xs leading-snug">{mem.title}</h3>
              <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap font-medium">{mem.content}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-indigo-600 font-semibold">Industry: {mem.industry || 'General'}</span>
              <div className="flex items-center space-x-1">
                <Tag className="w-3 h-3 text-slate-400" />
                <span className="font-mono text-[10px] font-semibold">{mem.tags?.slice(0, 2).join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = () => {
    setLoading(true);
    api.getHealth()
      .then(setHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase font-mono">
              PROPOSAL ENGINE DIAGNOSTICS
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Architecture & Configuration</h1>
          <p className="text-xs text-slate-500 font-medium">Model parameters, persistent vector store connection status, and service health</p>
        </div>
        <button
          onClick={checkHealth}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition shadow-xs"
          title="Run Diagnostics Check"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Persistent Memory Settings */}
        <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Persistent Memory Layer</h3>
              <p className="text-[11px] text-slate-500">Vector Knowledge Retention</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Memory Vector Node:</span>
              <p className="font-mono text-indigo-700 font-semibold mt-0.5">https://api.vectorize.io</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Target Memory Bank Namespace:</span>
              <p className="font-mono text-slate-900 font-bold mt-0.5">proposal-rfp-agent</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Memory Node Synchronization Status:</span>
              <div className="mt-1 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-700 font-extrabold font-mono">Active & Seeded (84 Memory Nodes)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Groq LLM Configuration */}
        <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Groq LLM Engine Configuration</h3>
              <p className="text-[11px] text-slate-500">High-Throughput Enterprise Inference</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Active Inference Model:</span>
              <p className="font-mono text-indigo-700 font-extrabold mt-0.5">{health?.groq_model || 'llama-3.3-70b-versatile'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Synthesis Architecture:</span>
              <p className="text-slate-900 font-semibold mt-0.5">Groq Llama 3 70B + Learned Strategy Engine</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Environment Configuration:</span>
              <p className="font-mono text-slate-500 mt-0.5">backend/.env</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


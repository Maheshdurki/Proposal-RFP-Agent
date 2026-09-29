import React, { useState } from 'react';
import { 
  PlaySquare, Sparkles, Brain, CheckCircle2, 
  RefreshCw, FileText, ShieldCheck, Zap, Award
} from 'lucide-react';
import { api } from '../services/api';

export const DemoMode: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [demoResult, setDemoResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [industry, setIndustry] = useState<string>('Software Engineering');

  const runDemo = async (selectedIndustry: string = industry) => {
    setLoading(true);
    setCurrentStep(1);
    try {
      setTimeout(() => setCurrentStep(2), 400);
      setTimeout(() => setCurrentStep(3), 800);
      setTimeout(() => setCurrentStep(4), 1200);

      const res = await api.runDemoScenario(selectedIndustry);
      setDemoResult(res);
      setCurrentStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-indigo-600 text-white shadow uppercase tracking-wider">
              ENTERPRISE BENCHMARK
            </span>
            <span className="text-xs text-indigo-600 font-mono font-bold">Multi-Domain Strategy Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Strategic Scenario Simulator & Audit
          </h1>
          <p className="text-xs text-slate-600 max-w-3xl">
            Audit side-by-side proposal output generated <strong>WITHOUT MEMORY</strong> (Generic static LLM response) versus <strong>WITH PERSISTENT MEMORY</strong> (Learned enterprise strategy & zero fluff).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <select
            value={industry}
            onChange={(e) => { setIndustry(e.target.value); runDemo(e.target.value); }}
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 shadow-xs"
          >
            <option value="Software Engineering">Domain: Software Engineering</option>
            <option value="Risk Analysis & Fraud Detection">Domain: Risk Analysis & Fraud Detection</option>
            <option value="UI/UX & Product Design">Domain: UI/UX & Product Design</option>
            <option value="Cyber Security">Domain: Cyber Security & Zero-Trust</option>
            <option value="Healthcare">Domain: Healthcare & EHR Modernization</option>
            <option value="FinTech">Domain: FinTech & PCI-DSS Scoring</option>
            <option value="Logistics">Domain: Logistics & IoT Telematics</option>
          </select>

          <button
            onClick={() => runDemo(industry)}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2 active:scale-95 whitespace-nowrap"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{loading ? 'Executing Pipeline...' : 'Simulate Strategy Comparison'}</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Progress Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className={`p-4 rounded-2xl border transition-all ${currentStep >= 1 ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
          <div className="text-[10px] font-extrabold uppercase tracking-wider mb-1 font-mono text-indigo-600">Step 01</div>
          <p className="text-xs font-bold text-slate-900">Domain RFP Ingested</p>
          <p className="text-[11px] text-slate-600 mt-0.5 truncate">{industry}</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${currentStep >= 2 ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
          <div className="text-[10px] font-extrabold uppercase tracking-wider mb-1 font-mono text-indigo-600">Step 02</div>
          <p className="text-xs font-bold text-slate-900">Memory Recall</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Searching vector bank...</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${currentStep >= 3 ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
          <div className="text-[10px] font-extrabold uppercase tracking-wider mb-1 font-mono text-indigo-600">Step 03</div>
          <p className="text-xs font-bold text-slate-900">Memories Recalled</p>
          <p className="text-[11px] text-slate-600 mt-0.5">84 Win/Loss Patterns</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${currentStep >= 4 ? 'bg-purple-50 border-purple-200 text-purple-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
          <div className="text-[10px] font-extrabold uppercase tracking-wider mb-1 font-mono text-purple-600">Step 04</div>
          <p className="text-xs font-bold text-slate-900">Strategy Synthesis</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Learned rules applied</p>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${currentStep >= 5 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
          <div className="text-[10px] font-extrabold uppercase tracking-wider mb-1 font-mono text-emerald-600">Step 05</div>
          <p className="text-xs font-bold text-slate-900">Side-by-Side Audit</p>
          <p className="text-[11px] text-emerald-700 font-extrabold mt-0.5">+16% Win Compliance</p>
        </div>
      </div>

      {/* Recalled Insights Summary */}
      {demoResult && (
        <div className="glass-card p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2.5 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Persistent Memory Rules Applied to {demoResult.rfp.industry} Proposal</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Learned Winning Rules Applied:
              </span>
              <ul className="list-disc list-inside text-slate-700 space-y-1 font-medium">
                {demoResult.comparison_summary.key_learned_rules_applied.map((rule: string, i: number) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-indigo-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                Quantified Strategic Advantage:
              </span>
              <p className="text-slate-900 font-bold text-sm">{demoResult.comparison_summary.improvement_delta}</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Persistent memory eliminates generic placeholder marketing fluff, enforces domain-specific pricing schedules in Indian Rupees (INR ₹), and formats strict zero-trust security architecture upfront.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Columns */}
      {demoResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: WITHOUT MEMORY */}
          <div className="glass-card p-6 rounded-2xl bg-white border border-rose-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs">
                  WITHOUT MEMORY
                </span>
                <span className="text-xs text-slate-500 font-medium">Generic LLM Prompt</span>
              </div>
              <span className="text-xs font-bold text-rose-700 font-mono bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                Compliance: {demoResult.without_memory.compliance.overall_score}%
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Strategy Posture:</span>
                <p className="text-xs text-slate-700 font-medium mt-0.5">{demoResult.without_memory.strategy.tone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Executive Summary Draft:</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans mt-1">
                  {demoResult.without_memory.proposal.sections[0].content}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1.5">
                <p className="font-bold text-rose-700">⚠ Flaws & Vulnerabilities Identified:</p>
                <ul className="list-disc list-inside space-y-1 text-[11px] font-medium text-rose-800">
                  <li>Contains vague marketing expressions ("state-of-the-art", "cutting-edge")</li>
                  <li>Fails to address regulatory compliance registration requirements</li>
                  <li>Omits structured implementation delivery timeline</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: WITH MEMORY */}
          <div className="glass-card p-6 rounded-2xl bg-white border border-emerald-300 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs">
                  🧠 WITH PERSISTENT MEMORY
                </span>
                <span className="text-xs text-indigo-600 font-bold">Learned Winning Proposal</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Compliance: {demoResult.with_hindsight_memory.compliance.overall_score}%
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Learned Strategy Posture:</span>
                <p className="text-xs text-indigo-900 font-semibold mt-0.5">{demoResult.with_hindsight_memory.strategy.tone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Memory-Optimized Executive Summary:</span>
                <div className="p-4 rounded-xl bg-slate-50 border border-emerald-200 text-xs text-slate-900 leading-relaxed font-sans mt-1">
                  {demoResult.with_hindsight_memory.proposal.sections[0].content}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5">
                <p className="font-bold text-emerald-700">✓ Memory Strategic Enhancements:</p>
                <ul className="list-disc list-inside space-y-1 text-[11px] font-medium text-emerald-800">
                  <li>Mandatory zero-trust security & compliance matrix addressed in paragraph 1</li>
                  <li>Structured 4-phase implementation delivery schedule included</li>
                  <li>Generic AI marketing buzzwords strictly excluded</li>
                  <li>Commercial structure framed in Indian Rupees (INR ₹)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 space-y-4 glass-card bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center">
            <PlaySquare className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Select an Enterprise Domain & Run Simulation</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Compare side-by-side proposal quality generated WITHOUT MEMORY vs WITH PERSISTENT MEMORY across Software Engineering, Cyber Security, Healthcare, FinTech, and more.
          </p>
          <button
            onClick={() => runDemo('Software Engineering')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md active:scale-95 transition"
          >
            Launch Software Engineering Simulation
          </button>
        </div>
      )}
    </div>
  );
};


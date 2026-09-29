import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Brain, CheckCircle2, ShieldCheck, Download, 
  FileText, RefreshCw, Edit3, ArrowRight 
} from 'lucide-react';
import { api } from '../services/api';
import { RFPDetail, ProposalDetail, ProposalStrategy } from '../types';

interface ProposalWorkspaceProps {
  rfp: RFPDetail | null;
  availableRFPs: RFPDetail[];
  onSelectRFP: (rfp: RFPDetail) => void;
  activeProposal: ProposalDetail | null;
  onProposalGenerated: (prop: ProposalDetail) => void;
  onNavigate: (tab: string) => void;
}

export const ProposalWorkspace: React.FC<ProposalWorkspaceProps> = ({
  rfp, availableRFPs, onSelectRFP, activeProposal, onProposalGenerated, onNavigate
}) => {
  const [withMemory, setWithMemory] = useState<boolean>(true);
  const [strategy, setStrategy] = useState<ProposalStrategy | null>(activeProposal?.strategy || null);
  const [proposal, setProposal] = useState<ProposalDetail | null>(activeProposal);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('exec_summary');
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (activeProposal) {
      setProposal(activeProposal);
      setStrategy(activeProposal.strategy);
    }
  }, [activeProposal]);

  const handleGenerateProposal = async (memoryMode: boolean = withMemory) => {
    if (!rfp) return;
    setLoading(true);
    try {
      // 1. Plan Strategy
      const plannedStrat = await api.planProposal(rfp.id, memoryMode);
      setStrategy(plannedStrat);

      // 2. Generate Proposal
      const generatedProp = await api.generateProposal(rfp.id, memoryMode, plannedStrat);
      setProposal(generatedProp);
      onProposalGenerated(generatedProp);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!rfp) {
    return (
      <div className="p-12 text-center space-y-4 max-w-lg mx-auto glass-card bg-white rounded-2xl border border-slate-200 my-12 shadow-sm">
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl w-14 h-14 mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Select or Ingest an RFP Document</h3>
        <p className="text-xs text-slate-600 leading-relaxed">Choose an available RFP to plan and synthesize memory-backed proposals.</p>
        
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

  const sections = proposal?.content.sections || [];
  const currentSection = sections.find(s => s.section_id === activeSectionId) || sections[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Top Controls Header */}
      <div className="glass-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        {/* Row 1: Title & Client Meta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase font-mono">
                {rfp.analysis.industry || 'General'}
              </span>
              <span className="text-xs text-slate-700 font-semibold">Enterprise Client: <strong className="text-slate-900 font-extrabold">{rfp.analysis.client_name}</strong></span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {proposal ? proposal.title : `Proposal Authoring Engine — ${rfp.title}`}
            </h1>
          </div>

          {availableRFPs.length > 1 && (
            <div className="shrink-0 flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600">Active RFP:</span>
              <select
                value={rfp.id}
                onChange={(e) => {
                  const found = availableRFPs.find(r => r.id === e.target.value);
                  if (found) onSelectRFP(found);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              >
                {availableRFPs.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.client_name ? `${r.client_name} (${r.industry})` : r.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Row 2: Aligned Action Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Memory Toggle Selector */}
          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shrink-0">
            <button
              onClick={() => { setWithMemory(true); handleGenerateProposal(true); }}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center space-x-1.5 ${
                withMemory ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>🧠 WITH PERSISTENT MEMORY</span>
            </button>
            <button
              onClick={() => { setWithMemory(false); handleGenerateProposal(false); }}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center space-x-1.5 ${
                !withMemory ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>❌ WITHOUT MEMORY (Generic)</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2 shrink-0">
            <button
              onClick={() => handleGenerateProposal(withMemory)}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition flex items-center space-x-2 shadow-xs active:scale-95 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{proposal ? 'Regenerate' : 'Synthesize Proposal'}</span>
            </button>

            {proposal && (
              <>
                <button
                  onClick={() => onNavigate('compliance')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold transition flex items-center space-x-1.5 shadow-xs active:scale-95 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Compliance Audit</span>
                </button>

                <a
                  href={`/api/proposals/${proposal.id}/export/docx`}
                  download
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 transition flex items-center space-x-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>DOCX</span>
                </a>

                <a
                  href={`/api/proposals/${proposal.id}/export/pdf`}
                  download
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 transition flex items-center space-x-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-rose-600" />
                  <span>PDF</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Strategy & Requirements (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Strategy Summary */}
          {strategy && (
            <div className="glass-card p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Brain className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">AI Strategy Plan</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Tone & Posture:</span>
                  <p className="font-semibold text-indigo-700 mt-0.5">{strategy.tone}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Winning Patterns Applied:</span>
                  <ul className="list-disc list-inside text-emerald-700 font-medium space-y-1 mt-1">
                    {strategy.winning_patterns_to_use.slice(0, 3).map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Loss Guardrails Avoided:</span>
                  <ul className="list-disc list-inside text-rose-700 font-medium space-y-1 mt-1">
                    {strategy.patterns_to_avoid.slice(0, 2).map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed font-medium">
                <strong className="text-indigo-600">Memory Impact:</strong> {strategy.hindsight_memory_influence_summary}
              </div>
            </div>
          )}

          {/* RFP Mandatory Requirements Checklist */}
          <div className="glass-card p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Traceable RFP Requirements</h3>
            </div>
            <ul className="space-y-2 text-xs">
              {rfp.analysis.mandatory_requirements.map((req, i) => (
                <li key={i} className="flex items-start space-x-2 text-slate-800 p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium leading-relaxed">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Pane: Proposal Editor / Sections (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-2xl bg-white border border-slate-200 flex flex-col min-h-[620px] shadow-sm">
          {/* Section Navigation Tabs */}
          <div className="p-3 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto custom-scrollbar bg-slate-50 rounded-t-2xl">
            {sections.length > 0 ? (
              sections.map((sec) => (
                <button
                  key={sec.section_id}
                  onClick={() => setActiveSectionId(sec.section_id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    activeSectionId === sec.section_id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {sec.title.split('.')[1] || sec.title}
                </button>
              ))
            ) : (
              <span className="text-xs text-slate-500 py-1 font-medium">Click 'Synthesize Proposal' above to populate full proposal section drafts.</span>
            )}
          </div>

          {/* Active Section Editor Content */}
          <div className="p-6 flex-1 space-y-6 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-72 text-slate-500 space-y-4">
                <Brain className="w-10 h-10 animate-spin text-indigo-600" />
                <p className="text-xs font-semibold text-slate-700">Synthesizing persistent memories and writing tailored proposal...</p>
              </div>
            ) : currentSection ? (
              <div className="space-y-5">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{currentSection.title}</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-300 flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{editMode ? 'Lock Content' : 'Edit Draft'}</span>
                    </button>
                  </div>
                </div>

                {/* Section Guardrail Highlight */}
                {currentSection.internal_memory_notes && (
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs space-y-1.5 shadow-2xs">
                    <div className="flex items-center space-x-1.5 text-indigo-800 font-extrabold uppercase tracking-wider text-[11px]">
                      <Brain className="w-4 h-4 text-indigo-600" />
                      <span>INTERNAL AI MEMORY INSIGHT (Guardrail Audit)</span>
                    </div>
                    <p className="text-indigo-950 font-mono text-[11px] leading-relaxed font-medium">
                      {currentSection.internal_memory_notes}
                    </p>
                  </div>
                )}

                {/* Proposal Text Display / Editor */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-extrabold uppercase tracking-wider">
                    <span>CUSTOMER-FACING PROPOSAL TEXT</span>
                    <span className="text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Traceable: {currentSection.traceable_requirements?.join(', ') || 'RFP Specs'}
                    </span>
                  </div>

                  {editMode ? (
                    <textarea
                      value={currentSection.content}
                      onChange={(e) => {
                        currentSection.content = e.target.value;
                        setProposal({ ...proposal! });
                      }}
                      className="w-full min-h-[380px] p-5 rounded-xl bg-white border-2 border-indigo-400 text-slate-900 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar leading-relaxed shadow-inner"
                    />
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50/90 border border-slate-200 text-slate-900 text-sm leading-relaxed whitespace-pre-wrap font-sans font-medium shadow-2xs">
                      {currentSection.content}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 space-y-4">
                <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-slate-600 text-xs font-medium">Ready to synthesize enterprise proposal for {rfp.analysis.client_name}</p>
                <button
                  onClick={() => handleGenerateProposal(withMemory)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition"
                >
                  Synthesize Proposal Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


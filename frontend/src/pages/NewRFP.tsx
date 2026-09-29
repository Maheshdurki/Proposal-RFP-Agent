import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, ArrowRight, Code, ShieldAlert, Palette, ShieldCheck, HeartPulse, Landmark } from 'lucide-react';
import { api } from '../services/api';
import { RFPDetail } from '../types';

interface NewRFPProps {
  onUploaded: (rfp: RFPDetail) => void;
  onNavigate: (tab: string) => void;
}

export const NewRFP: React.FC<NewRFPProps> = ({ onUploaded, onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF (.pdf) file.');
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const rfpDetail = await api.uploadRFP(file);
      setSuccessMsg(`RFP uploaded successfully: ${rfpDetail.title}`);
      onUploaded(rfpDetail);
    } catch (err: any) {
      setError(err.message || 'Error processing RFP upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleRFPSelect = async (industry: string) => {
    setLoading(true);
    setError(null);
    try {
      const demoData = await api.runDemoScenario(industry);
      const fakeRfp: RFPDetail = {
        id: `rfp-sample-${Date.now()}`,
        filename: `${industry.replace(/[^a-zA-Z0-9]/g, '_')}_RFP.pdf`,
        raw_text: `Sample RFP document for ${industry}...`,
        client_name: demoData.rfp.client_name,
        industry: demoData.rfp.industry,
        title: demoData.rfp.title,
        analysis: demoData.rfp,
        created_at: new Date().toISOString()
      };
      setSuccessMsg(`Sample ${industry} RFP ingested and analyzed with persistent memory recall!`);
      onUploaded(fakeRfp);
    } catch (err: any) {
      setError(err.message || 'Error generating sample RFP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>MULTI-DOMAIN PDF EXTRACTION & MEMORY RECALL</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ingest Enterprise RFP Document</h1>
        <p className="text-slate-700 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-medium">
          Upload any RFP document across Software Engineering, Risk Analysis, Cyber Security, Healthcare, FinTech, or custom enterprise domains.
        </p>
      </div>

      {/* Upload Dropzone - Enhanced High-Contrast Light Styling */}
      <div className="glass-card p-10 md:p-12 rounded-2xl bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/50 border-2 border-dashed border-indigo-300 hover:border-indigo-600 transition-all flex flex-col items-center justify-center space-y-5 text-center shadow-xs">
        <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-md">
          <Upload className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-extrabold text-slate-900">
            Drag & drop your RFP PDF file here, or{' '}
            <label className="text-indigo-600 hover:text-indigo-800 underline font-black cursor-pointer">
              browse filesystem
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </p>
          <p className="text-xs text-slate-600 font-medium">Supports PDF proposals up to 50MB with OCR & Vector Tokenization</p>
        </div>

        {file && (
          <div className="flex items-center space-x-3 px-5 py-3 rounded-xl bg-white border border-indigo-200 text-xs text-slate-900 font-mono shadow-xs">
            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-bold">{file.name}</span>
            <span className="text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
        )}

        {file && !loading && !successMsg && (
          <button
            onClick={handleUpload}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2 active:scale-95 cursor-pointer"
          >
            <span>Analyze RFP & Query Memory Node</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {loading && (
          <div className="flex items-center space-x-2.5 text-indigo-700 font-extrabold text-xs py-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Extracting features & querying persistent memory vectors...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => onNavigate('rfp-intel')}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-xs"
          >
            View Structured Intelligence
          </button>
        </div>
      )}

      {/* Pre-Loaded Multi-Domain Sample RFPs */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="text-center space-y-1">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Or Ingest Pre-Loaded Enterprise Sample RFPs
          </h3>
          <p className="text-[11px] text-slate-500">Instantly test memory recall & proposal generation across diverse project domains</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 1. Software Engineering */}
          <button
            onClick={() => handleSampleRFPSelect('Software Engineering')}
            disabled={loading}
            className="p-4 rounded-2xl bg-white glass-card-hover border border-slate-200 text-left transition space-y-1.5 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-blue-600 font-bold">
                <Code className="w-4 h-4" />
                <span className="text-xs">Software Engineering</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Sample RFP</span>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">Vanguard Cloud Microservices Modernization</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Requirements: Decoupled microservices, automated CI/CD, sub-100ms API response</p>
          </button>

          {/* 2. Risk Analysis & Fraud Detection */}
          <button
            onClick={() => handleSampleRFPSelect('Risk Analysis & Fraud Detection')}
            disabled={loading}
            className="p-4 rounded-2xl bg-white glass-card-hover border border-slate-200 text-left transition space-y-1.5 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-amber-600 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-xs">Risk & Fraud Analysis</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Sample RFP</span>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition line-clamp-1">Sentinel Real-Time Risk & Fraud Scoring</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Requirements: Sub-50ms transaction scoring, explainable AI risk governance, PCI-DSS Level 1</p>
          </button>

          {/* 3. UI/UX Product Design */}
          <button
            onClick={() => handleSampleRFPSelect('UI/UX & Product Design')}
            disabled={loading}
            className="p-4 rounded-2xl bg-white glass-card-hover border border-slate-200 text-left transition space-y-1.5 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-purple-600 font-bold">
                <Palette className="w-4 h-4" />
                <span className="text-xs">UI/UX & Product Design</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Sample RFP</span>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition line-clamp-1">OmniUser Design System & Multi-App Redesign</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Requirements: WCAG 2.1 AAA Accessibility, atomic React component library, user testing</p>
          </button>

          {/* 4. Cyber Security */}
          <button
            onClick={() => handleSampleRFPSelect('Cyber Security')}
            disabled={loading}
            className="p-4 rounded-2xl bg-white glass-card-hover border border-slate-200 text-left transition space-y-1.5 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs">Cyber Security</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Sample RFP</span>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition line-clamp-1">SecureShield Zero-Trust Security Overhaul</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Requirements: Zero-Trust architecture, SIEM threat monitoring, sub-15 min incident SLA</p>
          </button>

          {/* 5. Healthcare */}
          <button
            onClick={() => handleSampleRFPSelect('Healthcare')}
            disabled={loading}
            className="p-4 rounded-2xl bg-white glass-card-hover border border-slate-200 text-left transition space-y-1.5 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-rose-600 font-bold">
                <HeartPulse className="w-4 h-4" />
                <span className="text-xs">Healthcare</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Sample RFP</span>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition line-clamp-1">ABC Healthcare Enterprise AI & HIPAA RFP</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Requirements: HIPAA Omnibus rule, HL7/FHIR connectors, 24/7 dedicated support</p>
          </button>

          {/* 6. FinTech */}
          <button
            onClick={() => handleSampleRFPSelect('FinTech')}
            disabled={loading}
            className="p-4 rounded-2xl bg-white glass-card-hover border border-slate-200 text-left transition space-y-1.5 group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-indigo-600 font-bold">
                <Landmark className="w-4 h-4" />
                <span className="text-xs">FinTech & Banking</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Sample RFP</span>
            </div>
            <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">Apex Financial Transaction Scoring RFP</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Requirements: PCI-DSS Level 1 compliance, sub-50ms transaction latency, SOC-2</p>
          </button>
        </div>
      </div>
    </div>
  );
};


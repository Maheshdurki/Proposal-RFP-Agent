import { 
  DashboardSummary, RFPDetail, RFPAnalysis, MemoryRecallResponse, 
  MemoryItem, ProposalDetail, ProposalStrategy, ComplianceReport 
} from '../types';

const API_BASE = '/api';

export const api = {
  // Health
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Dashboard
  getDashboard: async (): Promise<DashboardSummary> => {
    const res = await fetch(`${API_BASE}/dashboard`);
    return res.json();
  },

  // RFPs
  uploadRFP: async (file: File): Promise<RFPDetail> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/rfps/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to upload RFP');
    }
    return res.json();
  },

  listRFPs: async (): Promise<RFPDetail[]> => {
    const res = await fetch(`${API_BASE}/rfps`);
    return res.json();
  },

  getRFP: async (id: string): Promise<RFPDetail> => {
    const res = await fetch(`${API_BASE}/rfps/${id}`);
    return res.json();
  },

  // Memory
  recallMemories: async (params: { query: string; industry?: string; client_name?: string; requirements?: string[] }): Promise<MemoryRecallResponse> => {
    const res = await fetch(`${API_BASE}/memory/recall`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  getAllMemories: async (): Promise<MemoryItem[]> => {
    const res = await fetch(`${API_BASE}/memory/all`);
    return res.json();
  },

  getMemoryStats: async () => {
    const res = await fetch(`${API_BASE}/memory/stats`);
    return res.json();
  },

  // Proposals
  planProposal: async (rfpId: string, withMemory: boolean = true): Promise<ProposalStrategy> => {
    const res = await fetch(`${API_BASE}/proposals/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rfp_id: rfpId, with_memory: withMemory }),
    });
    return res.json();
  },

  generateProposal: async (rfpId: string, withMemory: boolean = true, strategyOverride?: ProposalStrategy): Promise<ProposalDetail> => {
    const res = await fetch(`${API_BASE}/proposals/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rfp_id: rfpId,
        with_memory: withMemory,
        strategy_override: strategyOverride,
      }),
    });
    return res.json();
  },

  getProposal: async (id: string): Promise<ProposalDetail> => {
    const res = await fetch(`${API_BASE}/proposals/${id}`);
    return res.json();
  },

  listProposals: async (): Promise<ProposalDetail[]> => {
    const res = await fetch(`${API_BASE}/proposals`);
    return res.json();
  },

  submitFeedback: async (proposalId: string, payload: { outcome: string; reasons: string[]; client_feedback?: string; learnings?: string }) => {
    const res = await fetch(`${API_BASE}/proposals/${proposalId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Demo
  runDemoScenario: async (industry: string = 'Healthcare') => {
    const res = await fetch(`${API_BASE}/demo/run-scenario?industry=${encodeURIComponent(industry)}`, {
      method: 'POST',
    });
    return res.json();
  }
};

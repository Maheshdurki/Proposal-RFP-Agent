export interface RFPAnalysis {
  title: string;
  client_name: string | null;
  industry: string | null;
  project_summary: string;
  mandatory_requirements: string[];
  optional_requirements: string[];
  deliverables: string[];
  technical_requirements: string[];
  compliance_requirements: string[];
  evaluation_criteria: string[];
  deadlines: string[];
  budget_information: string | null;
  implementation_requirements: string[];
  support_requirements: string[];
  risks: string[];
  ambiguities: string[];
  keywords: string[];
}

export interface RFPDetail {
  id: string;
  filename: string;
  raw_text: string;
  client_name: string | null;
  industry: string | null;
  title: string;
  analysis: RFPAnalysis;
  created_at: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  content: string;
  memory_type: 'historical_proposal' | 'client_preference' | 'win_pattern' | 'loss_pattern' | 'feedback';
  industry?: string;
  proposal_id?: string;
  outcome?: 'WON' | 'LOST' | 'PREFERENCE';
  relevance_score: number;
  tags: string[];
  metadata: Record<string, any>;
  created_at?: string;
}

export interface MemoryRecallResponse {
  query: string;
  total_memories_found: number;
  winning_patterns: string[];
  loss_patterns: string[];
  client_preferences: string[];
  historical_references: MemoryItem[];
  raw_memories: MemoryItem[];
}

export interface ProposalStrategy {
  tone: string;
  priority_sections: string[];
  winning_patterns_to_use: string[];
  patterns_to_avoid: string[];
  key_selling_points: string[];
  requirement_mapping_strategy: Record<string, string>;
  hindsight_memory_influence_summary: string;
}

export interface ProposalSection {
  section_id: string;
  title: string;
  content: string;
  traceable_requirements: string[];
  internal_memory_notes?: string;
}

export interface ProposalContent {
  title: string;
  client_name: string;
  industry: string;
  sections: ProposalSection[];
  requirement_matrix: Array<{
    requirement: string;
    proposal_section: string;
    evidence_or_memory: string;
    status: string;
  }>;
}

export interface ComplianceReport {
  overall_score: number;
  requirements_covered: number;
  requirements_total: number;
  missing_requirements: string[];
  unsupported_claims: string[];
  warnings: string[];
  evidence_coverage_score: number;
  compliance_score: number;
  memory_relevance_score: number;
  human_review_items: string[];
}

export interface ProposalDetail {
  id: string;
  rfp_id: string;
  title: string;
  status: 'DRAFT' | 'APPROVED' | 'WON' | 'LOST' | 'PENDING';
  with_memory: boolean;
  strategy: ProposalStrategy;
  content: ProposalContent;
  compliance?: ComplianceReport;
  feedback_text?: string;
  win_loss_reasons?: string[];
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  kpis: {
    total_rfps: number;
    proposals_generated: number;
    won: number;
    lost: number;
    pending: number;
  };
  memory: {
    total_memories: number;
    winning_patterns: number;
    client_preferences: number;
    loss_patterns: number;
    historical_proposals: number;
  };
  recent_proposals: Array<{
    id: string;
    title: string;
    client_name: string;
    industry: string;
    status: string;
    with_memory: boolean;
    created_at: string;
  }>;
}

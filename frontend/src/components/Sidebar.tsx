import React from 'react';
import { 
  LayoutDashboard, FileUp, FileText, Brain, Sparkles, 
  ShieldCheck, History, Database, Settings, PlaySquare, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const sections = [
    {
      title: 'PROPOSAL WORKFLOW',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'upload', label: 'Ingest RFP PDF', icon: FileUp, badge: 'AI INGEST' },
        { id: 'rfp-intel', label: 'RFP Intelligence', icon: FileText },
        { id: 'memory-insights', label: 'Memory Insights', icon: Brain },
        { id: 'workspace', label: 'Proposal Workspace', icon: Sparkles },
      ]
    },
    {
      title: 'AUDIT & BENCHMARK',
      items: [
        { id: 'demo', label: 'Scenario Simulator', icon: PlaySquare, badge: 'PRO COMPARISON' },
        { id: 'compliance', label: 'Compliance Audit', icon: ShieldCheck },
      ]
    },
    {
      title: 'KNOWLEDGE & MEMORY',
      items: [
        { id: 'history', label: 'Proposal History', icon: History },
        { id: 'memory-bank', label: 'Memory Bank', icon: Database, badge: '84 MEMORIES' },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-20 shadow-sm">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-md flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-slate-900 text-sm tracking-tight leading-tight truncate">
              Proposal & RFP Agent
            </h1>
            <p className="text-[10px] text-indigo-600 font-bold tracking-wide uppercase truncate">
              Cognitive Proposal Platform
            </p>
          </div>
        </div>
      </div>

      {/* Categorized Navigation */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {item.badge}
                    </span>
                  ) : isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Persistent Node Footer */}
      <div className="p-3 border-t border-slate-200 m-2 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold mb-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Memory Engine Active</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
            99.8% Sync
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>Vector Store Node:</span>
          <code className="text-indigo-600 font-mono font-bold">rfp-agent-node</code>
        </div>
      </div>
    </aside>
  );
};


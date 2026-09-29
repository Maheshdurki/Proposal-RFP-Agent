import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { NewRFP } from './pages/NewRFP';
import { RFPIntelligence } from './pages/RFPIntelligence';
import { MemoryInsights } from './pages/MemoryInsights';
import { ProposalWorkspace } from './pages/ProposalWorkspace';
import { ComplianceReview } from './pages/ComplianceReview';
import { ProposalHistory } from './pages/ProposalHistory';
import { MemoryPage } from './pages/MemoryPage';
import { DemoMode } from './pages/DemoMode';
import { SettingsPage } from './pages/SettingsPage';
import { RFPDetail, ProposalDetail } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRFP, setCurrentRFP] = useState<RFPDetail | null>(null);
  const [currentProposal, setCurrentProposal] = useState<ProposalDetail | null>(null);
  const [availableRFPs, setAvailableRFPs] = useState<RFPDetail[]>([]);

  // Load existing RFPs on startup
  const reloadRFPs = async () => {
    try {
      const rfps = await api.listRFPs();
      setAvailableRFPs(rfps);
      if (rfps.length > 0 && !currentRFP) {
        setCurrentRFP(rfps[0]);
      }
    } catch (err) {
      console.error('Failed to load RFPs:', err);
    }
  };

  useEffect(() => {
    reloadRFPs();
  }, []);

  const handleRFPUploaded = (rfp: RFPDetail) => {
    setCurrentRFP(rfp);
    setAvailableRFPs(prev => [rfp, ...prev.filter(r => r.id !== rfp.id)]);
    setActiveTab('rfp-intel');
  };

  const handleSelectRFP = (rfp: RFPDetail) => {
    setCurrentRFP(rfp);
  };

  const handleProposalGenerated = (proposal: ProposalDetail) => {
    setCurrentProposal(proposal);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'demo':
        return <DemoMode />;
      case 'upload':
        return <NewRFP onUploaded={handleRFPUploaded} onNavigate={setActiveTab} />;
      case 'rfp-intel':
        return (
          <RFPIntelligence 
            rfp={currentRFP} 
            availableRFPs={availableRFPs}
            onSelectRFP={handleSelectRFP}
            onNavigate={setActiveTab} 
          />
        );
      case 'memory-insights':
        return (
          <MemoryInsights 
            rfp={currentRFP} 
            availableRFPs={availableRFPs}
            onSelectRFP={handleSelectRFP}
            onNavigate={setActiveTab} 
          />
        );
      case 'workspace':
        return (
          <ProposalWorkspace
            rfp={currentRFP}
            availableRFPs={availableRFPs}
            onSelectRFP={handleSelectRFP}
            activeProposal={currentProposal}
            onProposalGenerated={handleProposalGenerated}
            onNavigate={setActiveTab}
          />
        );
      case 'compliance':
        return <ComplianceReview proposal={currentProposal} onNavigate={setActiveTab} />;
      case 'history':
        return <ProposalHistory onSelectProposal={setCurrentProposal} onNavigate={setActiveTab} />;
      case 'memory-bank':
        return <MemoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          activeTab={activeTab} 
          currentRFP={currentRFP}
          availableRFPs={availableRFPs}
          onSelectRFP={handleSelectRFP}
          onQuickDemoClick={() => setActiveTab('demo')} 
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;

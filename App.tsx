import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare, Network, FileText, Settings, Database } from 'lucide-react';
import { SlackSimulator } from './components/SlackSimulator';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { ReadmeViewer } from './components/ReadmeViewer';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.SIMULATOR);

  const renderView = () => {
    switch (currentView) {
      case View.SIMULATOR:
        return <SlackSimulator />;
      case View.ARCHITECTURE:
        return <ArchitectureDiagram />;
      case View.README:
        return <ReadmeViewer />;
      default:
        return <SlackSimulator />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar - Slack Style */}
      <aside className="w-64 bg-[#3F0E40] flex flex-col flex-shrink-0 text-[#cfc3cf]">
        {/* Workspace Header */}
        <div className="h-12 flex items-center px-4 font-bold text-white border-b border-[#5d2c5d] hover:bg-[#350d36] cursor-pointer transition-colors">
          <span className="truncate">DevOps Workspace</span>
          <span className="ml-auto text-xs opacity-70">▼</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <div className="px-4 pb-2 text-xs font-medium uppercase opacity-80 tracking-wider">Apps</div>
          
          <button
            onClick={() => setCurrentView(View.SIMULATOR)}
            className={`w-full flex items-center px-4 py-1.5 hover:bg-[#350d36] transition-colors ${currentView === View.SIMULATOR ? 'bg-[#1164A3] text-white' : ''}`}
          >
            <MessageSquare size={16} className="mr-3" />
            <span className="truncate">Slack Simulator</span>
          </button>

          <button
             onClick={() => setCurrentView(View.ARCHITECTURE)}
             className={`w-full flex items-center px-4 py-1.5 hover:bg-[#350d36] transition-colors ${currentView === View.ARCHITECTURE ? 'bg-[#1164A3] text-white' : ''}`}
          >
            <Network size={16} className="mr-3" />
            <span className="truncate">Architecture</span>
          </button>

          <button
             onClick={() => setCurrentView(View.README)}
             className={`w-full flex items-center px-4 py-1.5 hover:bg-[#350d36] transition-colors ${currentView === View.README ? 'bg-[#1164A3] text-white' : ''}`}
          >
            <FileText size={16} className="mr-3" />
            <span className="truncate">Setup Guide (README)</span>
          </button>

          <div className="mt-8 px-4 pb-2 text-xs font-medium uppercase opacity-80 tracking-wider">Resources</div>
          <div className="px-4 py-1.5 flex items-center opacity-70 hover:opacity-100 hover:bg-[#350d36] cursor-not-allowed">
             <Database size={16} className="mr-3" />
             <span>AWS EC2 Config</span>
          </div>
          <div className="px-4 py-1.5 flex items-center opacity-70 hover:opacity-100 hover:bg-[#350d36] cursor-not-allowed">
             <Settings size={16} className="mr-3" />
             <span>Slack App Settings</span>
          </div>

        </nav>

        {/* Status Bar */}
        <div className="p-4 border-t border-[#5d2c5d]">
           <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">User: Admin</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Contextual */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6 shadow-sm z-10">
           <h1 className="font-bold text-gray-800 text-lg">
             {currentView === View.SIMULATOR && "Interactive Query Simulator"}
             {currentView === View.ARCHITECTURE && "System Architecture"}
             {currentView === View.README && "Integration Guide"}
           </h1>
           <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">v1.0.2</span>
           </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-hidden relative p-6">
           {renderView()}
        </div>
      </main>
    </div>
  );
}

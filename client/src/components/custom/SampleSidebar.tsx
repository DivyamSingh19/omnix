import React from 'react';
import { 
  ChevronRight, 
  Building2, 
  Folder, 
  Bot, 
  BookOpen, 
  Settings, 
  Hammer,
  BarChart3
} from 'lucide-react';

export default function Sidebar() {
  const platformItems = [
    { icon: Folder, label: 'Playground' },
    { icon: Bot, label: 'Models' },
    { icon: BookOpen, label: 'Documentation' },
    { icon: Settings, label: 'Settings' }
  ];

  const projectItems = [
    { icon: Hammer, label: 'Design Engineering' },
    { icon: BarChart3, label: 'Sales & Marketing' }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white">Acme Inc</h1>
              <p className="text-sm text-gray-400">Enterprise</p>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-800 rounded">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8">
        {/* Platform Section */}
        <div>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Platform
          </h2>
          <ul className="space-y-1">
            {platformItems.map((item, index) => (
              <li key={index}>
                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors group">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
            Projects
          </h2>
          <ul className="space-y-1">
            {projectItems.map((item, index) => (
              <li key={index}>
                <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors group">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
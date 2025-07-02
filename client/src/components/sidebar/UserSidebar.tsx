import React, { useState } from 'react';
 
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Home, 
  Gift, 
  Briefcase, 
  Target, 
  FolderOpen, 
  Settings, 
  LogOut,
  Menu,
  PanelLeft
} from 'lucide-react';

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const navigationItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Grants', icon: Gift, href: '/grants' },
    { label: 'Gigs', icon: Briefcase, href: '/gigs' },
    { label: 'Bounties', icon: Target, href: '/bounties' },
    { label: 'Applied Projects', icon: FolderOpen, href: '/applied-projects' },
  ];

  const handleNavigation = (href:string) => {
    // In a real Next.js app, you'd use Next.js router here
    console.log(`Navigating to: ${href}`);
  };

  const handleManageProfile = () => {
    console.log('Managing profile...');
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="font-inter">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className={`h-screen bg-black text-white flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
          {/* Header with toggle */}
          <div className="p-3">
            <CollapsibleTrigger asChild>
              <div className="flex items-center h-12 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors px-3">
                {isOpen ? <PanelLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </div>
            </CollapsibleTrigger>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 px-3 space-y-1">
            {navigationItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center h-12 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors ${
                  isOpen ? 'px-3' : 'justify-center'
                }`}
                onClick={() => handleNavigation(item.href)}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isOpen ? 'mr-3' : ''}`} />
                <CollapsibleContent className="overflow-hidden">
                  <span className="whitespace-nowrap text-sm font-normal">{item.label}</span>
                </CollapsibleContent>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="p-3 space-y-1">
            <div
              className={`flex items-center h-12 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors ${
                isOpen ? 'px-3' : 'justify-center'
              }`}
              onClick={handleManageProfile}
              title={!isOpen ? 'Manage Profile' : undefined}
            >
              <Settings className={`h-5 w-5 flex-shrink-0 ${isOpen ? 'mr-3' : ''}`} />
              <CollapsibleContent className="overflow-hidden">
                <span className="whitespace-nowrap text-sm font-normal">Manage Profile</span>
              </CollapsibleContent>
            </div>
            
            <div
              className={`flex items-center h-12 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors ${
                isOpen ? 'px-3' : 'justify-center'
              }`}
              onClick={handleLogout}
              title={!isOpen ? 'Logout' : undefined}
            >
              <LogOut className={`h-5 w-5 flex-shrink-0 ${isOpen ? 'mr-3' : ''}`} />
              <CollapsibleContent className="overflow-hidden">
                <span className="whitespace-nowrap text-sm font-normal">Logout</span>
              </CollapsibleContent>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default UserSidebar;
"use client";
import { Home, Wallet, LogOut, User, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { StatefulButton } from "../ui/statefulbutton";
import { BentoGrid, BentoGridItem } from "../ui/bentogrid";
import { RippleButton } from "../magicui/ripple-button";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { label: "Home", icon: Home, key: "home" },
    { label: "Create Grants", icon: FileText, key: "grants" },
    { label: "Create Gigs", icon: FileText, key: "gigs" },
    { label: "Create Bounties", icon: FileText, key: "bounties" },
    { label: "View Applications", icon: FileText, key: "view" },
    { label: "Manage DAO", icon: FileText, key: "manage" },
  ];

  const connectWallet = () => {};
  const manageProfile = () => {};
  const handleLogout = () => {};
  return (
    <div className="flex min-h-screen bg-slate-900/20">
      {/* Sidebar */}
      <aside className="w-64 bg-fray-100 border-r border-gray-200 flex flex-col justify-between py-6 px-4">
        <div className="space-y-6">
          {/* Nav Links */}
          <nav className="space-y-2">
            {navItems.map(({ label, icon: Icon, key }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center w-full px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === key
                    ? "bg-gradient-to-r from-white to-cyan-300 text-black"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-2">
          <RippleButton
            className="bg-gradient-to-r from-white to-cyan-300 border-none"
            onClick={manageProfile}
          >
            <span className="flex items-center justify-center space-x-2 min-w-[140px]">
              <User className="w-4 h-4 mr-3 shrink-0" />
              <span> Manage Profile</span>
            </span>
          </RippleButton>

          <RippleButton
            className="bg-gradient-to-r from-white to-cyan-300 border-none"
            onClick={handleLogout}
          >
            <span className="flex items-center justify-center space-x-2 min-w-[140px]">
              <LogOut className="w-4 h-4 mr-3 shrink-0" />
              <span> Logout</span>
            </span>
          </RippleButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ">
        {/* Connect Wallet */}
        <div className="flex justify-end">
          <StatefulButton className="text-black mb-4" onClick={connectWallet}>
            <span className="flex items-center justify-center space-x-2 min-w-[140px]">
              <Wallet className="w-4 h-4 shrink-0" />
              <span>Connect Wallet</span>
            </span>
          </StatefulButton>
        </div>

        <h1 className="text-6xl text-white font-bold mb-4">Hello shawty</h1>

        <div className="bg-gray-100 p-6 rounded-md shadow">
          <h2 className="text-2xl font-bold mb-4">Manage DAO</h2>
          <BentoGrid className="max-w-6xl mx-auto">
            <BentoGridItem
              title="Create New Grant"
              description="Start a new funding opportunity for developers or researchers."
              header={
                <div className="flex items-center justify-center h-full min-h-[6rem] rounded-lg bg-white">
                  <Plus className="h-6 w-6 text-cyan-500" />
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300"
            />

            <BentoGridItem
              title="Manage Gigs"
              description="Edit, archive or feature posted developer gigs."
              header={
                <div className="flex items-center justify-center h-full min-h-[6rem] rounded-lg bg-white">
                  <FileText className="h-6 w-6 text-cyan-500" />
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300"
            />

            <BentoGridItem
              title="Manage Bounties"
              description="bounty shytt."
              header={
                <div className="flex items-center justify-center h-full min-h-[6rem] rounded-lg bg-white">
                  <FileText className="h-6 w-6 text-cyan-500" />
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300"
            />

            <BentoGridItem
              title="Application Stats"
              description="View all submitted applications across grants, gigs, and bounties."
              header={
                <div className="text-center text-black">
                  <div className="text-xl font-bold">132</div>
                  <div className="text-sm opacity-70">Pending Applications</div>
                </div>
              }
              className="md:col-span-2 bg-gradient-to-tr from-white to-cyan-300"
            />

            <BentoGridItem
              title="DAO Proposal Manager"
              description="Review and manage DAO proposals or member voting."
              header={
                <div className="text-center text-black">
                  <div className="text-xl font-bold">5 Active</div>
                  <div className="text-sm opacity-70">Open Proposals</div>
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300"
            />

            <BentoGridItem
              title="Audit Log"
              description="Recent admin activities for moderation and system checks."
              header={
                <div className="text-center text-black">
                  <div className="text-sm opacity-70">
                    Last Action: 2 mins ago
                  </div>
                  <div className="text-lg font-bold">Grant Updated</div>
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300"
            />

            <BentoGridItem
              title="System Status"
              description="Check uptime and backend service health."
              header={
                <div className="text-center text-black">
                  <h4>All Systems Operational</h4>
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300"
            />
          </BentoGrid>
        </div>
      </main>
    </div>
  );
}

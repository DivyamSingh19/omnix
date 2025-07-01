"use client";
import { Home, Wallet, LogOut, User, FileText, Plus } from "lucide-react";
import { useState } from "react";
import { StatefulButton } from "../ui/statefulbutton";
import { BentoGrid, BentoGridItem } from "../ui/bentogrid";
import { RippleButton } from "../magicui/ripple-button";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { label: "Home", icon: Home, key: "home" },
    { label: "Grants", icon: FileText, key: "grants" },
    { label: "Gigs", icon: FileText, key: "gigs" },
    { label: "Bounties", icon: FileText, key: "bounties" },
    { label: "Applied Projects", icon: FileText, key: "applied" },
  ];

  const connectWallet = () => {};
  const manageProfile = () => {};
  const handleLogout = () => {};
  return (
    <div className="flex min-h-screen bg-white">
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

        <div className="bg-white p-6 rounded-md shadow">
          <h2 className="text-2xl font-bold mb-4">Latest shytt</h2>
          <BentoGrid className="max-w-6xl mx-auto">
            <BentoGridItem
              title="ML shytt"
              description="ml engineers required"
              header={
                <div className="bg-white flex items-center justify-center h-full min-h-[6rem] rounded-lg">
                  <div className="text-black text-center">
                    <div className="text-lg font-bold">Gig</div>
                    <div className="text-sm opacity-90">$50K - $100K</div>
                  </div>
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300 "
            />

            <BentoGridItem
              title="Featured Grant Program"
              description="Major funding opportunity for innovative blockchain projects. Apply now for up to $100K in funding."
              header={
                <div className="flex bg-white items-center justify-center h-full min-h-[6rem] rounded-lg">
                  <div className="text-black  text-center">
                    <div className="text-2xl font-bold">$100K</div>
                    <div className="text-sm opacity-90">Available</div>
                  </div>
                </div>
              }
              className="md:col-span-2 bg-gradient-to-tr from-white to-cyan-300 "
            />

            <BentoGridItem
              title="Smart Contract Audit"
              description="Looking for experienced auditor to review DeFi protocol smart contracts."
              header={
                <div className="flex bg-white items-center justify-center h-full min-h-[6rem] rounded-lg">
                  <div className="text-black  text-center">
                    <div className="text-lg font-bold">Gig</div>
                    <div className="text-sm opacity-90">$5K - $10K</div>
                  </div>
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300 "
            />

            <BentoGridItem
              title="Bug Bounty"
              description="Find critical vulnerabilities in our protocol and earn rewards."
              header={
                <div className="flex items-center bg-white justify-center h-full min-h-[6rem] rounded-lg">
                  <div className="text-black  text-center">
                    <div className="text-lg font-bold">Bounty</div>
                    <div className="text-sm opacity-90">Up to $25K</div>
                  </div>
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300"
            />

            <BentoGridItem
              title="Research Grant"
              description="Funding for academic research in zero-knowledge proofs and privacy."
              header={
                <div className="flex items-center justify-center h-full min-h-[6rem] bg-white rounded-lg">
                  <div className="text-black  text-center">
                    <div className="text-lg font-bold">Grant</div>
                    <div className="text-sm opacity-90">$15K - $50K</div>
                  </div>
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300"
            />

            <BentoGridItem
              title="Open Source Project"
              description="Join our team building the next generation of decentralized applications."
              header={
                <div className="flex items-center justify-center h-full min-h-[6rem] bg-white rounded-lg">
                  <div className="text-black  text-center">
                    <div className="text-lg font-bold">Project</div>
                    <div className="text-sm opacity-90">Collaboration</div>
                  </div>
                </div>
              }
              className="md:col-span-2 bg-gradient-to-tr from-white to-cyan-300"
            />

            <BentoGridItem
              title="Frontend Development"
              description="Need a React developer for a 2-week sprint on our DApp interface."
              header={
                <div className="flex items-center justify-center h-full min-h-[6rem] rounded-lg bg-white">
                  <div className="text-black  text-center">
                    <div className="text-lg font-bold">Quick Gig</div>
                    <div className="text-sm opacity-90">2 weeks</div>
                  </div>
                </div>
              }
              className="bg-gradient-to-tr from-white to-cyan-300 "
            />
          </BentoGrid>
        </div>
      </main>
    </div>
  );
}

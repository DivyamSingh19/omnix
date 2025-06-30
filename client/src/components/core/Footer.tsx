import React from 'react';
import { Github, Twitter, ExternalLink, Shield, Zap, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Omnix
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Autonomous AI governance for DAOs. Connect your wallet, delegate decisions, and let AI vote on your behalf with full transparency and control.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                <Twitter className="w-5 h-5" />
              </a>
              
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">How it Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Register Agent</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Vote History</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Agent Settings</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Smart Contracts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security Audit</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Whitepaper</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Bug Reports</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Feature Requests</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Status Page</a></li>
            </ul>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <Shield className="w-6 h-6 text-blue-400" />
              <div>
                <h5 className="text-white font-medium text-sm">Secure & Verifiable</h5>
                <p className="text-gray-400 text-xs">All votes recorded on-chain</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <Zap className="w-6 h-6 text-purple-400" />
              <div>
                <h5 className="text-white font-medium text-sm">AI-Powered</h5>
                <p className="text-gray-400 text-xs">Intelligent proposal analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <Users className="w-6 h-6 text-green-400" />
              <div>
                <h5 className="text-white font-medium text-sm">Full Control</h5>
                <p className="text-gray-400 text-xs">Override or revoke anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>&copy; 2025 Omnix. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Network Status: Active</span>
              </div>
              <a 
                href="#" 
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
              >
                <span>View on Etherscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
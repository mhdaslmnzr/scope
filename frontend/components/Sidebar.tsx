'use client'

import { 
  LayoutDashboard, 
  Network, 
  Shield, 
  AlertTriangle, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/', active: true },
  { name: 'Supply Chain Intel', icon: Network, href: '/supply-chain' },
  { name: 'Data Breaches', icon: Shield, href: '/breaches' },
  { name: 'Threat Intel', icon: AlertTriangle, href: '/threats' },
  { name: 'AI Reports', icon: FileText, href: '/reports' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    isCollapsed ? 'mx-auto' : 'mr-3'
                  }`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Current Company</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                Pharmexis BioTech
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
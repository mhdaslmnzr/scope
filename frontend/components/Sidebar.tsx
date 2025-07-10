'use client'

import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  AlertTriangle, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Eye,
  Activity,
  Building2,
  Search,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/', description: 'Overview & Analytics' },
  { name: 'Vendor Intake', icon: Users, href: '/vendor-intake', description: 'Add New Vendors' },
  { name: 'AI Reports', icon: FileText, href: '/ai-reports', description: 'Risk Analysis Reports' },
  { name: 'OSINT Analysis', icon: Search, href: '/osint-analysis', description: 'Domain Intelligence' },
  { name: 'Threat Intel', icon: Shield, href: '/threat-intel', description: 'Security Threats' },
  { name: 'Data Breaches', icon: AlertTriangle, href: '/breaches', description: 'Breach Tracking' },
  { name: 'Supply Chain', icon: Building2, href: '/supply-chain', description: 'Chain Analysis' },
  { name: 'Monitoring', icon: Activity, href: '/monitoring', description: 'Real-time Alerts' },
  { name: 'Settings', icon: Settings, href: '/settings', description: 'Platform Config' },
]

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={`bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-fast"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-fast group ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-r-2 border-blue-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title={!isCollapsed ? item.description : item.name}
                  >
                    <item.icon className={`h-5 w-5 ${
                      isCollapsed ? 'mx-auto' : 'mr-3'
                    } ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} />
                    {!isCollapsed && (
                      <div className="flex-1">
                        <span className="font-poppins text-render-optimized">{item.name}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-poppins">
                          {item.description}
                        </p>
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-poppins">Current Company</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate font-poppins text-render-optimized">
                Deep Health Inc
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-poppins">
                Healthcare, Pharmaceuticals, Biotechnology
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
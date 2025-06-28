'use client'

import { useState } from 'react'
import { Menu, Search, User, Settings, Building2 } from 'lucide-react'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface TopbarProps {
  onMenuToggle: () => void
  currentCompany?: string
}

export default function Topbar({ onMenuToggle, currentCompany = "Pharmexis BioTech Pvt Ltd" }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Left: Logo and App Name */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">SCOPE</span>
        </div>
      </div>

      {/* Center: Search Input */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors, threats, or reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right: Profile Icon with Dropdown */}
      <div className="flex items-center space-x-4">
        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </HeadlessMenu.Button>
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HeadlessMenu.Items className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john.doe@company.com</p>
              </div>
              
              <div className="px-4 py-2">
                <p className="text-xs text-gray-500 mb-1">Viewing:</p>
                <p className="text-sm font-medium text-gray-900 truncate">{currentCompany}</p>
              </div>
              
              <div className="py-1">
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      <Building2 className="h-4 w-4" />
                      <span>Change Company</span>
                    </button>
                  )}
                </HeadlessMenu.Item>
                
                <HeadlessMenu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  )}
                </HeadlessMenu.Item>
              </div>
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>
      </div>
    </div>
  )
} 
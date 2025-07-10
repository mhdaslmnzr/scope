'use client'

import { useState, useEffect } from 'react'
import { Menu, Search, User, Settings, Building2, Sun, Moon, Bell, LogOut } from 'lucide-react'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface TopbarProps {
  onMenuToggle: () => void
  currentCompany?: string
}

export default function Topbar({ onMenuToggle, currentCompany = "Deep Health Inc" }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dark, setDark] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
    setDark(isDark)
    
    // Apply theme immediately
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDark = () => {
    const newDark = !dark
    setDark(newDark)
    
    // Update DOM and localStorage
    if (newDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center space-x-6">
        <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-fast">
          <span className="sr-only">Toggle sidebar</span>
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        {/* SCOPE Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg font-poppins text-render-optimized">S</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins text-render-optimized">
              SCOPE
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-poppins">
              Supply Chain Security Platform
            </p>
          </div>
        </div>
        
        {/* Current Company */}
        <div className="hidden lg:block pl-6 border-l border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-poppins">Current Company</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white font-poppins">{currentCompany}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none w-48 font-poppins"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-fast">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDark} 
          className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-fast"
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
        </button>
        
        {/* User Menu */}
        <HeadlessMenu as="div" className="relative">
          <HeadlessMenu.Button className="flex items-center space-x-3 p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-fast">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white font-poppins">
                Dr. Rajesh Kumar
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-poppins">
                Chief Security Officer
              </p>
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
            <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50">
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                    active ? 'bg-gray-100 dark:bg-slate-800' : ''
                  } text-gray-700 dark:text-gray-300 font-poppins`}>
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                )}
              </HeadlessMenu.Item>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                    active ? 'bg-gray-100 dark:bg-slate-800' : ''
                  } text-gray-700 dark:text-gray-300 font-poppins`}>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                )}
              </HeadlessMenu.Item>
              <div className="my-2 border-t border-gray-200 dark:border-slate-700"></div>
              <HeadlessMenu.Item>
                {({ active }) => (
                  <button className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                    active ? 'bg-gray-100 dark:bg-slate-800' : ''
                  } text-red-600 dark:text-red-400 font-poppins`}>
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </HeadlessMenu.Item>
            </HeadlessMenu.Items>
          </Transition>
        </HeadlessMenu>
      </div>
    </header>
  )
} 
"use client"

import Layout from "../../components/Layout";
import { useState } from "react";
import { User, Bell, Lock, Save } from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [security, setSecurity] = useState({
    mfa: true,
    passwordChanged: "2024-05-01",
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        {/* Profile */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">Profile</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button className="mt-2 flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Save className="h-4 w-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </div>
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">Notifications</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={e => setNotifications({ ...notifications, email: e.target.checked })}
                className="form-checkbox h-4 w-4 text-primary-600"
              />
              <span>Email Alerts</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={e => setNotifications({ ...notifications, sms: e.target.checked })}
                className="form-checkbox h-4 w-4 text-primary-600"
              />
              <span>SMS Alerts</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={e => setNotifications({ ...notifications, push: e.target.checked })}
                className="form-checkbox h-4 w-4 text-primary-600"
              />
              <span>Push Notifications</span>
            </label>
            <button className="mt-2 flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Save className="h-4 w-4" />
              <span>Save Notifications</span>
            </button>
          </div>
        </div>
        {/* Security */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">Security</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Multi-Factor Authentication</span>
              <input
                type="checkbox"
                checked={security.mfa}
                onChange={e => setSecurity({ ...security, mfa: e.target.checked })}
                className="form-checkbox h-4 w-4 text-primary-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Password Last Changed</span>
              <span className="text-gray-500 text-sm">{security.passwordChanged}</span>
            </div>
            <button className="mt-2 flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Save className="h-4 w-4" />
              <span>Save Security</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
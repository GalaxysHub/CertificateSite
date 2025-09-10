"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Keyboard,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Globe,
  Mail,
  Smartphone,
  Lock,
  Eye,
  Database,
  Clock,
  Save
} from "lucide-react";

export function DashboardSettingsView() {
  const [settings, setSettings] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC",
    emailNotifications: {
      testResults: true,
      certificates: true,
      reminders: true,
      marketing: false,
      security: true
    },
    privacy: {
      profileVisible: true,
      certificatesPublic: true,
      showProgress: false,
      allowComments: true
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      keyboardNavigation: true
    },
    data: {
      autoBackup: true,
      retentionPeriod: "2years",
      exportFormat: "json"
    }
  });

  const [keyboardShortcuts, setKeyboardShortcuts] = useState({
    quickSearch: "Ctrl+K",
    dashboard: "Ctrl+D",
    newTest: "Ctrl+N",
    certificates: "Ctrl+C",
    help: "?"
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Save settings to backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const exportData = () => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-settings.json';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Customize your dashboard experience
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Appearance</span>
          </CardTitle>
          <CardDescription>Customize how your dashboard looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Theme</h4>
            <div className="flex space-x-4">
              {[
                { value: "light", icon: Sun, label: "Light" },
                { value: "dark", icon: Moon, label: "Dark" },
                { value: "system", icon: Monitor, label: "System" }
              ].map(theme => (
                <button
                  key={theme.value}
                  onClick={() => setSettings(prev => ({ ...prev, theme: theme.value }))}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                    settings.theme === theme.value 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <theme.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="pt">Português</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>Choose what notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Email Notifications</h4>
              {Object.entries(settings.emailNotifications).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleSettingChange('emailNotifications', key, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getNotificationDescription(key)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Push Notifications</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm font-medium">Browser Notifications</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Get real-time notifications in your browser
                </p>
                <Button size="sm" variant="outline">
                  Enable Push Notifications
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy & Security</span>
          </CardTitle>
          <CardDescription>Control your privacy settings and security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Privacy Settings</h4>
              {Object.entries(settings.privacy).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getPrivacyDescription(key)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Security</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Enable 2FA
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Active Sessions</p>
                      <p className="text-xs text-muted-foreground">Manage your active sessions</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Sessions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Accessibility</span>
          </CardTitle>
          <CardDescription>Make the dashboard more accessible to you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings.accessibility).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleSettingChange('accessibility', key, e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <p className="text-sm font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getAccessibilityDescription(key)}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Keyboard className="h-5 w-5" />
            <span>Keyboard Shortcuts</span>
          </CardTitle>
          <CardDescription>Customize your keyboard shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(keyboardShortcuts).map(([action, shortcut]) => (
              <div key={action} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">
                    {action.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getShortcutDescription(action)}
                  </p>
                </div>
                <Badge variant="outline" className="font-mono">
                  {shortcut}
                </Badge>
              </div>
            ))}
          </div>
          <Button size="sm" variant="outline">
            <Keyboard className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>Control how your data is stored and managed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Backup Settings</h4>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.data.autoBackup}
                  onChange={(e) => handleSettingChange('data', 'autoBackup', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <p className="text-sm font-medium">Auto Backup</p>
                  <p className="text-xs text-muted-foreground">Automatically backup your data</p>
                </div>
              </label>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Data Retention Period</label>
                <select
                  value={settings.data.retentionPeriod}
                  onChange={(e) => handleSettingChange('data', 'retentionPeriod', e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="1year">1 Year</option>
                  <option value="2years">2 Years</option>
                  <option value="5years">5 Years</option>
                  <option value="forever">Forever</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Data Export</h4>
              <div>
                <label className="text-sm font-medium mb-2 block">Export Format</label>
                <select
                  value={settings.data.exportFormat}
                  onChange={(e) => handleSettingChange('data', 'exportFormat', e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF Report</option>
                  <option value="xlsx">Excel</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-red-800">Delete All Data</h4>
                <p className="text-sm text-red-700">Permanently delete all your dashboard data</p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getNotificationDescription(key: string): string {
  const descriptions: { [key: string]: string } = {
    testResults: "Get notified when test results are ready",
    certificates: "Receive alerts when certificates are issued",
    reminders: "Get reminded about pending tests and deadlines",
    marketing: "Receive updates about new features and promotions",
    security: "Important security alerts and login notifications"
  };
  return descriptions[key] || "";
}

function getPrivacyDescription(key: string): string {
  const descriptions: { [key: string]: string } = {
    profileVisible: "Allow others to see your public profile",
    certificatesPublic: "Make your certificates visible to others",
    showProgress: "Display your learning progress publicly",
    allowComments: "Allow others to comment on your achievements"
  };
  return descriptions[key] || "";
}

function getAccessibilityDescription(key: string): string {
  const descriptions: { [key: string]: string } = {
    highContrast: "Increase contrast for better visibility",
    reducedMotion: "Reduce animations and transitions",
    largeText: "Use larger text sizes",
    keyboardNavigation: "Enable keyboard-only navigation"
  };
  return descriptions[key] || "";
}

function getShortcutDescription(action: string): string {
  const descriptions: { [key: string]: string } = {
    quickSearch: "Open quick search dialog",
    dashboard: "Go to dashboard home",
    newTest: "Start a new test",
    certificates: "View certificates page",
    help: "Show help information"
  };
  return descriptions[action] || "";
}
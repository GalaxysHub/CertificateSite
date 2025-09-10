"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Settings,
  Bell,
  Globe,
  Lock
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
}

export function DashboardProfileView() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    language: "en",
    timezone: "UTC",
    theme: "light"
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      setProfile(data.user);
      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setUpdateLoading(true);
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email
      };

      // Only include password fields if new password is provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          alert("New passwords don't match");
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.user);
      setEditMode(false);
      
      // Update session if name changed
      if (updateData.name !== session?.user?.name) {
        await update({ name: updateData.name });
      }

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      alert("Profile updated successfully!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      alert("Please type DELETE to confirm");
      return;
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete account');
      
      // Redirect to home page or sign out
      window.location.href = '/';
    } catch (error: any) {
      alert(error.message);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'instructor': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Profile not found</h3>
        <p className="text-muted-foreground">Unable to load your profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        {!editMode && (
          <Button onClick={() => setEditMode(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
          <CardDescription>Your basic account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xl">
              {profile.name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{profile.name || "No name set"}</h3>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getRoleColor(profile.role)}>
                  {profile.role.toLowerCase()}
                </Badge>
                {profile.emailVerified ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">Unverified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Change Section */}
              <div className="pt-4 border-t space-y-4">
                <h4 className="font-medium">Change Password (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="text-sm font-medium mb-2 block">Current Password</label>
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full p-2 pr-10 border border-input rounded-md bg-background"
                      placeholder="Current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-8 h-8 w-8 p-0"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="relative">
                    <label className="text-sm font-medium mb-2 block">New Password</label>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full p-2 pr-10 border border-input rounded-md bg-background"
                      placeholder="New password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-8 h-8 w-8 p-0"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="relative">
                    <label className="text-sm font-medium mb-2 block">Confirm Password</label>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full p-2 pr-10 border border-input rounded-md bg-background"
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-8 h-8 w-8 p-0"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave} disabled={updateLoading}>
                  {updateLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{profile.role.toLowerCase()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(profile.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Preferences</span>
          </CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Get notified about test results and certificates</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={preferences.marketingEmails}
                    onChange={(e) => setPreferences(prev => ({ ...prev, marketingEmails: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium">Marketing Emails</p>
                    <p className="text-xs text-muted-foreground">Receive updates about new features and tests</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Localization</span>
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full p-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="CST">Central Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription className="text-red-700">
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-800">Delete Account</h4>
              <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-800">Confirm Account Deletion</CardTitle>
              <CardDescription>
                This action cannot be undone. This will permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Type <code className="bg-gray-100 px-1 rounded">DELETE</code> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== "DELETE"}
                >
                  Delete My Account
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  needsPasswordReset: boolean;
};

export default function AccountSettingsPage() {
  const { user, loading } = useAuthContext();
  const [activeSection, setActiveSection] = useState<"email" | "password">("email");
  
  // Profile data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Email form
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      loadUserProfile();
    }
  }, [user, loading]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      setProfileLoading(true);
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setProfile(result.profile);
        
        // Auto-switch to password section if user needs to reset password
        if (result.profile.needsPasswordReset && activeSection !== "password") {
          setActiveSection("password");
        }
      } else {
        console.error('Failed to load profile:', result.error);
      }
    } catch (error) {
      console.error('Profile loading error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newEmail) return;

    try {
      setEmailLoading(true);
      setEmailError(null);
      setEmailSuccess(null);

      // Update email using Firebase client SDK
      await updateEmail(user, newEmail);
      
      // Also update in our database
      const idToken = await user.getIdToken();
      const response = await fetch('/api/user/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken, newEmail }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailSuccess('Email updated successfully! Please check your new email for verification.');
        setNewEmail("");
        loadUserProfile(); // Refresh profile data
      } else {
        setEmailError(result.error || 'Failed to update email');
      }
    } catch (error: any) {
      console.error('Email update error:', error);
      if (error.code === 'auth/requires-recent-login') {
        setEmailError('Please log out and log back in before changing your email address.');
      } else if (error.code === 'auth/email-already-in-use') {
        setEmailError('This email address is already in use by another account.');
      } else if (error.code === 'auth/invalid-email') {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('Failed to update email. Please try again.');
      }
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentPassword || !newPassword) return;

    try {
      setPasswordLoading(true);
      setPasswordError(null);
      setPasswordSuccess(null);

      // Validate password match
      if (newPassword !== confirmPassword) {
        setPasswordError('New passwords do not match.');
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long.');
        return;
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password using Firebase client SDK
      await updatePassword(user, newPassword);
      
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Reload profile to update needsPasswordReset flag
      loadUserProfile();
      
    } catch (error: any) {
      console.error('Password update error:', error);
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect.');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('New password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/requires-recent-login') {
        setPasswordError('Please log out and log back in before changing your password.');
      } else {
        setPasswordError('Failed to update password. Please try again.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/Loading Screen2.png')" }}
        />
        <div className="fixed inset-0 bg-[#8d4e1b]/30" />
        <div className="relative z-10 h-screen overflow-y-auto py-24 px-4 sm:px-8 md:px-20">
          <section className="mx-auto max-w-4xl bg-[#E5E5E5] text-[#1B1B1B] rounded-xl p-10">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1B1B] mx-auto mb-4"></div>
              <p className="text-xl">Loading account settings...</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/Loading Screen2.png')" }}
        />
        <div className="fixed inset-0 bg-[#8d4e1b]/30" />
        <div className="relative z-10 h-screen overflow-y-auto py-24 px-4 sm:px-8 md:px-20">
          <section className="mx-auto max-w-4xl bg-[#E5E5E5] text-[#1B1B1B] rounded-xl p-10">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
              <p className="text-lg">You need to be logged in to access account settings.</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Loading Screen2.png')" }}
      />
      <div className="fixed inset-0 bg-[#8d4e1b]/30" />

      {/* Scrollable container */}
      <div className="relative z-10 h-screen overflow-y-auto py-24 px-4 sm:px-8 md:px-20">
        <section className="mx-auto max-w-4xl bg-[#E5E5E5] text-[#1B1B1B] rounded-xl p-10 flex flex-col gap-8">
          {/* Header and toggle */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center select-none">
            <h1 className="text-3xl sm:text-4xl font-bold">Account Settings</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveSection("email")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                  activeSection === "email"
                    ? "bg-[#fa9130] text-[#1B1B1B]"
                    : "bg-[#fa9130]/80 text-white hover:bg-[#ad6421]"
                }`}
              >
                Change Email
              </button>
              <button
                onClick={() => setActiveSection("password")}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                  activeSection === "password"
                    ? "bg-[#fa9130] text-[#1B1B1B]"
                    : "bg-[#fa9130]/80 text-white hover:bg-[#ad6421]"
                } ${profile?.needsPasswordReset ? 'ring-2 ring-red-500 bg-red-500 text-white animate-pulse' : ''}`}
              >
                Change Password {profile?.needsPasswordReset && '🔒'}
              </button>
            </div>
          </div>

          {/* Email section */}
          {activeSection === "email" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold select-none">
                Current Email Address:{" "}
                <span className="text-[#fa9130] select-text">
                  {profileLoading ? "Loading..." : profile?.email || "Not available"}
                </span>
              </h2>
              
              {profile?.needsPasswordReset && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded select-none">
                  <p>🔒 You need to change your password. Please update your password below for security.</p>
                </div>
              )}

              <h2 className="text-2xl font-semibold select-none">Change Email</h2>
              
              {emailError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded select-none">
                  <p>{emailError}</p>
                </div>
              )}
              
              {emailSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded select-none">
                  <p>{emailSuccess}</p>
                </div>
              )}

              <form onSubmit={handleEmailUpdate} className="flex flex-col gap-4 select-none">
                <input
                  type="email"
                  placeholder="New Email Address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="px-4 py-3 rounded-lg border-2 border-[#1B1B1B] focus:border-[#fa9130] outline-none text-lg"
                  required
                  disabled={emailLoading}
                />
                <button 
                  type="submit"
                  disabled={emailLoading || !newEmail}
                  className="px-5 py-3 bg-[#fa9130] text-[#1B1B1B] rounded-lg font-semibold transition-all hover:bg-[#ad6421] hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {emailLoading ? "Updating..." : "Save Email"}
                </button>
              </form>
            </div>
          )}

          {/* Password section */}
          {activeSection === "password" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold select-none">Change Password</h2>
              
              {passwordError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded select-none">
                  <p>{passwordError}</p>
                </div>
              )}
              
              {passwordSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded select-none">
                  <p>{passwordSuccess}</p>
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-4 select-none">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="px-4 py-3 rounded-lg border-2 border-[#1B1B1B] focus:border-[#fa9130] outline-none text-lg"
                  required
                  disabled={passwordLoading}
                />
                <input
                  type="password"
                  placeholder="New Password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="px-4 py-3 rounded-lg border-2 border-[#1B1B1B] focus:border-[#fa9130] outline-none text-lg"
                  required
                  minLength={6}
                  disabled={passwordLoading}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="px-4 py-3 rounded-lg border-2 border-[#1B1B1B] focus:border-[#fa9130] outline-none text-lg"
                  required
                  disabled={passwordLoading}
                />
                <button 
                  type="submit"
                  disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="px-5 py-3 bg-[#fa9130] text-[#1B1B1B] rounded-lg font-semibold transition-all hover:bg-[#ad6421] hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

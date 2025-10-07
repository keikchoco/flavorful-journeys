"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserActions, User } from "./hooks/useUserActions";
import {
  ResetPasswordModal,
  DisableUserModal,
  EnableUserModal,
  DeleteUserModal,
  AddUserModal,
  PasswordDisplayModal
} from "./components";

export default function AdminUsersPage() {
  const { user, isAdmin, adminLoading, loading } = useAuthContext();
  const router = useRouter();
  const { resetUserPassword, disableUser, enableUser, deleteUser, createUser } = useUserActions();
  
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !adminLoading && user && !isAdmin) {
      router.replace('/user/dashboard');
    }
  }, [user, isAdmin, adminLoading, loading, router]);

  // Load users when admin is verified
  useEffect(() => {
    if (!loading && !adminLoading && user && isAdmin) {
      loadUsers();
    }
  }, [loading, adminLoading, user, isAdmin]);
  
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      if (!user) {
        throw new Error('No user found');
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUsers(data.users || []);
      } else {
        console.error('API Error:', data.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
    setUsersLoading(false);
  };

  // selected user for actions
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // modal state
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filter === "all") return true;
      if (filter === "enabled") return u.enabled;
      return !u.enabled;
    });
  }, [users, filter]);

  // Action handlers
  const handleOpenResetPassword = (u: User) => {
    setSelectedUser(u);
    setShowResetPasswordModal(true);
  };
  
  const confirmResetPassword = async () => {
    if (!selectedUser) return;
    
    const result = await resetUserPassword(selectedUser);
    if (result.success && result.password) {
      setGeneratedPassword(result.password);
      setIsNewUser(false);
      setShowPasswordModal(true);
    } else {
      alert(`Error: ${result.error}`);
    }
    
    setShowResetPasswordModal(false);
    // Don't clear selectedUser here - it's needed for the password modal
  };

  const handleOpenDisable = (u: User) => {
    setSelectedUser(u);
    setShowDisableModal(true);
  };
  
  const confirmDisable = async () => {
    if (!selectedUser) return;
    
    const result = await disableUser(selectedUser);
    if (result.success) {
      setUsers((prev) => prev.map((p) => (p.id === selectedUser.id ? { ...p, enabled: false } : p)));
    } else {
      alert(`Error: ${result.error}`);
    }
    
    setShowDisableModal(false);
    setSelectedUser(null);
  };

  const handleOpenEnable = (u: User) => {
    setSelectedUser(u);
    setShowEnableModal(true);
  };
  
  const confirmEnable = async () => {
    if (!selectedUser) return;
    
    const result = await enableUser(selectedUser);
    if (result.success) {
      setUsers((prev) => prev.map((p) => (p.id === selectedUser.id ? { ...p, enabled: true } : p)));
    } else {
      alert(`Error: ${result.error}`);
    }
    
    setShowEnableModal(false);
    setSelectedUser(null);
  };

  const handleOpenDeleteUser = (u: User) => {
    setSelectedUser(u);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    const result = await deleteUser(selectedUser);
    if (result.success) {
      setUsers((prev) => prev.filter((p) => p.id !== selectedUser.id));
    } else {
      alert(`Error: ${result.error}`);
    }

    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleOpenAddUser = () => {
    setShowAddUserModal(true);
  };
  
  const confirmAddUser = async (name: string, email: string) => {
    const result = await createUser(name, email);
    if (result.success && result.userId && result.password) {
      const newUser = {
        id: result.userId,
        name: name.trim(),
        email: email.trim(),
        enabled: true
      };
      setUsers((prev) => [newUser, ...prev]);
      setSelectedUser(newUser);
      setGeneratedPassword(result.password);
      setIsNewUser(true);
      setShowPasswordModal(true);
      setShowAddUserModal(false);
    } else {
      alert(`Error: ${result.error}`);
    }
  };



  // Show loading while checking auth and admin status
  if (loading || adminLoading) {
    return (
      <div className="relative z-10 p-6 md:p-10">
        <div className="bg-[#E5E5E5] rounded-xl p-6 md:p-10 shadow">
          <div className="text-center text-[#1b1b1b]">
            <h1 className="text-2xl mb-4">Loading...</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b1b1b] mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="relative z-10 p-6 md:p-10">
        <div className="bg-[#E5E5E5] rounded-xl p-6 md:p-10 shadow">
          <div className="text-center text-[#1b1b1b]">
            <h1 className="text-2xl mb-4">Access Denied</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 p-6 md:p-10">
      <div className="bg-[#E5E5E5] rounded-xl p-6 md:p-10 shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() =>
                  setFilter((prev) => {
                    // cycle through options for simple UX if needed
                    if (prev === "all") return "enabled";
                    if (prev === "enabled") return "disabled";
                    return "all";
                  })
                }
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm md:text-base"
                aria-haspopup="listbox"
                aria-expanded={false}
              >
                Filter: <span className="font-semibold">{filter}</span>
              </button>
              {/* Optional: expanded dropdown could be implemented — simplified here */}
            </div>

            <button
              onClick={loadUsers}
              disabled={usersLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm md:text-base font-semibold"
            >
              {usersLoading ? 'Loading...' : 'Refresh'}
            </button>

            <button
              onClick={handleOpenAddUser}
              className="px-4 py-2 bg-[#fa9130] hover:bg-[#ad6421] text-[#1B1B1B] rounded-md text-sm md:text-base font-semibold"
            >
              Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-md overflow-hidden">
            <thead className="bg-[#77dd76] text-[#1B1B1B]">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">UserId</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u.id} className={idx % 2 === 0 ? "bg-[#f9f9f9]" : "bg-[#e8f7e9]"}>
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.id}</td>
                    <td className="px-4 py-3">
                      {u.enabled ? (
                        <span className="px-2 py-1 text-sm bg-green-200 text-green-800 rounded">Enabled</span>
                      ) : (
                        <span className="px-2 py-1 text-sm bg-red-200 text-red-800 rounded">Disabled</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleOpenResetPassword(u)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                        >
                          Reset PW
                        </button>

                        {u.enabled ? (
                          <button
                            onClick={() => handleOpenDisable(u)}
                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                          >
                            Disable
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenEnable(u)}
                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                          >
                            Enable
                          </button>
                        )}



                        <button
                          onClick={() => handleOpenDeleteUser(u)}
                          className="text-white bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ResetPasswordModal
        isOpen={showResetPasswordModal}
        user={selectedUser}
        onClose={() => {
          setShowResetPasswordModal(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmResetPassword}
      />

      <DisableUserModal
        isOpen={showDisableModal}
        user={selectedUser}
        onClose={() => {
          setShowDisableModal(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDisable}
      />

      <EnableUserModal
        isOpen={showEnableModal}
        user={selectedUser}
        onClose={() => {
          setShowEnableModal(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmEnable}
      />

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onConfirm={confirmAddUser}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        user={selectedUser}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDeleteUser}
      />

      <PasswordDisplayModal
        isOpen={showPasswordModal}
        user={selectedUser}
        password={generatedPassword}
        isNewUser={isNewUser}
        onClose={() => {
          setShowPasswordModal(false);
          setSelectedUser(null);
        }}
      />


    </div>
  );
}

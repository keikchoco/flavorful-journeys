"use client";
import { useEffect, useMemo, useState } from "react";
import { index } from "@/services/users";
/** Mock user type */
type User = {
  id: string;
  name: string;
  email: string;
  enabled: boolean;
};

export default function AdminUsersPage() {
  // mock data (replace with real fetch later)
  const [users, setUsers] = useState<User[]>([
    { id: "u1", name: "Alice", email: "alice@example.com", enabled: true },
    { id: "u2", name: "Bob", email: "bob@example.com", enabled: false },
    { id: "u3", name: "Carol", email: "carol@example.com", enabled: true },
  ]);

  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");

  useEffect(() => {
    loadUsers();
  
  }, [])
  
  const loadUsers = async () => {
    const users = await index(); // fetch from service
    console.log("Fetched users:", users);
  }
  // selected user for actions
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);

  // add-user form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // reauth mock
  const [adminPassword, setAdminPassword] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (filter === "all") return true;
      if (filter === "enabled") return u.enabled;
      return !u.enabled;
    });
  }, [users, filter]);

  // Actions (all mock — replace with real APIs)
  const handleOpenResetPassword = (u: User) => {
    setSelectedUser(u);
    setShowResetPasswordModal(true);
  };
  const confirmResetPassword = () => {
    // mock: show console and close
    console.log("Reset password for", selectedUser?.email);
    setShowResetPasswordModal(false);
    setSelectedUser(null);
  };

  const handleOpenDisable = (u: User) => {
    setSelectedUser(u);
    setShowDisableModal(true);
  };
  const confirmDisable = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.map((p) => (p.id === selectedUser.id ? { ...p, enabled: false } : p)));
    setShowDisableModal(false);
    setSelectedUser(null);
  };

  const handleOpenEnable = (u: User) => {
    setSelectedUser(u);
    setShowEnableModal(true);
  };
  const confirmEnable = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.map((p) => (p.id === selectedUser.id ? { ...p, enabled: true } : p)));
    setShowEnableModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (u: User) => {
    if (!confirm(`Delete user ${u.name} (${u.email})? This cannot be undone.`)) return;
    setUsers((prev) => prev.filter((p) => p.id !== u.id));
  };

  const handleOpenAddUser = () => {
    setNewEmail("");
    setNewName("");
    setShowAddUserModal(true);
  };
  const confirmAddUser = () => {
    if (!newName.trim() || !newEmail.trim()) return alert("Name and email required");
    const id = `u${Math.random().toString(36).slice(2, 9)}`;
    setUsers((prev) => [{ id, name: newName.trim(), email: newEmail.trim(), enabled: true }, ...prev]);
    setShowAddUserModal(false);
  };

  const openReauthenticate = () => {
    setShowReauthModal(true);
  };
  const confirmReauthenticate = () => {
    // mock: accept any password and continue
    console.log("Reauthenticated with", adminPassword);
    setShowReauthModal(false);
    setAdminPassword("");
  };

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
              {filteredUsers.length === 0 ? (
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
                          onClick={() => {
                            setSelectedUser(u);
                            // For editing placeholder — open reauth modal then proceed
                            openReauthenticate();
                          }}
                          className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u)}
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

      {/* --- Modals --- */}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <Modal onClose={() => setShowResetPasswordModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Reset User Password</h3>
          <p className="mb-6">The password for <strong>{selectedUser.email}</strong> will be reset to the default.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setShowResetPasswordModal(false); setSelectedUser(null); }} className="px-4 py-2 rounded border">Cancel</button>
            <button onClick={confirmResetPassword} className="px-4 py-2 rounded bg-[#77dd76] text-[#1B1B1B] font-semibold">Reset Password</button>
          </div>
        </Modal>
      )}

      {/* Disable User Modal */}
      {showDisableModal && selectedUser && (
        <Modal onClose={() => setShowDisableModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Disable This User</h3>
          <p className="mb-6">This user (<strong>{selectedUser.email}</strong>) will not be able to log in.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setShowDisableModal(false); setSelectedUser(null); }} className="px-4 py-2 rounded border">Cancel</button>
            <button onClick={confirmDisable} className="px-4 py-2 rounded bg-red-600 text-white font-semibold">Disable User</button>
          </div>
        </Modal>
      )}

      {/* Enable User Modal */}
      {showEnableModal && selectedUser && (
        <Modal onClose={() => setShowEnableModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Enable This User</h3>
          <p className="mb-6">This user (<strong>{selectedUser.email}</strong>) will now be able to log in.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setShowEnableModal(false); setSelectedUser(null); }} className="px-4 py-2 rounded border">Cancel</button>
            <button onClick={confirmEnable} className="px-4 py-2 rounded bg-green-600 text-white font-semibold">Enable User</button>
          </div>
        </Modal>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <Modal onClose={() => setShowAddUserModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Add New User</h3>
          <div className="flex flex-col gap-3 mb-4">
            <input className="px-3 py-2 rounded border" placeholder="Username" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <input className="px-3 py-2 rounded border" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAddUserModal(false)} className="px-4 py-2 rounded border">Cancel</button>
            <button onClick={confirmAddUser} className="px-4 py-2 rounded bg-[#77dd76] text-[#1B1B1B] font-semibold">Add User</button>
          </div>
        </Modal>
      )}

      {/* Reauthenticate Modal */}
      {showReauthModal && (
        <Modal onClose={() => setShowReauthModal(false)}>
          <h3 className="text-xl font-semibold mb-4">Re-authenticate</h3>
          <p className="mb-4">Enter your password to continue:</p>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="px-3 py-2 rounded border mb-4"
            placeholder="Admin Password"
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowReauthModal(false)} className="px-4 py-2 rounded border">Cancel</button>
            <button onClick={confirmReauthenticate} className="px-4 py-2 rounded bg-[#77dd76] text-[#1B1B1B] font-semibold">Confirm</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/** Simple generic modal wrapper */
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#1b1b1b] text-[#E5E5E5] rounded-lg max-w-xl w-full p-6">
        <div>{children}</div>
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#E5E5E5] opacity-80 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

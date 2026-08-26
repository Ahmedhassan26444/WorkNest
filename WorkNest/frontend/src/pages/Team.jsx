import { useEffect, useState } from "react";

import {
  getMembers,
  addMember,
  deleteMember,
} from "../services/organizationApi";

// ================= MEMBER CARD =================

const MemberCard = ({
  member,
  currentUser,
  onDelete,
  deletingId,
}) => {
  const canDelete =
    (currentUser?.role === "owner" && member.role !== "owner") ||
    (currentUser?.role === "manager" && member.role === "employee");

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name} from the organization?`
    );

    if (confirmed) {
      onDelete(member._id);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
      {/* Member Info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-lg">
          {member.name?.charAt(0).toUpperCase()}
        </div>

        {/* Member Details */}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold truncate">
            {member.name}
          </h3>

          <p className="text-sm text-slate-500 truncate">
            {member.email}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-5 pt-5 border-t border-slate-800 flex items-center justify-between gap-3">
        {/* Role */}
        <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs capitalize">
          {member.role}
        </span>

        {/* Delete Button */}
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deletingId === member._id}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deletingId === member._id
              ? "Removing..."
              : "Remove"}
          </button>
        )}
      </div>
    </div>
  );
};

// ================= SECTION =================

const Section = ({
  title,
  membersList,
  currentUser,
  onDelete,
  deletingId,
}) => {
  if (membersList.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <span className="text-sm text-slate-500">
          {membersList.length}{" "}
          {membersList.length === 1
            ? "member"
            : "members"}
        </span>
      </div>

      {/* Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {membersList.map((member) => (
          <MemberCard
            key={member._id}
            member={member}
            currentUser={currentUser}
            onDelete={onDelete}
            deletingId={deletingId}
          />
        ))}
      </div>
    </section>
  );
};

// ================= TEAM =================

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Member States
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete Member State
  const [deletingId, setDeletingId] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  // ================= CURRENT USER =================

  const storedUser = localStorage.getItem("user");

  const currentUser = (() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })();

  const currentUserRole = currentUser?.role || "";

  const canAddMember =
    currentUserRole === "owner" ||
    currentUserRole === "manager";

  // ================= LOAD MEMBERS =================

  useEffect(() => {
    let cancelled = false;

    const fetchMembers = async () => {
      try {
        const data = await getMembers();

        if (cancelled) return;

        setMembers(data.members || []);
        setError("");
      } catch (error) {
        if (cancelled) return;

        setError(
          error.message || "Failed to load team members"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, []);

  // ================= FORM CHANGE =================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================= ADD MEMBER =================

  const handleAddMember = async (event) => {
    event.preventDefault();

    try {
      setAdding(true);
      setFormError("");

      await addMember(formData);

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "employee",
      });

      // Close form
      setShowAddForm(false);

      // Fetch updated members
      const data = await getMembers();

      setMembers(data.members || []);
      setError("");
    } catch (error) {
      setFormError(
        error.message || "Failed to add member"
      );
    } finally {
      setAdding(false);
    }
  };

  // ================= DELETE MEMBER =================

  const handleDeleteMember = async (memberId) => {
    try {
      setDeletingId(memberId);
      setError("");

      await deleteMember(memberId);

      // Remove member immediately from UI
      setMembers((previousMembers) =>
        previousMembers.filter(
          (member) => member._id !== memberId
        )
      );
    } catch (error) {
      setError(
        error.message || "Failed to remove team member"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= FILTER MEMBERS =================

  const owners = members.filter(
    (member) => member.role === "owner"
  );

  const managers = members.filter(
    (member) => member.role === "manager"
  );

  const employees = members.filter(
    (member) => member.role === "employee"
  );

  // ================= UI =================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= HEADER ================= */}

      <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-5 md:px-8">

        <div>
          <h1 className="text-xl font-semibold">
            Team
          </h1>

          <p className="text-sm text-slate-500">
            Manage your organization team
          </p>
        </div>

        {/* ADD MEMBER BUTTON */}

        {canAddMember && (
          <button
            onClick={() => {
              setShowAddForm((previous) => !previous);
              setFormError("");
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition shadow-lg shadow-blue-600/20"
          >
            {showAddForm
              ? "Cancel"
              : "+ Add Member"}
          </button>
        )}
      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-7xl mx-auto p-5 md:p-8">

        {/* ================= PAGE HEADING ================= */}

        <div className="mb-10">

          <p className="text-sm text-blue-400 font-medium mb-2">
            Workspace
          </p>

          <h1 className="text-3xl font-bold">
            Team Members
          </h1>

          <p className="text-slate-400 mt-2">
            View and manage everyone in your organization.
          </p>

        </div>

        {/* ================= ADD MEMBER FORM ================= */}

        {showAddForm && canAddMember && (
          <div className="mb-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <div className="mb-6">

              <h2 className="text-xl font-semibold">
                Add Team Member
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Create a new member for your organization.
              </p>

            </div>

            {/* FORM ERROR */}

            {formError && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                {formError}
              </div>
            )}

            <form
              onSubmit={handleAddMember}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter member name"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500 transition"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="member@example.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500 transition"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Temporary Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter temporary password"
                  required
                  minLength={6}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500 transition"
                />

                <p className="text-xs text-slate-600 mt-2">
                  Minimum 6 characters.
                </p>

              </div>

              {/* ROLE */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition"
                >

                  <option value="employee">
                    Employee
                  </option>

                  <option value="manager">
                    Manager
                  </option>

                </select>

                <p className="text-xs text-slate-600 mt-2">
                  Owner accounts cannot be created here.
                </p>

              </div>

              {/* BUTTONS */}

              <div className="md:col-span-2 flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormError("");
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={adding}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                >
                  {adding
                    ? "Adding Member..."
                    : "Add Member"}
                </button>

              </div>

            </form>
          </div>
        )}

        {/* ================= TOTAL MEMBERS ================= */}

        <div className="mb-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <p className="text-sm text-slate-500">
            Total Members
          </p>

          <p className="text-3xl font-bold mt-2">
            {members.length}
          </p>

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <p className="text-slate-400">
              Loading team members...
            </p>

          </div>
        ) : members.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <p className="text-slate-400">
              No team members found.
            </p>

          </div>
        ) : (
          <>
            {/* ================= OWNER ================= */}

            <Section
              title="Owner"
              membersList={owners}
              currentUser={currentUser}
              onDelete={handleDeleteMember}
              deletingId={deletingId}
            />

            {/* ================= MANAGERS ================= */}

            <Section
              title="Managers"
              membersList={managers}
              currentUser={currentUser}
              onDelete={handleDeleteMember}
              deletingId={deletingId}
            />

            {/* ================= EMPLOYEES ================= */}

            <Section
              title="Employees"
              membersList={employees}
              currentUser={currentUser}
              onDelete={handleDeleteMember}
              deletingId={deletingId}
            />
          </>
        )}

      </main>
    </div>
  );
};

export default Team;
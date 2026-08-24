import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectApi";

const Projects = () => {
  const navigate = useNavigate();

  // ================= USER ROLE =================

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  const canManageProjects =
    userRole === "owner" || userRole === "manager";

  // ================= STATES =================

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("planning");

  // Edit form
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("planning");

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Loading states
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ================= LOAD PROJECTS =================

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const data = await getProjects();

        if (isMounted) {
          setProjects(data.projects || []);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message || "Failed to load projects");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  // ================= CREATE PROJECT =================

  const handleCreateProject = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!canManageProjects) {
      setError(
        "Access denied. You do not have permission to create projects."
      );
      return;
    }

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setCreating(true);

      const data = await createProject({
        name: name.trim(),
        description: description.trim(),
        status,
      });

      setProjects((prevProjects) => [
        data.project,
        ...prevProjects,
      ]);

      setSuccess(
        data.message || "Project created successfully."
      );

      // Clear form
      setName("");
      setDescription("");
      setStatus("planning");
      setShowCreateForm(false);
    } catch (error) {
      setError(
        error.message || "Failed to create project"
      );
    } finally {
      setCreating(false);
    }
  };

  // ================= START EDIT =================

  const handleEditProject = (project) => {
    if (!canManageProjects) {
      setError(
        "Access denied. You do not have permission to edit projects."
      );
      return;
    }

    setError("");
    setSuccess("");

    setEditingProject(project);
    setEditName(project.name || "");
    setEditDescription(project.description || "");
    setEditStatus(project.status || "planning");
  };

  // ================= UPDATE PROJECT =================

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!canManageProjects) {
      setError(
        "Access denied. You do not have permission to update projects."
      );
      return;
    }

    if (!editName.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!editingProject) {
      return;
    }

    try {
      setUpdating(true);

      const data = await updateProject(
        editingProject._id,
        {
          name: editName.trim(),
          description: editDescription.trim(),
          status: editStatus,
        }
      );

      // Update project in UI
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === editingProject._id
            ? data.project
            : project
        )
      );

      setSuccess(
        data.message || "Project updated successfully."
      );

      // Close edit form
      setEditingProject(null);
      setEditName("");
      setEditDescription("");
      setEditStatus("planning");
    } catch (error) {
      setError(
        error.message || "Failed to update project"
      );
    } finally {
      setUpdating(false);
    }
  };

  // ================= CANCEL EDIT =================

  const handleCancelEdit = () => {
    setEditingProject(null);
    setEditName("");
    setEditDescription("");
    setEditStatus("planning");
    setError("");
  };

  // ================= DELETE PROJECT =================

  const handleDeleteProject = async (id) => {
    if (!canManageProjects) {
      setError(
        "Access denied. You do not have permission to delete projects."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setDeletingId(id);

      const data = await deleteProject(id);

      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) => project._id !== id
        )
      );

      setSuccess(
        data.message || "Project deleted successfully."
      );
    } catch (error) {
      setError(
        error.message || "Failed to delete project"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================= STATUS STYLE =================

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "on-hold":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= HEADER ================= */}

      <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-5 md:px-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            ←
          </button>

          <div>
            <h1 className="text-xl font-semibold">
              Projects
            </h1>

            <p className="text-sm text-slate-500">
              Manage your organization projects
            </p>
          </div>

        </div>

        {/* ONLY OWNER AND MANAGER */}

        {canManageProjects && (
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingProject(null);
              setError("");
              setSuccess("");
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            + New Project
          </button>
        )}

      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-7xl mx-auto p-5 md:p-8">

        {/* PAGE HEADING */}

        <div className="mb-8">

          <p className="text-sm text-blue-400 font-medium mb-2">
            Workspace
          </p>

          <h1 className="text-3xl font-bold">
            Projects
          </h1>

          <p className="text-slate-400 mt-2">
            {canManageProjects
              ? "Create and manage projects for your organization."
              : "View projects in your organization."}
          </p>

        </div>

        {/* ================= MESSAGES ================= */}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
            {success}
          </div>
        )}

        {/* ================= CREATE FORM ================= */}

        {showCreateForm && canManageProjects && (
          <section className="mb-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-slate-800">

              <h2 className="text-lg font-semibold">
                Create New Project
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Add a new project to your organization.
              </p>

            </div>

            <form
              onSubmit={handleCreateProject}
              className="p-6 space-y-5"
            >

              {/* Project Name */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Project Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:border-blue-500"
                />

              </div>

              {/* Description */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Enter project description"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:border-blue-500 resize-none"
                />

              </div>

              {/* Status */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                >

                  <option value="planning">
                    Planning
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="on-hold">
                    On Hold
                  </option>

                </select>

              </div>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition"
                >
                  {creating
                    ? "Creating..."
                    : "Create Project"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setName("");
                    setDescription("");
                    setStatus("planning");
                    setError("");
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ================= EDIT FORM ================= */}

        {editingProject && canManageProjects && (
          <section className="mb-8 bg-slate-900 border border-blue-500/20 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-slate-800">

              <h2 className="text-lg font-semibold">
                Edit Project
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Update your project information.
              </p>

            </div>

            <form
              onSubmit={handleUpdateProject}
              className="p-6 space-y-5"
            >

              {/* Project Name */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Project Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:border-blue-500"
                />

              </div>

              {/* Description */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Description
                </label>

                <textarea
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(e.target.value)
                  }
                  placeholder="Enter project description"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:border-blue-500 resize-none"
                />

              </div>

              {/* Status */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Status
                </label>

                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                >

                  <option value="planning">
                    Planning
                  </option>

                  <option value="active">
                    Active
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="on-hold">
                    On Hold
                  </option>

                </select>

              </div>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition"
                >
                  {updating
                    ? "Updating..."
                    : "Update Project"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ================= PROJECTS ================= */}

        {loading ? (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <p className="text-slate-400">
              Loading projects...
            </p>

          </div>

        ) : projects.length === 0 ? (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              📁
            </div>

            <h2 className="text-xl font-semibold">
              No projects yet
            </h2>

            <p className="text-slate-500 mt-2 mb-6">
              {canManageProjects
                ? "Create your first project to get started."
                : "No projects are available."}
            </p>

            {/* ONLY OWNER AND MANAGER */}

            {canManageProjects && (
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setError("");
                  setSuccess("");
                }}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                + Create Project
              </button>
            )}

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {projects.map((project) => (

              <div
                key={project._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
              >

                {/* Project Header */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="text-lg font-semibold">
                      {project.name}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Created by{" "}
                      {project.createdBy?.name ||
                        "Unknown"}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full border text-xs capitalize whitespace-nowrap ${getStatusStyle(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>

                </div>

                {/* Description */}

                <p className="text-sm text-slate-400 mt-5 min-h-48px">
                  {project.description ||
                    "No description provided."}
                </p>

                {/* Date */}

                <p className="text-xs text-slate-600 mt-5">
                  Created{" "}
                  {project.createdAt
                    ? new Date(
                        project.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

                {/* ================= ACTIONS ================= */}

                <div className="flex gap-2 mt-6 pt-5 border-t border-slate-800">

                  {/* VIEW — EVERYONE */}

                  <button
                    onClick={() =>
                      navigate(
                        `/projects/${project._id}`
                      )
                    }
                    className={
                      canManageProjects
                        ? "flex-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        : "w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    }
                  >
                    View
                  </button>

                  {/* EDIT — OWNER + MANAGER ONLY */}

                  {canManageProjects && (
                    <button
                      onClick={() =>
                        handleEditProject(project)
                      }
                      className="flex-1 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition"
                    >
                      Edit
                    </button>
                  )}

                  {/* DELETE — OWNER + MANAGER ONLY */}

                  {canManageProjects && (
                    <button
                      onClick={() =>
                        handleDeleteProject(
                          project._id
                        )
                      }
                      disabled={
                        deletingId === project._id
                      }
                      className="flex-1 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition"
                    >
                      {deletingId === project._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
};

export default Projects;
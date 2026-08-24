import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, deleteTask } from "../services/taskApi";
import { getProjects } from "../services/projectApi";
import { getMembers } from "../services/memberApi";

const Tasks = () => {
  const navigate = useNavigate();

  // ================= USER ROLE =================

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  const canCreateTask =
    userRole === "owner" || userRole === "manager";

  const canDeleteTask =
    userRole === "owner" || userRole === "manager";

  // ================= STATES =================

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ================= LOAD DATA =================

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [tasksData, projectsData, membersData] =
          await Promise.all([
            getTasks(),
            getProjects(),
            getMembers(),
          ]);

        if (isMounted) {
          setTasks(tasksData.tasks || []);
          setProjects(projectsData.projects || []);
          setMembers(membersData.members || []);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message || "Failed to load tasks");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ================= CREATE TASK =================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!canCreateTask) {
      setError(
        "Access denied. You do not have permission to create tasks.",
      );
      return;
    }

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!project) {
      setError("Please select a project.");
      return;
    }

    try {
      setCreating(true);

      const data = await createTask({
        title: title.trim(),
        description: description.trim(),
        project,
        status,
        priority,
        dueDate: dueDate || null,
        assignedTo: assignedTo || null,
      });

      setTasks((prevTasks) => [data.task, ...prevTasks]);

      setSuccess(data.message || "Task created successfully.");

      // Clear form
      setTitle("");
      setDescription("");
      setProject("");
      setAssignedTo("");
      setStatus("todo");
      setPriority("medium");
      setDueDate("");

      setShowCreateForm(false);
    } catch (error) {
      setError(error.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  // ================= DELETE TASK =================

  const handleDeleteTask = async (id) => {
    if (!canDeleteTask) {
      setError(
        "Access denied. You do not have permission to delete tasks.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      setDeletingId(id);

      const data = await deleteTask(id);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id),
      );

      setSuccess(data.message || "Task deleted successfully.");
    } catch (error) {
      setError(error.message || "Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= STATUS STYLE =================

  const getStatusStyle = (taskStatus) => {
    switch (taskStatus) {
      case "in-progress":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // ================= PRIORITY STYLE =================

  const getPriorityStyle = (taskPriority) => {
    switch (taskPriority) {
      case "high":
        return "text-red-400";

      case "medium":
        return "text-yellow-400";

      case "low":
        return "text-green-400";

      default:
        return "text-slate-400";
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
              Tasks
            </h1>

            <p className="text-sm text-slate-500">
              Manage your organization tasks
            </p>
          </div>

        </div>

        {/* ONLY OWNER AND MANAGER */}

        {canCreateTask && (
          <button
            onClick={() => {
              setShowCreateForm(true);
              setError("");
              setSuccess("");
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            + New Task
          </button>
        )}

      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-7xl mx-auto p-5 md:p-8">

        {/* ================= PAGE HEADING ================= */}

        <div className="mb-8">

          <p className="text-sm text-blue-400 font-medium mb-2">
            Workspace
          </p>

          <h1 className="text-3xl font-bold">
            Tasks
          </h1>

          <p className="text-slate-400 mt-2">
            Create, assign and manage tasks for your projects.
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

        {showCreateForm && canCreateTask && (
          <section className="mb-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="p-6 border-b border-slate-800">

              <h2 className="text-lg font-semibold">
                Create New Task
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Add a task to one of your projects.
              </p>

            </div>

            <form
              onSubmit={handleCreateTask}
              className="p-6 space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Task Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:border-blue-500"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 outline-none focus:border-blue-500 resize-none"
                />

              </div>

              {/* PROJECT */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Project
                </label>

                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                >

                  <option value="">
                    Select Project
                  </option>

                  {projects.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name}
                    </option>
                  ))}

                </select>

              </div>

              {/* ASSIGN TO */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Assign To
                </label>

                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                >

                  <option value="">
                    Unassigned
                  </option>

                  {/* ONLY EMPLOYEES */}

                  {members
                    .filter((member) => member.role === "employee")
                    .map((member) => (
                      <option
                        key={member._id}
                        value={member._id}
                      >
                        {member.name}
                      </option>
                    ))}

                </select>

              </div>

              {/* STATUS + PRIORITY */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm text-slate-400 mb-2">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                  >

                    <option value="todo">
                      To Do
                    </option>

                    <option value="in-progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-sm text-slate-400 mb-2">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                  >

                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>

                  </select>

                </div>

              </div>

              {/* DUE DATE */}

              <div>

                <label className="block text-sm text-slate-400 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium transition"
                >
                  {creating ? "Creating..." : "Create Task"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setTitle("");
                    setDescription("");
                    setProject("");
                    setAssignedTo("");
                    setStatus("todo");
                    setPriority("medium");
                    setDueDate("");
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

        {/* ================= TASKS ================= */}

        {loading ? (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <p className="text-slate-400">
              Loading tasks...
            </p>

          </div>

        ) : tasks.length === 0 ? (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              ✓
            </div>

            <h2 className="text-xl font-semibold">
              No tasks yet
            </h2>

            <p className="text-slate-500 mt-2 mb-6">
              {canCreateTask
                ? "Create your first task to get started."
                : "No tasks have been assigned to you yet."}
            </p>

            {/* ONLY OWNER AND MANAGER */}

            {canCreateTask && (
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setError("");
                  setSuccess("");
                }}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
              >
                + Create Task
              </button>
            )}

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {tasks.map((task) => (

              <div
                key={task._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
              >

                {/* TASK HEADER */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="text-lg font-semibold">
                      {task.title}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Project: {task.project?.name || "Unknown"}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full border text-xs capitalize whitespace-nowrap ${getStatusStyle(
                      task.status,
                    )}`}
                  >
                    {task.status.replace("-", " ")}
                  </span>

                </div>

                {/* DESCRIPTION */}

                <p className="text-sm text-slate-400 mt-5 min-h-48px">
                  {task.description || "No description provided."}
                </p>

                {/* PRIORITY */}

                <div className="mt-5">

                  <span className="text-xs text-slate-500">
                    Priority
                  </span>

                  <p
                    className={`text-sm font-medium capitalize ${getPriorityStyle(
                      task.priority,
                    )}`}
                  >
                    {task.priority}
                  </p>

                </div>

                {/* DUE DATE */}

                <div className="mt-4">

                  <span className="text-xs text-slate-500">
                    Due Date
                  </span>

                  <p className="text-sm text-slate-300">

                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}

                  </p>

                </div>

                {/* ASSIGNED USER */}

                <div className="mt-4">

                  <span className="text-xs text-slate-500">
                    Assigned To
                  </span>

                  <p className="text-sm text-slate-300">
                    {task.assignedTo?.name || "Unassigned"}
                  </p>

                </div>

                {/* ACTIONS */}

                <div className="flex gap-3 mt-6 pt-5 border-t border-slate-800">

                  {/* VIEW — EVERYONE */}

                  <button
                    onClick={() =>
                      navigate(`/tasks/${task._id}`)
                    }
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    View
                  </button>

                  {/* DELETE — OWNER + MANAGER */}

                  {canDeleteTask && (
                    <button
                      onClick={() =>
                        handleDeleteTask(task._id)
                      }
                      disabled={deletingId === task._id}
                      className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition"
                    >
                      {deletingId === task._id
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

export default Tasks;


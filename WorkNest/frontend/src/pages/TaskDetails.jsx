
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTask, updateTask } from "../services/taskApi";

const TaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(false);

  // ================= CURRENT USER =================

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;

  // Employee can update status only if this task is assigned to them
  const isAssignedEmployee =
    userRole === "employee" &&
    task?.assignedTo?._id &&
    task.assignedTo._id.toString() === user?.id?.toString();

  // Owner and Manager can update tasks
  const canManageTask =
    userRole === "owner" || userRole === "manager";

  // ================= LOAD TASK =================

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTask(id);

        setTask(data.task);
      } catch (error) {
        setError(error.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  // ================= UPDATE STATUS =================

  const handleStatusChange = async (newStatus) => {
    if (!task) {
      return;
    }

    // Employee can only update their assigned task
    if (!isAssignedEmployee && !canManageTask) {
      setError("You do not have permission to update this task.");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const data = await updateTask(id, {
        status: newStatus,
      });

      setTask(data.task);

      setSuccess("Task status updated successfully.");
    } catch (error) {
      setError(error.message || "Failed to update task status");
    } finally {
      setUpdating(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading task...</p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error && !task) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>

          <button
            onClick={() => navigate("/tasks")}
            className="mt-5 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            ← Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= HEADER ================= */}

      <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center px-5 md:px-8">
        <button
          onClick={() => navigate("/tasks")}
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          ←
        </button>

        <div className="ml-4">
          <h1 className="text-xl font-semibold">
            Task Details
          </h1>

          <p className="text-sm text-slate-500">
            View and manage task information
          </p>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-4xl mx-auto p-5 md:p-8">

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

        {/* ================= TASK CARD ================= */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

          {/* TITLE */}

          <h2 className="text-2xl font-bold">
            {task.title}
          </h2>

          {/* DESCRIPTION */}

          <p className="text-slate-400 mt-4">
            {task.description || "No description provided."}
          </p>

          {/* ================= TASK INFORMATION ================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

            {/* PROJECT */}

            <div>
              <p className="text-xs text-slate-500">
                Project
              </p>

              <p className="text-sm text-slate-200 mt-1">
                {task.project?.name || "Unknown"}
              </p>
            </div>

            {/* ASSIGNED TO */}

            <div>
              <p className="text-xs text-slate-500">
                Assigned To
              </p>

              <p className="text-sm text-slate-200 mt-1">
                {task.assignedTo?.name || "Unassigned"}
              </p>
            </div>

            {/* STATUS */}

            <div>
              <p className="text-xs text-slate-500">
                Status
              </p>

              {/* EMPLOYEE / MANAGER / OWNER STATUS UPDATE */}

              {isAssignedEmployee || canManageTask ? (
                <select
                  value={task.status}
                  disabled={updating}
                  onChange={(e) =>
                    handleStatusChange(e.target.value)
                  }
                  className="mt-2 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 disabled:opacity-50"
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
              ) : (
                <p className="text-sm text-slate-200 mt-1 capitalize">
                  {task.status?.replace("-", " ")}
                </p>
              )}
            </div>

            {/* PRIORITY */}

            <div>
              <p className="text-xs text-slate-500">
                Priority
              </p>

              <p className="text-sm text-slate-200 mt-1 capitalize">
                {task.priority}
              </p>
            </div>

            {/* DUE DATE */}

            <div>
              <p className="text-xs text-slate-500">
                Due Date
              </p>

              <p className="text-sm text-slate-200 mt-1">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>

            {/* CREATED BY */}

            <div>
              <p className="text-xs text-slate-500">
                Created By
              </p>

              <p className="text-sm text-slate-200 mt-1">
                {task.createdBy?.name || "Unknown"}
              </p>
            </div>

          </div>

          {/* ================= EMPLOYEE MESSAGE ================= */}

          {isAssignedEmployee && (
            <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-400">
                You are assigned to this task. Update the status as
                you make progress.
              </p>
            </div>
          )}

          {/* ================= BACK BUTTON ================= */}

          <div className="mt-8 pt-6 border-t border-slate-800">

            <button
              onClick={() => navigate("/tasks")}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              ← Back to Tasks
            </button>

          </div>

        </div>
      </main>
    </div>
  );
};

export default TaskDetails;

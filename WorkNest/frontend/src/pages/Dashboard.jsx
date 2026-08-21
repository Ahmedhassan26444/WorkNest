import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/dashboardApi";
import { getProjects } from "../services/projectApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);

  // ================= USER =================

  const storedUser = localStorage.getItem("user");

  const user = (() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })();

  const userName = user?.name || "Ahmed Hassan";
  const userRole = user?.role || "Owner";
  const userInitial = userName.charAt(0).toUpperCase();

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ================= CLOSE DROPDOWN =================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ================= FETCH DASHBOARD =================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data.dashboard);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ================= FETCH PROJECTS =================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.projects || []);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProjects();
  }, []);

  // ================= DASHBOARD DATA =================

  const totalProjects = dashboard?.projects?.total ?? 0;
  const activeProjects = dashboard?.projects?.active ?? 0;
  const totalTasks = dashboard?.tasks?.total ?? 0;
  const completedTasks = dashboard?.tasks?.completed ?? 0;
  const teamMembers = dashboard?.team?.total ?? 0;

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // ================= UI =================

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="hidden lg:flex w-72 bg-slate-900 border-r border-slate-800 flex-col">

        {/* Logo */}

        <div className="px-7 py-7 border-b border-slate-800">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
              W
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Work<span className="text-blue-500">Nest</span>
              </h1>

              <p className="text-xs text-slate-500">
                Project Management
              </p>
            </div>

          </div>
        </div>

        {/* Navigation */}

        <div className="flex-1 px-5 py-7">

          <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-4">
            Workspace
          </p>

          <nav className="space-y-2">

            {/* Dashboard */}

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"
            >
              <span className="text-lg">⌂</span>
              <span className="font-medium">Dashboard</span>
            </button>

            {/* Projects */}

            <button
              onClick={() => navigate("/projects")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <span className="text-lg">▣</span>
              <span>Projects</span>
            </button>

            {/* Tasks */}

            <button
              onClick={() => navigate("/tasks")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <span className="text-lg">✓</span>
              <span>Tasks</span>
            </button>

            {/* Team */}

            <button
              onClick={() => navigate("/team")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <span className="text-lg">♙</span>
              <span>Team</span>
            </button>

            {/* Analytics */}

            <button
              onClick={() => navigate("/analytics")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <span className="text-lg">◔</span>
              <span>Analytics</span>
            </button>

          </nav>

          <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mt-10 mb-4">
            System
          </p>

          <nav className="space-y-2">

            {/* Settings */}

            <button
              onClick={() => navigate("/settings")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <span className="text-lg">⚙</span>
              <span>Settings</span>
            </button>

          </nav>
        </div>

        {/* Sidebar User */}

        <div className="p-5 border-t border-slate-800">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60">

            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              {userInitial}
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold truncate">
                {userName}
              </p>

              <p className="text-xs text-slate-500 capitalize">
                {userRole}
              </p>

            </div>

            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="text-slate-500 hover:text-white transition"
            >
              ⋮
            </button>

          </div>
        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="flex-1 min-w-0">

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <header className="h-20 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between px-5 md:px-8">

          {/* Mobile Logo */}

          <div className="lg:hidden flex items-center gap-2">

            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              W
            </div>

            <h1 className="font-bold">
              Work<span className="text-blue-500">Nest</span>
            </h1>

          </div>

          {/* Search */}

          <div className="hidden md:flex items-center w-80">

            <div className="w-full relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search workspace..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
              />

            </div>

          </div>

          {/* Right Side */}

          <div className="flex items-center gap-5 ml-auto">

            {/* Notification */}

            <button className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition">

              🔔

              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500"></span>

            </button>

            {/* Divider */}

            <div className="hidden sm:block h-8 w-px bg-slate-800"></div>

            {/* PROFILE DROPDOWN */}

            <div
              className="relative"
              ref={profileRef}
            >

              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-900 transition"
              >

                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                  {userInitial}
                </div>

                <div className="hidden sm:block text-left">

                  <p className="text-sm font-semibold">
                    {userName}
                  </p>

                  <p className="text-xs text-slate-500 capitalize">
                    {userRole}
                  </p>

                </div>

                <span
                  className={`hidden sm:block text-slate-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>

              </button>

              {/* Dropdown */}

              {profileOpen && (

                <div className="absolute right-0 top-full mt-3 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">

                  {/* User Info */}

                  <div className="p-4 border-b border-slate-800">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                        {userInitial}
                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold truncate">
                          {userName}
                        </p>

                        <p className="text-xs text-slate-500 capitalize">
                          {userRole}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Menu */}

                  <div className="p-2">

                    {/* PROFILE - UPDATED */}

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition text-left"
                    >
                      <span>👤</span>

                      <span className="text-sm">
                        Profile
                      </span>
                    </button>

                    {/* SETTINGS */}

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition text-left"
                    >
                      <span>⚙</span>

                      <span className="text-sm">
                        Settings
                      </span>
                    </button>

                  </div>

                  {/* Logout */}

                  <div className="p-2 border-t border-slate-800">

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-left"
                    >
                      <span>🚪</span>

                      <span className="text-sm font-medium">
                        Logout
                      </span>
                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <section className="p-5 md:p-8 xl:p-10">

          {/* Welcome */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

            <div>

              <p className="text-sm text-blue-400 font-medium mb-2">
                Workspace Overview
              </p>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {userName.split(" ")[0]} 👋
              </h1>

              <p className="text-slate-400 mt-2">
                Here's what's happening in your workspace today.
              </p>

            </div>

            <button
              onClick={() => navigate("/projects")}
              className="self-start md:self-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition"
            >
              + New Project
            </button>

          </div>

          {/* Loading */}

          {loading && (
            <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-400">
              Loading dashboard...
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* =================================================
              KPI CARDS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

            {/* Projects */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">

              <div className="flex items-center justify-between mb-5">

                <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl">
                  ▣
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400">
                  Active
                </span>

              </div>

              <p className="text-sm text-slate-400">
                Total Projects
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {totalProjects}
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                {activeProjects} active projects
              </p>

            </div>

            {/* Tasks */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">

              <div className="flex items-center justify-between mb-5">

                <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl">
                  ✓
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400">
                  Tasks
                </span>

              </div>

              <p className="text-sm text-slate-400">
                Total Tasks
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {totalTasks}
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                {completedTasks} completed
              </p>

            </div>

            {/* Team */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">

              <div className="flex items-center justify-between mb-5">

                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl">
                  ♙
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                  Team
                </span>

              </div>

              <p className="text-sm text-slate-400">
                Team Members
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {teamMembers}
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                Workspace members
              </p>

            </div>

            {/* Completion */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">

              <div className="flex items-center justify-between mb-5">

                <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-xl">
                  ◔
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400">
                  Progress
                </span>

              </div>

              <p className="text-sm text-slate-400">
                Completion Rate
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {completionRate}%
              </h3>

              <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">

                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{
                    width: `${completionRate}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

          {/* =================================================
              ANALYTICS
          ================================================= */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">

            {/* Project Analytics */}

            <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="flex items-center justify-between mb-7">

                <div>

                  <h2 className="text-lg font-semibold">
                    Workspace Overview
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Project and task performance
                  </p>

                </div>

                <button className="text-sm text-slate-400 hover:text-white transition">
                  This Month ▾
                </button>

              </div>

              {/* Chart */}

              <div className="h-64 flex items-end gap-3 md:gap-5">

                {[
                  35,
                  52,
                  42,
                  68,
                  55,
                  76,
                  Math.max(
                    30,
                    Math.min(95, completionRate)
                  ),
                ].map((height, index) => (

                  <div
                    key={index}
                    className="flex-1 h-full flex items-end"
                  >

                    <div className="w-full">

                      <div
                        className="w-full bg-blue-500/70 hover:bg-blue-500 rounded-t-lg transition"
                        style={{
                          height: `${height}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                ))}

              </div>

              <div className="flex justify-between text-xs text-slate-600 mt-3">

                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>

              </div>

            </div>

            {/* Task Overview */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-lg font-semibold">
                Task Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Current task progress
              </p>

              <div className="flex justify-center py-8">

                <div className="relative w-40 h-40">

                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#3b82f6 ${completionRate}%, #1e293b ${completionRate}% 100%)`,
                    }}
                  ></div>

                  <div className="absolute inset-3 rounded-full bg-slate-900 flex flex-col items-center justify-center">

                    <span className="text-3xl font-bold">
                      {completionRate}%
                    </span>

                    <span className="text-xs text-slate-500">
                      Completed
                    </span>

                  </div>

                </div>

              </div>

              <div className="space-y-3">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>

                    <span className="text-sm text-slate-400">
                      Completed
                    </span>

                  </div>

                  <span className="text-sm font-medium">
                    {completedTasks}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>

                    <span className="text-sm text-slate-400">
                      Remaining
                    </span>

                  </div>

                  <span className="text-sm font-medium">
                    {Math.max(
                      totalTasks - completedTasks,
                      0
                    )}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              BOTTOM SECTION
          ================================================= */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Recent Projects */}

            <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl">

              <div className="p-6 border-b border-slate-800 flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-semibold">
                    Recent Projects
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Your latest workspace projects
                  </p>

                </div>

                <button
                  onClick={() => navigate("/projects")}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  View all
                </button>

              </div>

              <div className="p-6">

                {projects.length === 0 ? (

                  <div className="p-8 text-center">

                    <div className="text-4xl mb-4">
                      📁
                    </div>

                    <h3 className="font-semibold">
                      No projects yet
                    </h3>

                    <p className="text-sm text-slate-500 mt-2">
                      Create your first project to get started.
                    </p>

                    <button
                      onClick={() => navigate("/projects")}
                      className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
                    >
                      Create Project
                    </button>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {projects.slice(0, 5).map((project) => (

                      <div
                        key={project._id}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition"
                      >

                        <div className="flex items-center gap-4 min-w-0">

                          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg shrink-0">
                            ▣
                          </div>

                          <div className="min-w-0">

                            <h3 className="font-medium truncate">
                              {project.name}
                            </h3>

                            <p className="text-sm text-slate-500 truncate mt-1">
                              {project.description ||
                                "No description"}
                            </p>

                          </div>

                        </div>

                        <span className="shrink-0 px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 capitalize">
                          {project.status || "active"}
                        </span>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

            {/* Quick Actions */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl">

              <div className="p-6 border-b border-slate-800">

                <h2 className="text-lg font-semibold">
                  Quick Actions
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Manage your workspace
                </p>

              </div>

              <div className="p-6 space-y-3">

                {/* Create Project */}

                <button
                  onClick={() => navigate("/projects")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition text-left"
                >

                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    +
                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      Create Project
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Start a new project
                    </p>

                  </div>

                </button>

                {/* Create Task */}

                <button
                  onClick={() => navigate("/tasks")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition text-left"
                >

                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    ✓
                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      Create Task
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Add a new task
                    </p>

                  </div>

                </button>

                {/* Add Team Member */}

                <button
                  onClick={() => navigate("/team")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition text-left"
                >

                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    ♙
                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      Add Team Member
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Invite someone
                    </p>

                  </div>

                </button>

                {/* Analytics */}

                <button
                  onClick={() => navigate("/analytics")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition text-left"
                >

                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                    ◔
                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      View Analytics
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Check workspace stats
                    </p>

                  </div>

                </button>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Dashboard;
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboard } from "../services/dashboardApi";
import { getProjects } from "../services/projectApi";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationApi";

const Dashboard = () => {
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);

  const [profileOpen, setProfileOpen] = useState(false);

  // ================= SEARCH =================

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // ================= NOTIFICATIONS =================

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

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

  const profilePhoto = user?.profilePhoto || null;

  // ================= PROFILE PHOTO URL =================

  const getProfilePhotoUrl = () => {
    if (!profilePhoto) return null;

    if (profilePhoto.startsWith("http")) {
      return profilePhoto;
    }

    return `http://localhost:5000${profilePhoto}`;
  };

  const profilePhotoUrl = getProfilePhotoUrl();

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ================= SEARCH RESULTS =================

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return false;

    const projectName = project.name?.toLowerCase() || "";
    const projectDescription =
      project.description?.toLowerCase() || "";
    const projectStatus = project.status?.toLowerCase() || "";

    return (
      projectName.includes(query) ||
      projectDescription.includes(query) ||
      projectStatus.includes(query)
    );
  });

  // ================= CLOSE DROPDOWNS =================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
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

  // ================= FETCH NOTIFICATIONS =================

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const data = await getUnreadCount();

        setUnreadCount(data.count || 0);
      } catch (error) {
        console.error("Notification count error:", error);
      }
    };

    fetchNotificationCount();

    const interval = setInterval(fetchNotificationCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // ================= LOAD NOTIFICATIONS =================

  const handleNotificationOpen = async () => {
    const newState = !notificationOpen;

    setNotificationOpen(newState);

    if (!newState) return;

    try {
      setNotificationLoading(true);

      const data = await getNotifications();

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Notification loading error:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  // ================= MARK NOTIFICATION AS READ =================

  const handleNotificationClick = async (notification) => {
  try {
    await markNotificationAsRead(notification._id);

    // Remove notification immediately from frontend
    setNotifications((prev) =>
      prev.filter((item) => item._id !== notification._id)
    );

    // Update unread count only if notification was unread
    if (!notification.isRead) {
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }

    setNotificationOpen(false);
  } catch (error) {
    console.error("Remove notification error:", error);
  }
};
  // ================= MARK ALL AS READ =================

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all notifications error:", error);
    }
  };

  // ================= NOTIFICATION TIME =================

  const formatNotificationTime = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();

    const difference = Math.floor(
      (now - notificationDate) / 1000
    );

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 3600) {
      return `${Math.floor(difference / 60)}m ago`;
    }

    if (difference < 86400) {
      return `${Math.floor(difference / 3600)}h ago`;
    }

    if (difference < 604800) {
      return `${Math.floor(difference / 86400)}d ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  // ================= NOTIFICATION ICON =================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "project_created":
        return "📁";

      case "task_assigned":
        return "📝";

      case "task_status_changed":
        return "🔄";

      default:
        return "🔔";
    }
  };

  // ================= SELECT SEARCH PROJECT =================

  const handleSelectProject = (project) => {
    setSearchQuery("");
    setSearchOpen(false);

    navigate("/projects", {
      state: {
        selectedProjectId: project._id,
      },
    });
  };

  // ================= DASHBOARD DATA =================

  const totalProjects = dashboard?.projects?.total ?? 0;
  const activeProjects = dashboard?.projects?.active ?? 0;

  const totalTasks = dashboard?.tasks?.total ?? 0;
  const completedTasks = dashboard?.tasks?.completed ?? 0;

  const teamMembers = dashboard?.team?.total ?? 0;

  const remainingTasks = Math.max(
    totalTasks - completedTasks,
    0
  );

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const activeProjectRate = totalProjects
    ? Math.round((activeProjects / totalProjects) * 100)
    : 0;

  // ================= UI =================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

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

            {/* Sidebar Avatar */}

            <div className="w-10 h-10 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center font-bold shrink-0">

              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                userInitial
              )}

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
              onClick={() =>
                setProfileOpen((prev) => !prev)
              }
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

          <div
            className="hidden md:flex items-center w-80 relative"
            ref={searchRef}
          >

            <div className="w-full relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                ⌕
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setSearchOpen(true);
                  }
                }}
                placeholder="Search workspace..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-11 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
              />

              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
                >
                  ×
                </button>
              )}

            </div>

            {/* Search Results */}

            {searchOpen && searchQuery.trim() && (

              <div className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">

                {filteredProjects.length > 0 ? (

                  <div className="max-h-80 overflow-y-auto">

                    <div className="px-4 py-3 border-b border-slate-800">

                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Projects
                      </p>

                    </div>

                    {filteredProjects.slice(0, 8).map((project) => (

                      <button
                        key={project._id}
                        onClick={() =>
                          handleSelectProject(project)
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition text-left"
                      >

                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                          ▣
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-medium truncate">
                            {project.name}
                          </p>

                          <p className="text-xs text-slate-500 truncate mt-1">
                            {project.description ||
                              "No description"}
                          </p>

                        </div>

                        <span className="text-xs text-slate-500 capitalize shrink-0">
                          {project.status || "planning"}
                        </span>

                      </button>

                    ))}

                  </div>

                ) : (

                  <div className="p-6 text-center">

                    <div className="text-3xl mb-3">
                      🔍
                    </div>

                    <p className="text-sm font-medium">
                      No projects found
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Try searching for another project.
                    </p>

                  </div>

                )}

              </div>

            )}

          </div>

          {/* Right Side */}

          <div className="flex items-center gap-5 ml-auto">

            {/* =================================================
                NOTIFICATION
            ================================================= */}

            <div
              className="relative"
              ref={notificationRef}
            >

              <button
                onClick={() => { console.log("BELL CLICKED"); handleNotificationOpen(); }}
                className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition"
              >

                <span className="text-lg">
                  🔔
                </span>

                {unreadCount > 0 && (

                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-950">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>

                )}

              </button>

              {/* Notification Dropdown */}

              {notificationOpen && (

                <div className="absolute right-0 top-full mt-3 w-360px max-w-[calc(100vw-32px)] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">

                  {/* Header */}

                  <div className="px-4 py-4 border-b border-slate-800 flex items-center justify-between">

                    <div>

                      <h3 className="font-semibold">
                        Notifications
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                          : "You're all caught up"}
                      </p>

                    </div>

                    {unreadCount > 0 && (

                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-400 hover:text-blue-300 transition"
                      >
                        Mark all as read
                      </button>

                    )}

                  </div>

                  {/* Notifications */}

                  {notificationLoading ? (

                    <div className="p-8 text-center text-sm text-slate-500">
                      Loading notifications...
                    </div>

                  ) : notifications.length === 0 ? (

                    <div className="p-8 text-center">

                      <div className="text-4xl mb-3">
                        🔔
                      </div>

                      <p className="text-sm font-medium">
                        No notifications
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        New workspace activity will appear here.
                      </p>

                    </div>

                  ) : (

                    <div className="max-h-420px overflow-y-auto">

                      {notifications.map((notification) => (

                        <button
                          key={notification._id}
                          onClick={() =>
                            handleNotificationClick(
                              notification
                            )
                          }
                          className={`w-full text-left px-4 py-4 border-b border-slate-800/70 hover:bg-slate-800/70 transition ${
                            !notification.isRead
                              ? "bg-blue-500/5"
                              : ""
                          }`}
                        >

                          <div className="flex gap-3">

                            {/* Icon */}

                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                !notification.isRead
                                  ? "bg-blue-500/10"
                                  : "bg-slate-800"
                              }`}
                            >
                              {getNotificationIcon(
                                notification.type
                              )}
                            </div>

                            {/* Content */}

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p
                                  className={`text-sm ${
                                    !notification.isRead
                                      ? "font-semibold text-white"
                                      : "font-medium text-slate-300"
                                  }`}
                                >
                                  {notification.title}
                                </p>

                                {!notification.isRead && (

                                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5">
                                  </span>

                                )}

                              </div>

                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {notification.message}
                              </p>

                              <p className="text-[11px] text-slate-600 mt-2">
                                {formatNotificationTime(
                                  notification.createdAt
                                )}
                              </p>

                            </div>

                          </div>

                        </button>

                      ))}

                    </div>

                  )}

                </div>

              )}

            </div>

            {/* Divider */}

            <div className="hidden sm:block h-8 w-px bg-slate-800">
            </div>

            {/* Profile Dropdown */}

            <div
              className="relative"
              ref={profileRef}
            >

              <button
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
                className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-900 transition"
              >

                {/* TOP RIGHT AVATAR */}

                <div className="w-10 h-10 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center font-bold shrink-0">

                  {profilePhotoUrl ? (

                    <img
                      src={profilePhotoUrl}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    userInitial

                  )}

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

                      {/* DROPDOWN AVATAR */}

                      <div className="w-11 h-11 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center font-bold shrink-0">

                        {profilePhotoUrl ? (

                          <img
                            src={profilePhotoUrl}
                            alt={userName}
                            className="w-full h-full object-cover"
                          />

                        ) : (

                          userInitial

                        )}

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

                    {/* Profile */}

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

                    {/* Settings */}

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
                />

              </div>

            </div>

          </div>

          {/* =================================================
              WORKSPACE OVERVIEW
          ================================================= */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">

            {/* Project & Task Progress */}

            <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <div className="flex items-center justify-between mb-7">

                <div>

                  <h2 className="text-lg font-semibold">
                    Workspace Overview
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Quick view of your workspace progress
                  </p>

                </div>

                <button
                  onClick={() => navigate("/analytics")}
                  className="text-sm text-blue-400 hover:text-blue-300 transition"
                >
                  View Analytics →
                </button>

              </div>

              <div className="space-y-7">

                {/* Project Progress */}

                <div>

                  <div className="flex items-center justify-between mb-3">

                    <div>

                      <p className="text-sm font-medium">
                        Project Progress
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Active projects compared to total projects
                      </p>

                    </div>

                    <span className="text-sm font-semibold text-blue-400">
                      {activeProjectRate}%
                    </span>

                  </div>

                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${activeProjectRate}%`,
                      }}
                    />

                  </div>

                  <div className="flex justify-between mt-2 text-xs text-slate-500">

                    <span>
                      {activeProjects} active
                    </span>

                    <span>
                      {totalProjects} total
                    </span>

                  </div>

                </div>

                {/* Task Progress */}

                <div>

                  <div className="flex items-center justify-between mb-3">

                    <div>

                      <p className="text-sm font-medium">
                        Task Progress
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Completed tasks compared to total tasks
                      </p>

                    </div>

                    <span className="text-sm font-semibold text-emerald-400">
                      {completionRate}%
                    </span>

                  </div>

                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${completionRate}%`,
                      }}
                    />

                  </div>

                  <div className="flex justify-between mt-2 text-xs text-slate-500">

                    <span>
                      {completedTasks} completed
                    </span>

                    <span>
                      {remainingTasks} remaining
                    </span>

                  </div>

                </div>

              </div>

              {/* Summary */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">

                <div>

                  <p className="text-xs text-slate-500">
                    Projects
                  </p>

                  <p className="text-xl font-bold mt-1">
                    {totalProjects}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Active
                  </p>

                  <p className="text-xl font-bold mt-1">
                    {activeProjects}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Completed
                  </p>

                  <p className="text-xl font-bold mt-1">
                    {completedTasks}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-500">
                    Remaining
                  </p>

                  <p className="text-xl font-bold mt-1">
                    {remainingTasks}
                  </p>

                </div>

              </div>

            </div>

            {/* Workspace Status */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-lg font-semibold">
                Workspace Status
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Current workspace health
              </p>

              <div className="mt-8">

                {/* Completion Circle */}

                <div className="flex justify-center">

                  <div className="relative w-40 h-40">

                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#3b82f6 ${completionRate}%, #1e293b ${completionRate}% 100%)`,
                      }}
                    />

                    <div className="absolute inset-3 rounded-full bg-slate-900 flex flex-col items-center justify-center">

                      <span className="text-3xl font-bold">
                        {completionRate}%
                      </span>

                      <span className="text-xs text-slate-500 mt-1">
                        Task Completion
                      </span>

                    </div>

                  </div>

                </div>

                {/* Status Details */}

                <div className="space-y-4 mt-8">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500">
                      </span>

                      <span className="text-sm text-slate-400">
                        Active Projects
                      </span>

                    </div>

                    <span className="text-sm font-semibold">
                      {activeProjects}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500">
                      </span>

                      <span className="text-sm text-slate-400">
                        Completed Tasks
                      </span>

                    </div>

                    <span className="text-sm font-semibold">
                      {completedTasks}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <span className="w-2.5 h-2.5 rounded-full bg-slate-700">
                      </span>

                      <span className="text-sm text-slate-400">
                        Remaining Tasks
                      </span>

                    </div>

                    <span className="text-sm font-semibold">
                      {remainingTasks}
                    </span>

                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">

                    <span className="text-sm text-slate-400">
                      Team Members
                    </span>

                    <span className="text-sm font-semibold">
                      {teamMembers}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              RECENT PROJECTS + QUICK ACTIONS
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
                      Check detailed workspace stats
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
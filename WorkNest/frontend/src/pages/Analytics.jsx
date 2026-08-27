import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardApi";
import { getProjects } from "../services/projectApi";

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashboardData, projectData] = await Promise.all([
          getDashboard(),
          getProjects(),
        ]);

        setDashboard(dashboardData.dashboard);
        setProjects(projectData.projects || []);
      } catch (err) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ================= ANALYTICS DATA =================

  const totalProjects = dashboard?.projects?.total ?? 0;
  const activeProjects = dashboard?.projects?.active ?? 0;

  const totalTasks = dashboard?.tasks?.total ?? 0;
  const completedTasks = dashboard?.tasks?.completed ?? 0;

  const teamMembers = dashboard?.team?.total ?? 0;

  const remainingTasks = Math.max(totalTasks - completedTasks, 0);

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const activeRate = totalProjects
    ? Math.round((activeProjects / totalProjects) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200">
        <div className="px-6 md:px-10 py-6">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">
              Workspace Analytics
            </p>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Analytics
            </h1>

            <p className="text-slate-500 mt-2">
              Monitor your projects, tasks and team performance.
            </p>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="p-6 md:p-10 max-w-7xl mx-auto">

        {/* Loading */}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-500 mb-6">
            Loading analytics...
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5 mb-6">
            {error}
          </div>
        )}

        {/* ================= OVERVIEW CARDS ================= */}

        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

              {/* Projects */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    ▣
                  </div>

                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                    Projects
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-6">
                  Total Projects
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {totalProjects}
                </h2>

                <p className="text-xs text-slate-400 mt-2">
                  {activeProjects} currently active
                </p>
              </div>

              {/* Tasks */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                    ✓
                  </div>

                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-600">
                    Tasks
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-6">
                  Total Tasks
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {totalTasks}
                </h2>

                <p className="text-xs text-slate-400 mt-2">
                  {completedTasks} completed
                </p>
              </div>

              {/* Completed */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                    ✓
                  </div>

                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    Completed
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-6">
                  Completed Tasks
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {completedTasks}
                </h2>

                <p className="text-xs text-slate-400 mt-2">
                  {completionRate}% completion rate
                </p>
              </div>

              {/* Team */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl">
                    ♙
                  </div>

                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-orange-50 text-orange-600">
                    Team
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-6">
                  Team Members
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {teamMembers}
                </h2>

                <p className="text-xs text-slate-400 mt-2">
                  Workspace members
                </p>
              </div>
            </div>

            {/* ================= MAIN ANALYTICS ================= */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

              {/* Task Performance */}

              <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Task Performance
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Overview of your workspace tasks
                    </p>
                  </div>

                  <span className="text-sm font-medium text-slate-500">
                    Overall
                  </span>
                </div>

                {/* Progress */}

                <div className="mb-8">

                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-medium">
                      Completion
                    </span>

                    <span className="text-sm font-semibold text-blue-600">
                      {completionRate}%
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{
                        width: `${completionRate}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Task Stats */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Completed
                      </span>

                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>

                    <h3 className="text-2xl font-bold mt-3">
                      {completedTasks}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Finished tasks
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Remaining
                      </span>

                      <span className="w-3 h-3 rounded-full bg-slate-300" />
                    </div>

                    <h3 className="text-2xl font-bold mt-3">
                      {remainingTasks}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Tasks still remaining
                    </p>
                  </div>

                </div>
              </div>

              {/* Completion Circle */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <h2 className="text-lg font-semibold">
                  Completion Rate
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Overall task progress
                </p>

                <div className="flex justify-center py-10">

                  <div className="relative w-44 h-44">

                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(#2563eb ${completionRate}%, #e2e8f0 ${completionRate}% 100%)`,
                      }}
                    />

                    <div className="absolute inset-4 rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">
                        {completionRate}%
                      </span>

                      <span className="text-xs text-slate-500 mt-1">
                        Completed
                      </span>
                    </div>

                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Completed Tasks
                  </span>

                  <span className="font-semibold">
                    {completedTasks}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm mt-3">
                  <span className="text-slate-500">
                    Remaining Tasks
                  </span>

                  <span className="font-semibold">
                    {remainingTasks}
                  </span>
                </div>

              </div>
            </div>

            {/* ================= PROJECT ANALYTICS ================= */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Projects */}

              <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm">

                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold">
                    Project Performance
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Current projects in your workspace
                  </p>
                </div>

                <div className="p-6">

                  {projects.length === 0 ? (
                    <div className="py-10 text-center">
                      <div className="text-4xl mb-3">
                        📁
                      </div>

                      <h3 className="font-semibold">
                        No projects available
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Create projects to see their analytics.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">

                      {projects.slice(0, 6).map((project) => (
                        <div
                          key={project._id}
                          className="border border-slate-200 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between gap-4">

                            <div className="min-w-0">
                              <h3 className="font-medium truncate">
                                {project.name}
                              </h3>

                              <p className="text-xs text-slate-500 mt-1 truncate">
                                {project.description ||
                                  "No description"}
                              </p>
                            </div>

                            <span className="shrink-0 px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-600 capitalize">
                              {project.status || "active"}
                            </span>

                          </div>
                        </div>
                      ))}

                    </div>
                  )}

                </div>
              </div>

              {/* Workspace Health */}

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                <h2 className="text-lg font-semibold">
                  Workspace Health
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Current workspace status
                </p>

                <div className="space-y-6 mt-8">

                  {/* Projects */}

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500">
                        Active Projects
                      </span>

                      <span className="text-sm font-semibold">
                        {activeRate}%
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${activeRate}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Tasks */}

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500">
                        Task Completion
                      </span>

                      <span className="text-sm font-semibold">
                        {completionRate}%
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${completionRate}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Team */}

                  <div className="border-t border-slate-200 pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Team Members
                      </span>

                      <span className="font-semibold">
                        {teamMembers}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsApi";
import { getProjects } from "../services/projectApi";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsData, projectData] = await Promise.all([
          getAnalytics(),
          getProjects(),
        ]);

        setAnalytics(analyticsData.analytics);
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

  const projectStats = analytics?.projects || {};
  const taskStats = analytics?.tasks || {};
  const priorityStats = analytics?.priorities || {};
  const teamStats = analytics?.team || {};

  const totalProjects = projectStats.total ?? 0;
  const planningProjects = projectStats.planning ?? 0;
  const activeProjects = projectStats.active ?? 0;
  const completedProjects = projectStats.completed ?? 0;
  const onHoldProjects = projectStats.onHold ?? 0;

  const totalTasks = taskStats.total ?? 0;
  const todoTasks = taskStats.todo ?? 0;
  const inProgressTasks = taskStats.inProgress ?? 0;
  const completedTasks = taskStats.completed ?? 0;

  const lowPriorityTasks = priorityStats.low ?? 0;
  const mediumPriorityTasks = priorityStats.medium ?? 0;
  const highPriorityTasks = priorityStats.high ?? 0;

  const teamMembers = teamStats.total ?? 0;
  const owners = teamStats.owners ?? 0;
  const managers = teamStats.managers ?? 0;
  const employees = teamStats.employees ?? 0;

  const completionRate = analytics?.completionRate ?? 0;

  const remainingTasks = Math.max(totalTasks - completedTasks, 0);

  const activeProjectRate = totalProjects
    ? Math.round((activeProjects / totalProjects) * 100)
    : 0;

  // ================= HELPERS =================

  const getPercentage = (value, total) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  const statusPercentage = (value) =>
    getPercentage(value, totalTasks);

  const projectPercentage = (value) =>
    getPercentage(value, totalProjects);

  // ================= UI =================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================= HEADER ================= */}

      <header className="border-b border-slate-800 bg-slate-950">
        <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto">

          <p className="text-sm font-medium text-blue-400 mb-2">
            Workspace Insights
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Analytics
          </h1>

          <p className="text-slate-400 mt-2">
            Understand how your workspace is performing.
          </p>

        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="p-6 md:p-10 max-w-7xl mx-auto">

        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-400">
            Loading analytics...
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-5 mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>

            {/* ================= OVERVIEW ================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

              {/* Projects */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <p className="text-sm text-slate-500">
                  Total Projects
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalProjects}
                </h2>

                <p className="text-xs text-blue-400 mt-2">
                  {activeProjects} active
                </p>

              </div>

              {/* Tasks */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <p className="text-sm text-slate-500">
                  Total Tasks
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {totalTasks}
                </h2>

                <p className="text-xs text-orange-400 mt-2">
                  {remainingTasks} remaining
                </p>

              </div>

              {/* Completion */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <p className="text-sm text-slate-500">
                  Completion Rate
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {completionRate}%
                </h2>

                <p className="text-xs text-emerald-400 mt-2">
                  {completedTasks} completed
                </p>

              </div>

              {/* Team */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <p className="text-sm text-slate-500">
                  Team Members
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {teamMembers}
                </h2>

                <p className="text-xs text-purple-400 mt-2">
                  Workspace members
                </p>

              </div>

            </div>


            {/* ================= TASK ANALYSIS ================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

              {/* Task Status */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <div className="mb-7">

                  <h2 className="text-lg font-semibold">
                    Task Status
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Breakdown of your current tasks
                  </p>

                </div>

                <div className="space-y-6">

                  {/* Todo */}

                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-400">
                        To Do
                      </span>

                      <span className="text-sm font-medium">
                        {todoTasks}
                      </span>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-slate-500 rounded-full"
                        style={{
                          width: `${statusPercentage(todoTasks)}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* In Progress */}

                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-400">
                        In Progress
                      </span>

                      <span className="text-sm font-medium">
                        {inProgressTasks}
                      </span>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${statusPercentage(inProgressTasks)}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Completed */}

                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-400">
                        Completed
                      </span>

                      <span className="text-sm font-medium">
                        {completedTasks}
                      </span>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${statusPercentage(completedTasks)}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* Task Priority */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <div className="mb-7">

                  <h2 className="text-lg font-semibold">
                    Task Priority
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Tasks grouped by priority
                  </p>

                </div>

                <div className="space-y-6">

                  {/* Low */}

                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-400">
                        Low Priority
                      </span>

                      <span className="text-sm font-medium">
                        {lowPriorityTasks}
                      </span>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${getPercentage(
                            lowPriorityTasks,
                            totalTasks
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Medium */}

                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-400">
                        Medium Priority
                      </span>

                      <span className="text-sm font-medium">
                        {mediumPriorityTasks}
                      </span>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{
                          width: `${getPercentage(
                            mediumPriorityTasks,
                            totalTasks
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* High */}

                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-400">
                        High Priority
                      </span>

                      <span className="text-sm font-medium">
                        {highPriorityTasks}
                      </span>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${getPercentage(
                            highPriorityTasks,
                            totalTasks
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* ================= PROJECT ANALYSIS ================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

              {/* Project Status */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <div className="mb-7">

                  <h2 className="text-lg font-semibold">
                    Project Status
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Current state of your projects
                  </p>

                </div>

                <div className="space-y-5">

                  {/* Planning */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />

                      <span className="text-sm text-slate-400">
                        Planning
                      </span>

                    </div>

                    <div className="text-right">

                      <span className="font-semibold">
                        {planningProjects}
                      </span>

                      <span className="text-xs text-slate-500 ml-2">
                        ({projectPercentage(planningProjects)}%)
                      </span>

                    </div>

                  </div>

                  {/* Active */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />

                      <span className="text-sm text-slate-400">
                        Active
                      </span>

                    </div>

                    <div className="text-right">

                      <span className="font-semibold">
                        {activeProjects}
                      </span>

                      <span className="text-xs text-slate-500 ml-2">
                        ({projectPercentage(activeProjects)}%)
                      </span>

                    </div>

                  </div>

                  {/* Completed */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />

                      <span className="text-sm text-slate-400">
                        Completed
                      </span>

                    </div>

                    <div className="text-right">

                      <span className="font-semibold">
                        {completedProjects}
                      </span>

                      <span className="text-xs text-slate-500 ml-2">
                        ({projectPercentage(completedProjects)}%)
                      </span>

                    </div>

                  </div>

                  {/* On Hold */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />

                      <span className="text-sm text-slate-400">
                        On Hold
                      </span>

                    </div>

                    <div className="text-right">

                      <span className="font-semibold">
                        {onHoldProjects}
                      </span>

                      <span className="text-xs text-slate-500 ml-2">
                        ({projectPercentage(onHoldProjects)}%)
                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* Project Health */}

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                <h2 className="text-lg font-semibold">
                  Project Health
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Overall workspace project activity
                </p>

                <div className="mt-8">

                  <div className="flex justify-between mb-3">

                    <span className="text-sm text-slate-400">
                      Active Projects
                    </span>

                    <span className="font-semibold">
                      {activeProjectRate}%
                    </span>

                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{
                        width: `${activeProjectRate}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="mt-8">

                  <div className="flex justify-between mb-3">

                    <span className="text-sm text-slate-400">
                      Task Completion
                    </span>

                    <span className="font-semibold">
                      {completionRate}%
                    </span>

                  </div>

                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width: `${completionRate}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="border-t border-slate-800 mt-8 pt-6">

                  <div className="flex justify-between">

                    <span className="text-sm text-slate-400">
                      Workspace Status
                    </span>

                    <span className="font-semibold text-blue-400">
                      {completionRate >= 70
                        ? "Healthy"
                        : completionRate >= 40
                        ? "Needs Attention"
                        : "At Risk"}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* ================= TEAM ANALYSIS ================= */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

              <div className="mb-7">

                <h2 className="text-lg font-semibold">
                  Team Breakdown
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Members by workspace role
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Owners */}

                <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-5">

                  <p className="text-sm text-slate-500">
                    Owners
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {owners}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2">
                    Workspace owners
                  </p>

                </div>

                {/* Managers */}

                <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-5">

                  <p className="text-sm text-slate-500">
                    Managers
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {managers}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2">
                    Project managers
                  </p>

                </div>

                {/* Employees */}

                <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-5">

                  <p className="text-sm text-slate-500">
                    Employees
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {employees}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2">
                    Team members
                  </p>

                </div>

              </div>

            </div>


            {/* ================= PROJECT LIST ================= */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl">

              <div className="p-6 border-b border-slate-800">

                <h2 className="text-lg font-semibold">
                  Projects
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
                      Create projects to see them here.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {projects.slice(0, 6).map((project) => (

                      <div
                        key={project._id}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-800"
                      >

                        <div className="flex items-center gap-4 min-w-0">

                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                            ▣
                          </div>

                          <div className="min-w-0">

                            <h3 className="font-medium truncate">
                              {project.name}
                            </h3>

                            <p className="text-xs text-slate-500 truncate mt-1">
                              {project.description ||
                                "No description"}
                            </p>

                          </div>

                        </div>

                        <span className="shrink-0 px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 capitalize">
                          {project.status || "active"}
                        </span>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </>
        )}

      </main>

    </div>
  );
};

export default Analytics;

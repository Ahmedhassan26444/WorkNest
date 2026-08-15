const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:block">

        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold">
            Work<span className="text-blue-500">Nest</span>
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Project Management
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">

          <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-600 text-white">
            Dashboard
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
            Projects
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
            Tasks
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
            Team
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
            Settings
          </button>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1">

        {/* Top Bar */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-6 md:px-10">

          <div>
            <h2 className="text-xl font-semibold">
              Dashboard
            </h2>

            <p className="text-sm text-slate-500">
              Overview of your workspace
            </p>
          </div>

          <div className="flex items-center gap-4">

            <button className="text-slate-400 hover:text-white">
              🔔
            </button>

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
                A
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-medium">
                  Ahmed Hassan
                </p>

                <p className="text-xs text-slate-500">
                  Owner
                </p>
              </div>

            </div>

          </div>

        </header>

        {/* Dashboard Content */}
        <section className="p-6 md:p-10">

          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Welcome back, Ahmed 👋
            </h1>

            <p className="text-slate-400 mt-2">
              Here's what's happening in your workspace.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-sm text-slate-400">
                Projects
              </p>

              <h3 className="text-3xl font-bold mt-2">
                0
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                Active projects
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-sm text-slate-400">
                Tasks
              </p>

              <h3 className="text-3xl font-bold mt-2">
                0
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                Total tasks
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-sm text-slate-400">
                Team Members
              </p>

              <h3 className="text-3xl font-bold mt-2">
                1
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                Workspace members
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <p className="text-sm text-slate-400">
                Completed
              </p>

              <h3 className="text-3xl font-bold mt-2">
                0%
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                Task completion
              </p>
            </div>

          </div>

          {/* Recent Projects */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl">

            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold">
                Recent Projects
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your latest workspace projects
              </p>
            </div>

            <div className="p-10 text-center">

              <div className="text-4xl mb-4">
                📁
              </div>

              <h3 className="font-semibold">
                No projects yet
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Create your first project to get started.
              </p>

              <button className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition">
                Create Project
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Dashboard;
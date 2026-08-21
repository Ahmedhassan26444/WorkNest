import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  const user = (() => {
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  })();

  const userName = user?.name || "User";
  const userEmail = user?.email || "No email";
  const userRole = user?.role || "Owner";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}

      <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-5 md:px-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-400 hover:text-white text-xl transition"
          >
            ←
          </button>

          <div>

            <h1 className="text-xl font-bold">
              Work<span className="text-blue-500">Nest</span>
            </h1>

            <p className="text-xs text-slate-500">
              Profile
            </p>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
        >
          Logout
        </button>

      </header>

      {/* Content */}

      <main className="max-w-4xl mx-auto px-5 md:px-8 py-10">

        <div className="mb-8">

          <p className="text-sm text-blue-400 font-medium mb-2">
            Account
          </p>

          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="text-slate-400 mt-2">
            View your WorkNest account information.
          </p>

        </div>

        {/* Profile Card */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          {/* Profile Header */}

          <div className="p-8 border-b border-slate-800">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
                {userInitial}
              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  {userName}
                </h2>

                <p className="text-slate-400 mt-1">
                  {userEmail}
                </p>

                <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs capitalize">
                  {userRole}
                </span>

              </div>

            </div>

          </div>

          {/* Account Information */}

          <div className="p-8">

            <h3 className="text-lg font-semibold mb-6">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}

              <div>

                <p className="text-sm text-slate-500 mb-2">
                  Full Name
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                  {userName}
                </div>

              </div>

              {/* Email */}

              <div>

                <p className="text-sm text-slate-500 mb-2">
                  Email Address
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                  {userEmail}
                </div>

              </div>

              {/* Role */}

              <div>

                <p className="text-sm text-slate-500 mb-2">
                  Role
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 capitalize">
                  {userRole}
                </div>

              </div>

              {/* Account Status */}

              <div>

                <p className="text-sm text-slate-500 mb-2">
                  Account Status
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-emerald-400">
                  ● Active
                </div>

              </div>

            </div>

            {/* Actions */}

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-3">

              <button
                onClick={() => navigate("/settings")}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-medium transition"
              >
                Account Settings
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-medium transition"
              >
                Back to Dashboard
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Profile;
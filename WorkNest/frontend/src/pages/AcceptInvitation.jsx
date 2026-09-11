import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { acceptInvitation } from "../services/invitationApi";
const AcceptInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("This invitation link is invalid.");
      return;
    }

    try {
      setLoading(true);

      const data = await acceptInvitation(
        token,
        formData.name,
        formData.password
      );

      setSuccess(
        data.message || "Invitation accepted successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-5xl">
        {/* ================= MAIN CARD ================= */}

        <div className="grid md:grid-cols-2 overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
          {/* ================= LEFT SIDE ================= */}

          <div className="relative hidden md:flex flex-col justify-between p-10 bg-linear-to-br from-blue-600/20 via-slate-900 to-slate-950 border-r border-slate-800">
            {/* Decorative circles */}

            <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

            <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />

            {/* Brand */}

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-600/20">
                  W
                </div>

                <span className="text-xl font-bold">
                  WorkNest
                </span>
              </div>
            </div>

            {/* Illustration Placeholder */}

            <div className="relative flex-1 flex items-center justify-center py-12">
              <div className="w-64 h-64 rounded-3xl border border-blue-500/10 bg-blue-500/5 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="text-6xl mb-5">
                    👋
                  </div>

                  <h2 className="text-2xl font-bold">
                    Welcome to WorkNest
                  </h2>

                  <p className="text-slate-400 text-sm mt-3 leading-6">
                    Your team is waiting for you.
                    Accept the invitation and get started.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Text */}

            <div className="relative">
              <p className="text-sm text-slate-500">
                Collaborate. Manage. Grow.
              </p>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="p-7 sm:p-10 md:p-12">
            {/* Mobile Brand */}

            <div className="flex md:hidden items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
                W
              </div>

              <span className="text-xl font-bold">
                WorkNest
              </span>
            </div>

            {/* Header */}

            <div className="mb-8">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
                You're Invited
              </div>

              <h1 className="text-3xl font-bold">
                Join your team
              </h1>

              <p className="text-slate-400 mt-3 leading-6">
                You've been invited to join a WorkNest
                organization. Create your account to get started.
              </p>
            </div>

            {/* Invalid Token */}

            {!token ? (
              <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">
                  This invitation link is invalid or incomplete.
                </p>

                <button
                  onClick={() => navigate("/login")}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium transition"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Error */}

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Success */}

                {success && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    {success}
                    <p className="mt-1 text-xs text-green-400/70">
                      Redirecting you to login...
                    </p>
                  </div>
                )}

                {/* Name */}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Password */}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Create Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    minLength={6}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />

                  <p className="text-xs text-slate-600 mt-2">
                    Password must be at least 6 characters.
                  </p>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={loading || !!success}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  {loading
                    ? "Accepting Invitation..."
                    : success
                    ? "Invitation Accepted"
                    : "Accept Invitation"}
                </button>

                {/* Login */}

                <p className="text-center text-sm text-slate-500 pt-2">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    Login
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}

        <p className="text-center text-xs text-slate-600 mt-6">
          Secure team onboarding powered by WorkNest
        </p>
      </div>
    </div>
  );
};

export default AcceptInvitation;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
            organizationName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setSuccess(
        "Account and organization created successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Work<span className="text-blue-500">Nest</span>
          </h1>

          <p className="text-slate-400 mt-2">
            Create your workspace and start collaborating.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          <h2 className="text-2xl font-semibold text-white">
            Create your account
          </h2>

          <p className="text-slate-400 mt-1 mb-6">
            Create your WorkNest workspace
          </p>

          <form onSubmit={handleRegister}>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Ahmed Hassan"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Organization Name */}
            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-2">
                Organization Name
              </label>

              <input
                type="text"
                value={organizationName}
                onChange={(e) =>
                  setOrganizationName(e.target.value)
                }
                placeholder="Your Company"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              />

              <p className="text-xs text-slate-500 mt-2">
                You will become the owner of this
                organization.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition"
            >
              {loading
                ? "Creating workspace..."
                : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:text-blue-400"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;


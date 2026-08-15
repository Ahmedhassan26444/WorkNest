import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save JWT
      localStorage.setItem("token", data.token);

      // Save user
      localStorage.setItem("user", JSON.stringify(data.user));

      // Check organization
      if (data.user.organization) {
        navigate("/dashboard");
      } else {
        navigate("/create-organization");
      }

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
            Manage your work. Grow your team.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          <h2 className="text-2xl font-semibold text-white">
            Welcome back
          </h2>

          <p className="text-slate-400 mt-1 mb-6">
            Sign in to your WorkNest account
          </p>

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          {/* Register */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Create account
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
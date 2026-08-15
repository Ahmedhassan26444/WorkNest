import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateOrganization = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateOrganization = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/organization",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create organization"
        );
      }

      // Update stored user information
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Go to dashboard
      navigate("/dashboard");
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
            Set up your workspace and start managing your team.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          <h2 className="text-2xl font-semibold text-white">
            Create your organization
          </h2>

          <p className="text-slate-400 mt-1 mb-6">
            Your organization is your WorkNest workspace.
          </p>

          <form onSubmit={handleCreateOrganization}>

            {/* Organization Name */}
            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-2">
                Organization Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ahmed Technologies"
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

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition"
            >
              {loading
                ? "Creating organization..."
                : "Create Organization"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/projects/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load project"
          );
        }

        if (isMounted) {
          setProject(data.project);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error.message || "Failed to load project"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";

      case "completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";

      case "on-hold":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Loading project...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        <header className="h-20 border-b border-slate-800 flex items-center px-5 md:px-8">
          <button
            onClick={() => navigate("/projects")}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            ←
          </button>

          <div className="ml-4">
            <h1 className="text-xl font-semibold">
              Project Details
            </h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-5 md:p-8">

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-red-400">
              Unable to load project
            </h2>

            <p className="text-red-300 mt-2">
              {error}
            </p>
          </div>

        </main>

      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Project not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center px-5 md:px-8">

        <button
          onClick={() => navigate("/projects")}
          className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          ←
        </button>

        <div className="ml-4">

          <h1 className="text-xl font-semibold">
            Project Details
          </h1>

          <p className="text-sm text-slate-500">
            View project information
          </p>

        </div>

      </header>

      {/* CONTENT */}

      <main className="max-w-4xl mx-auto p-5 md:p-8">

        {/* TITLE */}

        <div className="mb-8">

          <p className="text-sm text-blue-400 font-medium mb-2">
            Workspace / Project
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold">
                {project.name}
              </h1>

              <p className="text-slate-400 mt-2">
                {project.description ||
                  "No description provided."}
              </p>

            </div>

            <span
              className={`px-4 py-2 rounded-full border text-sm capitalize self-start ${getStatusStyle(
                project.status
              )}`}
            >
              {project.status}
            </span>

          </div>

        </div>

        {/* PROJECT INFORMATION */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <h2 className="text-lg font-semibold">
              Project Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Details about this project.
            </p>

          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}

            <div>

              <p className="text-sm text-slate-500 mb-2">
                Project Name
              </p>

              <p className="font-medium">
                {project.name}
              </p>

            </div>

            {/* Status */}

            <div>

              <p className="text-sm text-slate-500 mb-2">
                Status
              </p>

              <p className="font-medium capitalize">
                {project.status}
              </p>

            </div>

            {/* Created By */}

            <div>

              <p className="text-sm text-slate-500 mb-2">
                Created By
              </p>

              <p className="font-medium">
                {project.createdBy?.name ||
                  "Unknown"}
              </p>

            </div>

            {/* Creator Email */}

            <div>

              <p className="text-sm text-slate-500 mb-2">
                Creator Email
              </p>

              <p className="font-medium break-all">
                {project.createdBy?.email ||
                  "Not available"}
              </p>

            </div>

            {/* Created Date */}

            <div>

              <p className="text-sm text-slate-500 mb-2">
                Created
              </p>

              <p className="font-medium">
                {project.createdAt
                  ? new Date(
                      project.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>

            {/* Updated Date */}

            <div>

              <p className="text-sm text-slate-500 mb-2">
                Last Updated
              </p>

              <p className="font-medium">
                {project.updatedAt
                  ? new Date(
                      project.updatedAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>

          </div>

        </section>

        {/* DESCRIPTION */}

        <section className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-800">

            <h2 className="text-lg font-semibold">
              Description
            </h2>

          </div>

          <div className="p-6">

            <p className="text-slate-400 leading-7">
              {project.description ||
                "No description provided."}
            </p>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="flex gap-3 mt-6">

          <button
            onClick={() => navigate("/projects")}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            ← Back to Projects
          </button>

        </div>

      </main>

    </div>
  );
};

export default ProjectDetails;
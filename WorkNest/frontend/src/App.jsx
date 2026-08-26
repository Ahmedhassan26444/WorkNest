import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateOrganization from "./pages/CreateOrganization";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Team from "./pages/Team";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Organization onboarding */}
        <Route
          path="/create-organization"
          element={<CreateOrganization />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* Projects */}
        <Route
          path="/projects"
          element={<Projects />}
        />

        {/* Project Details */}
        <Route
          path="/projects/:id"
          element={<ProjectDetails />}
        />

        {/* Tasks */}
        <Route
          path="/tasks"
          element={<Tasks />}
        />

        {/* Task Details */}
        <Route
          path="/tasks/:id"
          element={<TaskDetails />}
        />

        {/* Team  */}

        <Route path="/team" element={<Team />} />

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


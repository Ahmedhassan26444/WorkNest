import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateOrganization from "./pages/CreateOrganization";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Organization onboarding */}
        <Route
          path="/create-organization"
          element={<CreateOrganization />}
        />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
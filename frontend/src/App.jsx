import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import GroupManagement from "./pages/GroupManagement";
import UserManagement from "./pages/UserManagement";
import ManagerPanel from "./pages/ManagerPanel";
import UserPanel from "./pages/UserPanel";
import LearnerLicensePage from "./pages/LearnerLicensePage";
import DrivingLicensePage from "./pages/DrivingLicensePage";
import CitizenPage from "./pages/CitizenPage";
import VehiclePage from "./pages/VehiclePage"; // This should be imported
import VehicleDocumentsPage from "./pages/VehicleDocumentsPage";
import ReportPage from "./pages/ReportPage";
import WorkTakenPage from "./pages/WorkTakenPage";
import ApiTestPage from "./pages/ApiTestPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- CORE ROUTES --- */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={["admin"]}><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/groups" element={<ProtectedRoute allowedRoles={["admin"]}><GroupManagement /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><UserManagement /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute allowedRoles={["group_manager"]}><ManagerPanel /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute allowedRoles={["user", "group_manager", "admin"]}><UserPanel /></ProtectedRoute>} />
        <Route path="/apitest" element={<ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}><ApiTestPage /></ProtectedRoute>} />

        {/* --- APPLICATION ROUTES --- */}
        <Route path="/licenses" element={<ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}><LearnerLicensePage /></ProtectedRoute>} />
        <Route path="/driving-licenses" element={<ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}><DrivingLicensePage /></ProtectedRoute>} />
        <Route path="/citizens" element={<ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}><CitizenPage /></ProtectedRoute>} />

        {/* This route is now correctly used */}
        <Route path="/citizens/:citizenId/vehicles" element={<ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}><VehiclePage /></ProtectedRoute>} />

        <Route path="/vehicles/:vehicleId/documents" element={<ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}><VehicleDocumentsPage /></ProtectedRoute>} />
        <Route path="/work-taken" element={<ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}><WorkTakenPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}><ReportPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

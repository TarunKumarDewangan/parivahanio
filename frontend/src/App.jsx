import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import VehiclePage from "./pages/VehiclePage";
import VehicleDocumentsPage from "./pages/VehicleDocumentsPage";
import ReportPage from "./pages/ReportPage";
import WorkTakenPage from "./pages/WorkTakenPage";
import ApiTestPage from "./pages/ApiTestPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import "./App.css";

// Dashboard redirect component based on user role
const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'group_manager':
      return <Navigate to="/manager" replace />;
    case 'user':
      return <Navigate to="/user" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* --- DASHBOARD REDIRECT --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* --- ADMIN ROUTES --- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/groups"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <GroupManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* --- OTHER ROUTES --- */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["group_manager"]}>
                <ManagerPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["user", "group_manager", "admin"]}>
                <UserPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/licenses"
            element={
              <ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}>
                <LearnerLicensePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driving-licenses"
            element={
              <ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}>
                <DrivingLicensePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizens"
            element={
              <ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}>
                <CitizenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizens/:citizenId/vehicles"
            element={
              <ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}>
                <VehiclePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/:vehicleId/documents"
            element={
              <ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}>
                <VehicleDocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/work-taken"
            element={
              <ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}>
                <WorkTakenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}>
                <ReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apitest"
            element={
              <ProtectedRoute allowedRoles={["admin", "group_manager", "user"]}>
                <ApiTestPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

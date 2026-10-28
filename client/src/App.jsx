import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import AccessDeniedPage from './pages/public/AccessDeniedPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Farmer Pages
import FarmerDashboardPage from './pages/farmer/FarmerDashboardPage';
import NewReportPage from './pages/farmer/NewReportPage';
import FarmerReportsPage from './pages/farmer/FarmerReportsPage';
import ReportDetailPage from './pages/farmer/ReportDetailPage';
import AdvisoryPdfPage from './pages/farmer/AdvisoryPdfPage';
import FarmProfilePage from './pages/farmer/FarmProfilePage';

// Expert Pages
import ExpertDashboardPage from './pages/expert/ExpertDashboardPage';
import AssignedCasesPage from './pages/expert/AssignedCasesPage';
import CaseDetailPage from './pages/expert/CaseDetailPage';
import SimilarSolvedPage from './pages/expert/SimilarSolvedPage';
import ExpertProfilePage from './pages/expert/ExpertProfilePage';
import FieldInspectionPage from './pages/expert/FieldInspectionPage';
import FormularyPage from './pages/expert/FormularyPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AllReportsPage from './pages/admin/AllReportsPage';
import UnassignedReportsPage from './pages/admin/UnassignedReportsPage';
import AssignExpertPage from './pages/admin/AssignExpertPage';
import FarmerManagementPage from './pages/admin/FarmerManagementPage';
import ExpertManagementPage from './pages/admin/ExpertManagementPage';
import CropManagementPage from './pages/admin/CropManagementPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SystemActivityPage from './pages/admin/SystemActivityPage';
import AdminTriagePage from './pages/admin/AdminTriagePage';

// Universal Pages
import NotificationsPage from './pages/universal/NotificationsPage';
import NotificationDetailPage from './pages/universal/NotificationDetailPage';
import AccountSettingsPage from './pages/universal/AccountSettingsPage';
import EdgeDiagnosticsPage from './pages/universal/EdgeDiagnosticsPage';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-pale-green/30 text-slate-800">
            <Navbar />
            <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/formulary" element={<FormularyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/access-denied" element={<AccessDeniedPage />} />

              {/* Farmer Routes */}
              <Route
                path="/farmer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmerDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/new-report"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <NewReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/reports"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmerReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/reports/:id"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <ReportDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/:id"
                element={
                  <ProtectedRoute>
                    <ReportDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/:id/advisory"
                element={
                  <ProtectedRoute>
                    <AdvisoryPdfPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/profile"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/farm-profile"
                element={
                  <ProtectedRoute allowedRoles={['FARMER']}>
                    <FarmProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Agriculture Expert Routes */}
              <Route
                path="/expert/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['EXPERT']}>
                    <ExpertDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expert/cases"
                element={
                  <ProtectedRoute allowedRoles={['EXPERT']}>
                    <AssignedCasesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expert/cases/:id"
                element={
                  <ProtectedRoute allowedRoles={['EXPERT']}>
                    <CaseDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expert/similar"
                element={
                  <ProtectedRoute allowedRoles={['EXPERT']}>
                    <SimilarSolvedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expert/profile"
                element={
                  <ProtectedRoute allowedRoles={['EXPERT']}>
                    <ExpertProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expert/inspection"
                element={
                  <ProtectedRoute allowedRoles={['EXPERT']}>
                    <FieldInspectionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expert/formulary"
                element={
                  <ProtectedRoute allowedRoles={['FARMER', 'EXPERT', 'ADMIN']}>
                    <FormularyPage />
                  </ProtectedRoute>
                }
              />

              {/* Administrator Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AllReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/unassigned"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <UnassignedReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/assign/:id"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AssignExpertPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/farmers"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <FarmerManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/experts"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <ExpertManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/crops"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CropManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <CategoryManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/activity"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <SystemActivityPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/triage"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminTriagePage />
                  </ProtectedRoute>
                }
              />

              {/* Universal Authenticated Routes */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications/:id"
                element={
                  <ProtectedRoute>
                    <NotificationDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AccountSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diagnostics"
                element={<EdgeDiagnosticsPage />}
              />
              <Route
                path="/edge-diagnostics"
                element={<EdgeDiagnosticsPage />}
              />
              <Route
                path="/settings/edge-diagnostics"
                element={<EdgeDiagnosticsPage />}
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    </LanguageProvider>
  );
}

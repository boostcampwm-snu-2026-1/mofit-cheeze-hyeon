import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { SignupVerifyPage } from "../pages/SignupVerifyPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { OnboardingModelPage } from "../pages/OnboardingModelPage";
import { OnboardingDesignerPage } from "../pages/OnboardingDesignerPage";
import { DiscoverPage } from "../pages/DiscoverPage";
import { DesignerDetailPage } from "../pages/DesignerDetailPage";
import { MatchingInboxPage } from "../pages/MatchingInboxPage";
import { SchedulePage } from "../pages/SchedulePage";
import { ChatRoomPage } from "../pages/ChatRoomPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ProfileEditPage } from "../pages/ProfileEditPage";
import { PortfolioPage } from "../pages/PortfolioPage";
import { PortfolioEditPage } from "../pages/PortfolioEditPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { DesignSystemPage } from "../pages/DesignSystemPage";
import { ComponentsPage } from "../pages/ComponentsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <p className="font-sans text-sm text-muted">로딩 중…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function DesignerOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (user?.role !== "designer") return <Navigate to="/discover" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/verify" element={<SignupVerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Onboarding (requires auth) */}
      <Route
        path="/onboarding/model"
        element={
          <ProtectedRoute>
            <OnboardingModelPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/designer"
        element={
          <ProtectedRoute>
            <OnboardingDesignerPage />
          </ProtectedRoute>
        }
      />

      {/* App (requires auth) */}
      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <DiscoverPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/designers/:id"
        element={
          <ProtectedRoute>
            <DesignerDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/matching/inbox"
        element={
          <ProtectedRoute>
            <MatchingInboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <SchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:roomId"
        element={
          <ProtectedRoute>
            <ChatRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
        }
      />

      {/* Designer only */}
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <DesignerOnly>
              <PortfolioPage />
            </DesignerOnly>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio/new"
        element={
          <ProtectedRoute>
            <DesignerOnly>
              <PortfolioEditPage />
            </DesignerOnly>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio/:id/edit"
        element={
          <ProtectedRoute>
            <DesignerOnly>
              <PortfolioEditPage />
            </DesignerOnly>
          </ProtectedRoute>
        }
      />

      {/* Dev */}
      <Route path="/design-system" element={<DesignSystemPage />} />
      <Route path="/components" element={<ComponentsPage />} />

      <Route path="*" element={<Navigate to="/discover" replace />} />
    </Routes>
  );
}

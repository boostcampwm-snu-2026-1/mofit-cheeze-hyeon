import { Routes, Route, Navigate } from "react-router-dom";

import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { DiscoverPage } from "../pages/DiscoverPage";
import { DesignerDetailPage } from "../pages/DesignerDetailPage";
import { MatchingInboxPage } from "../pages/MatchingInboxPage";
import { SchedulePage } from "../pages/SchedulePage";
import { ChatRoomPage } from "../pages/ChatRoomPage";
import { ProfilePage } from "../pages/ProfilePage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { DesignSystemPage } from "../pages/DesignSystemPage";
import { ComponentsPage } from "../pages/ComponentsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/designers/:id" element={<DesignerDetailPage />} />
      <Route path="/matching/inbox" element={<MatchingInboxPage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/chat/:roomId" element={<ChatRoomPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/design-system" element={<DesignSystemPage />} />
      <Route path="/components" element={<ComponentsPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

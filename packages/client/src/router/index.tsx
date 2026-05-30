import { Routes, Route, Navigate } from "react-router-dom";

// Auth
const LoginPage = () => <div className="p-4">로그인</div>;
const SignupPage = () => <div className="p-4">회원가입</div>;

// Model
const DiscoverPage = () => <div className="p-4">디자이너 탐색</div>;
const DesignerDetailPage = () => <div className="p-4">디자이너 상세</div>;

// Designer
const MatchingInboxPage = () => <div className="p-4">매칭 신청함</div>;
const SchedulePage = () => <div className="p-4">스케줄 관리</div>;

// Shared
const ChatRoomPage = () => <div className="p-4">채팅</div>;
const ProfilePage = () => <div className="p-4">프로필</div>;
const NotificationsPage = () => <div className="p-4">알림</div>;

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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

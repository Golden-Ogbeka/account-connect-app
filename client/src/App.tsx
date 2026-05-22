import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { FollowingPage } from './pages/FollowingPage';
import { LoginPage } from './pages/LoginPage';
import { PeoplePage } from './pages/PeoplePage';
import { TransactionsPage } from './pages/TransactionsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/following" element={<FollowingPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

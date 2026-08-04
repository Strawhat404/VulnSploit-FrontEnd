import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

import Navbar         from './components/Navbar';
import Sidebar        from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { BASE_URL } from './lib/axios';

import Landing      from './pages/Landing';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import NewScan      from './pages/NewScan';
import ScanDetail   from './pages/ScanDetail';
import History      from './pages/History';
import Targets      from './pages/Targets';
import Settings     from './pages/Settings';
import ScheduledScans from './pages/ScheduledScans';
import FullRecon    from './pages/FullRecon';
import ReconDetail  from './pages/ReconDetail';
import Reports      from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import NotFound     from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10_000,
    },
  },
});

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-theme-base">
      {/* Left sidebar — fixed, always visible on desktop */}
      <Sidebar />

      {/* Right: top navbar + page content */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <Navbar />
        {/* pt-16 to clear the fixed top navbar */}
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}

function P({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(
          `${BASE_URL}/api/token/refresh/`,
          {},
          { withCredentials: true },
        );
        useAuthStore.getState().setTokens(res.data.access);
      } catch {
        // Not logged in — that's fine
      }
    })();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Protected ── */}
          <Route path="/dashboard"    element={<P><Dashboard /></P>} />
          <Route path="/targets"      element={<P><Targets /></P>} />
          <Route path="/scan"         element={<P><NewScan /></P>} />
          <Route path="/scans/:id"    element={<P><ScanDetail /></P>} />
          <Route path="/history"      element={<P><History /></P>} />
          <Route path="/recon/new"    element={<P><FullRecon /></P>} />
          <Route path="/recon/:id"    element={<P><ReconDetail /></P>} />
          <Route path="/reports"      element={<P><Reports /></P>} />
          <Route path="/reports/:id"  element={<P><ReportDetail /></P>} />
          <Route path="/settings"    element={<P><Settings /></P>} />
          <Route path="/schedule"    element={<P><ScheduledScans /></P>} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

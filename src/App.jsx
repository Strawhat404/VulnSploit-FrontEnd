import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing    from './pages/Landing';
import Login      from './pages/Login';
import Dashboard  from './pages/Dashboard';
import NewScan    from './pages/NewScan';
import ScanDetail from './pages/ScanDetail';
import History    from './pages/History';
import NotFound   from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10_000,
    },
  },
});

// Wrap authenticated pages with the persistent navbar
function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"      element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* ── Protected (with navbar) ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout><Dashboard /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <AppLayout><NewScan /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/scans/:id"
            element={
              <ProtectedRoute>
                <AppLayout><ScanDetail /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppLayout><History /></AppLayout>
              </ProtectedRoute>
            }
          />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

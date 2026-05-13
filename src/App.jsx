import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Navbar         from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing      from './pages/Landing';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import NewScan      from './pages/NewScan';
import ScanDetail   from './pages/ScanDetail';
import History      from './pages/History';
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
    <>
      <Navbar />
      {children}
    </>
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
          <Route path="/scan"         element={<P><NewScan /></P>} />
          <Route path="/scans/:id"    element={<P><ScanDetail /></P>} />
          <Route path="/history"      element={<P><History /></P>} />
          <Route path="/recon/new"    element={<P><FullRecon /></P>} />
          <Route path="/recon/:id"    element={<P><ReconDetail /></P>} />
          <Route path="/reports"      element={<P><Reports /></P>} />
          <Route path="/reports/:id"  element={<P><ReportDetail /></P>} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

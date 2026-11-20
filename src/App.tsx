import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ComingSoon from './components/ComingSoon';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Certificates from './pages/Certificates';
import Grievances from './pages/Grievances';
import PropertyTax from './pages/PropertyTax';
import Tracking from './pages/Tracking';
import Appointments from './pages/Appointments';
import { NAV_ITEMS } from './data/navigation';

// Register finished pages here; every other nav item falls back to ComingSoon.
const PAGES: Record<string, JSX.Element> = {
  '/dashboard': <Dashboard />,
  '/citizen/certificates': <Certificates />,
  '/citizen/grievances': <Grievances />,
  '/citizen/tax': <PropertyTax />,
  '/track': <Tracking />,
  '/citizen/appointments': <Appointments />,
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        {NAV_ITEMS.map((n) => (
          <Route key={n.path} path={n.path} element={PAGES[n.path] ?? <ComingSoon path={n.path} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

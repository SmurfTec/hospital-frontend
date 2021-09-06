// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import './App.css';
import UseAlan from 'components/_dashboard/app/useAlan';
import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <Router />
      <UseAlan />
    </ThemeConfig>
  );
}

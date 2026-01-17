import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
const Home = React.lazy(() => import('./components/Home'));
const Projects = React.lazy(() => import('./components/Projects'));
const Admin = React.lazy(() => import('./components/Admin'));
const Contact = React.lazy(() => import('./components/Contact'));
const About = React.lazy(() => import('./components/About'));
const ProjectPage = React.lazy(() => import('./components/ProjectPage'));
import Preloader from './components/Preloader';

// Loading fallback for route transitions
const PageLoader = () => (
  <div style={{
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0f0f11',
    color: '#646cff'
  }}>
    Loading...
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading experience
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // 2.5s duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/workspace-secret-99" element={<Admin />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;

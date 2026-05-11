import { Routes, Route, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LessonPage } from './pages/LessonPage';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lessons" element={<Navigate to="/" replace />} />
        <Route path="/lessons/:slug" element={<LessonPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

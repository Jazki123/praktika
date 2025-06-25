import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrepodsPage from './pages/PrepodsPage';
import CoursesPage from './pages/CoursesPage';
import ReviewsPage from './pages/ReviewsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/prepods" element={<PrepodsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="*" element={<Navigate to="/prepods" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
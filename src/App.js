import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import MainLayout from './pages/MainLayout';
import CompanyProfile from './pages/CompanyProfile';
import CompanyProfileList from './pages/CompanyProfileList';
import PersonalProfile from './pages/PersonalProfile';
import VisionMissionCore from './pages/VisionMissionCore';
import Goals from './pages/Goals';
import Dashboard from './pages/Dashboard';
import AuthForm from './pages/AuthForm';
import CompanyProfileView from './pages/CompanyProfileView';


const isAuthenticated = () => !!localStorage.getItem('token');

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<AuthForm />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="/" element={<Navigate to="/signup" replace />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="company-profile" element={<CompanyProfileList />} />
        <Route path="company-profile/add" element={<CompanyProfile />} />
        <Route path="company-profile/view/:id" element={<CompanyProfileView />} />
        <Route path="vision-mission-core" element={<VisionMissionCore />} />
        <Route path="goals" element={<Goals />} />
        <Route path="personal-profile" element={<PersonalProfile />} />
      </Route>
    </Routes>
  );
}

export default App;



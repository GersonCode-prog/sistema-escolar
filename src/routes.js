// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Alumnos from './components/Alumnos/Alumnos';
import Maestros from './components/Maestros/Maestros';
import Materias from './components/Materias/Materias';
import Notas from './components/Notas/Notas';
import Dashboard from './components/Dashboard/Dashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Dashboard>
        <Routes>
          <Route path="/alumnos" element={<Alumnos />} />
          <Route path="/maestros" element={<Maestros />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/notas" element={<Notas />} />
        </Routes>
      </Dashboard>
    </Router>
  );
};

export default AppRoutes;

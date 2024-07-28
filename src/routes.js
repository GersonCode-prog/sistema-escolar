import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Alumnos from './components/Alumnos/Alumnos';
import Maestros from './components/Maestros/Maestros';
import Materias from './components/Materias/Materias';
import Notas from './components/Notas/Notas';
import Inicio from './components/Inicio/Inicio';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Horarios from './components/Horarios/Horarios';
import Asistencia from './components/Asistencia/Asistencia';
import Eventos from './components/Eventos/Eventos';
import ProtectedRoute from './ProtectedRoute'; // Importa el componente ProtectedRoute

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route 
      path="/" 
      element={<ProtectedRoute element={<Dashboard />} />} 
    >
      <Route path="inicio" element={<Inicio />} />
      <Route path="alumnos" element={<Alumnos />} />
      <Route path="maestros" element={<Maestros />} />
      <Route path="materias" element={<Materias />} />
      <Route path="notas" element={<Notas />} />
      <Route path="eventos" element={<Eventos />} />
      <Route path="horarios" element={<Horarios />} />
      <Route path="asistencia" element={<Asistencia />} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;

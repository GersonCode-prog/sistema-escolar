import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Alumnos from './components/Alumnos/Alumnos';
import Maestros from './components/Maestros/Maestros';
import Materias from './components/Materias/Materias';
import Notas from './components/Notas/Notas';
import Inicio from './components/Inicio/Inicio';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ element }) => {
  const auth = getAuth();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element;
};

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
    </Route>
    <Route path="*" element={<Navigate to="/inicio" />} />
  </Routes>
);

export default AppRoutes;

import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Importamos el archivo de estilos CSS

const Dashboard = ({ children }) => {
  return (
    <div className="dashboard">
      <nav className="nav">
        <ul>
          <li><Link to="/alumnos">Alumnos</Link></li>
          <li><Link to="/maestros">Maestros</Link></li>
          <li><Link to="/materias">Materias</Link></li>
          <li><Link to="/notas">Notas</Link></li>
        </ul>
      </nav>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChalkboardTeacher, faBook, faClipboardList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css'; // Importamos el archivo de estilos CSS

const Dashboard = ({ children }) => {
  return (
    <div className="dashboard">
      <nav className="nav">
        <ul className="nav-list">
          <li><Link to="/alumnos"><FontAwesomeIcon icon={faUsers} /> Alumnos</Link></li>
          <li><Link to="/maestros"><FontAwesomeIcon icon={faChalkboardTeacher} /> Maestros</Link></li>
          <li><Link to="/materias"><FontAwesomeIcon icon={faBook} /> Materias</Link></li>
          <li><Link to="/notas"><FontAwesomeIcon icon={faClipboardList} /> Notas</Link></li>
          {/* Opción para cerrar sesión */}
          <li className="logout"><Link to="/logout"><FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión</Link></li>
        </ul>
      </nav>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Dashboard;

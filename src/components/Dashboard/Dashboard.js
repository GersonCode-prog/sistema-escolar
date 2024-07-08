import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChalkboardTeacher, faBook, faClipboardList, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css'; // Importamos el archivo de estilos CSS

const Dashboard = () => {
  return (
    <div className="dashboard">
      <nav className="nav">
        <ul className="nav-list">
          <li><Link to="/inicio"><FontAwesomeIcon icon={faHome} /> Inicio</Link></li>
          <li><Link to="/alumnos"><FontAwesomeIcon icon={faUsers} /> Alumnos</Link></li>
          <li><Link to="/maestros"><FontAwesomeIcon icon={faChalkboardTeacher} /> Maestros</Link></li>
          <li><Link to="/materias"><FontAwesomeIcon icon={faBook} /> Materias</Link></li>
          <li><Link to="/notas"><FontAwesomeIcon icon={faClipboardList} /> Notas</Link></li>
          {/* Opción para cerrar sesión */}
          <li className="logout"><Link to="/logout"><FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión</Link></li>
        </ul>
      </nav>
      <div className="content">
        <Outlet /> {/* Aquí se renderizarán las rutas anidadas */}
      </div>
    </div>
  );
};

export default Dashboard;

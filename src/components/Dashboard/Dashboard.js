import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChalkboardTeacher, faBook, faClipboardList, faSignOutAlt, faHome, faCalendarAlt, faClock, faUsersCog } from '@fortawesome/free-solid-svg-icons'; // Asegúrate de importar los iconos necesarios
import './Dashboard.css';
import { logout } from '../CerrarSeccion/auth';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="nav">
        <ul className="nav-list">
          <li><Link to="/inicio"><FontAwesomeIcon icon={faHome} /> Inicio</Link></li>
          <li><Link to="/alumnos"><FontAwesomeIcon icon={faUsers} /> Alumnos</Link></li>
          <li><Link to="/maestros"><FontAwesomeIcon icon={faChalkboardTeacher} /> Maestros</Link></li>
          <li><Link to="/materias"><FontAwesomeIcon icon={faBook} /> Materias</Link></li>
          <li><Link to="/notas"><FontAwesomeIcon icon={faClipboardList} /> Notas</Link></li>
          <li><Link to="/eventos"><FontAwesomeIcon icon={faCalendarAlt} /> Eventos</Link></li>
          <li><Link to="/asistencia"><FontAwesomeIcon icon={faClock} /> Asistencia</Link></li>
          <li><Link to="/horarios"><FontAwesomeIcon icon={faUsersCog} /> Horarios</Link></li>
          <li className="logout">
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

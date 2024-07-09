import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom'; // Asegúrate de importar Outlet
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChalkboardTeacher, faBook, faClipboardList, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css'; // Importamos el archivo de estilos CSS
import { logout } from '../CerrarSeccion/auth'; // Importa la función de cierre de sesión

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Redirigir al login después de cerrar sesión
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
          <li className="logout">
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
      <div className="content">
        <Outlet /> {/* Aquí se renderizarán las rutas anidadas */}
      </div>
    </div>
  );
};

export default Dashboard;

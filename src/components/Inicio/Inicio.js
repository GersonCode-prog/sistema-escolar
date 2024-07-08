// src/components/Inicio/Inicio.js
import React, { useState, useEffect } from 'react';
import './Inicio.css';
import logo from '../../assets/escolar.jpg'; // Asegúrate de que esta ruta es correcta

const Inicio = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inicio-container">
      <img src={logo} alt="Logo del Sistema Escolar" className="logo" />
      <h1>Bienvenido al Sistema Escolar</h1>
      <p>Utilice el menú de la izquierda para navegar por el sistema.</p>
      <div className="reloj">
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Inicio;

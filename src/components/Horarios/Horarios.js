import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Horarios.css';

const Horarios = () => {
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    const fetchHorarios = async () => {
      const eventosCollection = collection(db, 'eventos');
      const eventosSnapshot = await getDocs(eventosCollection);
      const eventosList = eventosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHorarios(eventosList);
    };

    fetchHorarios();
  }, []);

  return (
    <div className="horarios-container">
      <h2>Horarios de Eventos</h2>
      <table className="horarios-table">
        <thead>
          <tr>
            <th>Nombre del Evento</th>
            <th>Fecha</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {horarios.map((evento) => (
            <tr key={evento.id}>
              <td>{evento.nombre}</td>
              <td>{new Date(evento.fecha).toLocaleDateString()}</td>
              <td>{evento.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Horarios;

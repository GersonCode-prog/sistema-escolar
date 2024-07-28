import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase'; // Ajusta la ruta según sea necesario
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './Asistencia.css';

const Asistencia = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [selectedAlumno, setSelectedAlumno] = useState('');
  const [estado, setEstado] = useState('Presente');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha de hoy

  useEffect(() => {
    fetchAlumnos();
    fetchAsistencias();
  }, []);

  const fetchAlumnos = async () => {
    const alumnosCollection = collection(db, 'alumnos');
    const alumnosSnapshot = await getDocs(alumnosCollection);
    const alumnosList = alumnosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAlumnos(alumnosList);
  };

  const fetchAsistencias = async () => {
    const asistenciasCollection = collection(db, 'asistencia');
    const asistenciasSnapshot = await getDocs(asistenciasCollection);
    const asistenciasList = asistenciasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAsistencias(asistenciasList);
  };

  const registrarAsistencia = async (e) => {
    e.preventDefault();
    if (selectedAlumno) {
      const asistenciaData = {
        alumnoId: selectedAlumno,
        fecha,
        estado
      };
      await addDoc(collection(db, 'asistencia'), asistenciaData);
      fetchAsistencias();
      alert('Asistencia registrada');
    }
  };

  return (
    <div className="container">
      <h1>Asistencia</h1>
      <form onSubmit={registrarAsistencia} className="form">
        <div className="form-group">
          <label htmlFor="alumno">Alumno:</label>
          <select
            id="alumno"
            value={selectedAlumno}
            onChange={(e) => setSelectedAlumno(e.target.value)}
          >
            <option value="">Seleccione un alumno</option>
            {alumnos.map(alumno => (
              <option key={alumno.id} value={alumno.id}>{alumno.nombre} {alumno.apellido}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="Presente">Presente</option>
            <option value="Ausente">Ausente</option>
          </select>
        </div>
        <button type="submit" className="btn-save">Registrar Asistencia</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map(asistencia => {
            const alumno = alumnos.find(al => al.id === asistencia.alumnoId);
            return (
              <tr key={asistencia.id}>
                <td>{alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Desconocido'}</td>
                <td>{asistencia.fecha}</td>
                <td>{asistencia.estado}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Asistencia;

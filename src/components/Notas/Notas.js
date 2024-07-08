import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import './Notas.css';

const Notas = () => {
  const [notas, setNotas] = useState([]);
  const [materia, setMateria] = useState('');
  const [calificacion, setCalificacion] = useState('');
  const [alumno, setAlumno] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNotaId, setCurrentNotaId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchAlumnos();
    fetchMaterias();
  }, []);

  const fetchData = async () => {
    const notasCollection = collection(db, 'notas');
    const notasSnapshot = await getDocs(notasCollection);
    const notasList = notasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotas(notasList);
  };

  const fetchAlumnos = async () => {
    const alumnosCollection = collection(db, 'alumnos');
    const alumnosSnapshot = await getDocs(alumnosCollection);
    const alumnosList = alumnosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAlumnos(alumnosList);
  };

  const fetchMaterias = async () => {
    const materiasCollection = collection(db, 'materias');
    const materiasSnapshot = await getDocs(materiasCollection);
    const materiasList = materiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMaterias(materiasList);
  };

  const addNota = async (e) => {
    e.preventDefault();
    if (materia.trim() !== '' && calificacion.trim() !== '' && alumno.trim() !== '') {
      await addDoc(collection(db, 'notas'), { materia, calificacion, alumno });
      clearForm();
      setShowModal(false);
      fetchData();
    }
  };

  const updateNota = async (e) => {
    e.preventDefault();
    if (materia.trim() !== '' && calificacion.trim() !== '' && alumno.trim() !== '') {
      await updateDoc(doc(db, 'notas', currentNotaId), { materia, calificacion, alumno });
      clearForm();
      setShowModal(false);
      fetchData();
    }
  };

  const deleteNota = async (id) => {
    await deleteDoc(doc(db, 'notas', id));
    setNotas(notas.filter(nota => nota.id !== id));
  };

  const openModal = (nota = null) => {
    if (nota) {
      setMateria(nota.materia);
      setCalificacion(nota.calificacion);
      setAlumno(nota.alumno);
      setEditMode(true);
      setCurrentNotaId(nota.id);
    } else {
      clearForm();
      setEditMode(false);
    }
    setShowModal(true);
  };

  const clearForm = () => {
    setMateria('');
    setCalificacion('');
    setAlumno('');
    setCurrentNotaId(null);
  };

  return (
    <div className="container">
      <h1>Notas</h1>
      <button className="btn-agregar" onClick={() => openModal()}>Agregar Nota</button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={() => { setShowModal(false); clearForm(); }}>&times;</span>
            <h2>{editMode ? 'Editar Nota' : 'Agregar Nota'}</h2>
            <form onSubmit={editMode ? updateNota : addNota} className="form">
              <div className="form-group">
                <label htmlFor="alumno">Alumno:</label>
                <select
                  id="alumno"
                  value={alumno}
                  onChange={(e) => setAlumno(e.target.value)}
                >
                  <option value="">Seleccione un alumno</option>
                  {alumnos.map((alumno) => (
                    <option key={alumno.id} value={`${alumno.nombre} ${alumno.apellido} (${alumno.grado})`}>
                      {alumno.nombre} {alumno.apellido} - {alumno.grado}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="materia">Materia:</label>
                <select
                  id="materia"
                  value={materia}
                  onChange={(e) => setMateria(e.target.value)}
                >
                  <option value="">Seleccione una materia</option>
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.nombre}>
                      {materia.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="calificacion">Calificación:</label>
                <input
                  type="text"
                  id="calificacion"
                  value={calificacion}
                  onChange={(e) => setCalificacion(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-save">{editMode ? 'Guardar Cambios' : 'Agregar Nota'}</button>
              <button type="button" className="btn-cancel" onClick={() => { setShowModal(false); clearForm(); }}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
      <div className="results-container">
        <h2>Lista de Notas</h2>
        <table className="notas-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Materia</th>
              <th>Calificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((nota) => (
              <tr key={nota.id}>
                <td>{nota.alumno}</td>
                <td>{nota.materia}</td>
                <td>{nota.calificacion}</td>
                <td>
                  <button className="btn-editar" onClick={() => openModal(nota)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn-eliminar" onClick={() => deleteNota(nota.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notas;

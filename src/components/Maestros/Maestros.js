import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import './Maestros.css';

// Establecer el elemento root para el modal
Modal.setAppElement('#root');

const Maestros = () => {
  const [maestros, setMaestros] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [grado, setGrado] = useState('');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [materias, setMaterias] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMaestroId, setCurrentMaestroId] = useState(null);

  const fetchData = async () => {
    const maestrosCollection = collection(db, 'maestros');
    const maestrosSnapshot = await getDocs(maestrosCollection);
    const maestrosList = maestrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMaestros(maestrosList);
  };

  const fetchMaterias = async () => {
    const materiasCollection = collection(db, 'materias');
    const materiasSnapshot = await getDocs(materiasCollection);
    const materiasList = materiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMaterias(materiasList);
  };

  useEffect(() => {
    fetchData();
    fetchMaterias();
  }, []);

  const addMaestro = async (e) => {
    e.preventDefault();
    if (nombre.trim() && apellido.trim() && grado.trim() && materiaSeleccionada.trim()) {
      await addDoc(collection(db, 'maestros'), { nombre, apellido, grado, materia: materiaSeleccionada });
      setNombre('');
      setApellido('');
      setGrado('');
      setMateriaSeleccionada('');
      fetchData();
      closeModal();
    }
  };

  const updateMaestro = async (e) => {
    e.preventDefault();
    if (nombre.trim() && apellido.trim() && grado.trim() && materiaSeleccionada.trim()) {
      await updateDoc(doc(db, 'maestros', currentMaestroId), { nombre, apellido, grado, materia: materiaSeleccionada });
      setNombre('');
      setApellido('');
      setGrado('');
      setMateriaSeleccionada('');
      fetchData();
      closeModal();
    }
  };

  const deleteMaestro = async (id) => {
    await deleteDoc(doc(db, 'maestros', id));
    setMaestros(maestros.filter(maestro => maestro.id !== id));
  };

  const openModal = (maestro = null) => {
    if (maestro) {
      setNombre(maestro.nombre);
      setApellido(maestro.apellido);
      setGrado(maestro.grado);
      setMateriaSeleccionada(maestro.materia);
      setEditMode(true);
      setCurrentMaestroId(maestro.id);
    } else {
      setNombre('');
      setApellido('');
      setGrado('');
      setMateriaSeleccionada('');
      setEditMode(false);
      setCurrentMaestroId(null);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="container">
      <h1>Maestros</h1>
      <button className="btn-add" onClick={() => openModal()}>Agregar Maestro</button>
      <h2>Lista de Profesores</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Grado</th>
            <th>Materia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {maestros.map((maestro) => (
            <tr key={maestro.id}>
              <td>{maestro.nombre}</td>
              <td>{maestro.apellido}</td>
              <td>{maestro.grado}</td>
              <td>{maestro.materia}</td>
              <td>
                <button className="btn-edit" onClick={() => openModal(maestro)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn-delete" onClick={() => deleteMaestro(maestro.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Agregar/Editar Maestro"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{editMode ? 'Editar Maestro' : 'Agregar Maestro'}</h2>
            <form onSubmit={editMode ? updateMaestro : addMaestro}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Apellido:</label>
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Grado:</label>
                <select
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                >
                  <option value="">Seleccione un grado</option>
                  <option value="primero">Primero</option>
                  <option value="segundo">Segundo</option>
                  <option value="tercero">Tercero</option>
                  <option value="cuarto">Cuarto</option>
                  <option value="quinto">Quinto</option>
                  <option value="sexto">Sexto</option>
                </select>
              </div>
              <div className="form-group">
                <label>Materia:</label>
                <select
                  value={materiaSeleccionada}
                  onChange={(e) => setMateriaSeleccionada(e.target.value)}
                >
                  <option value="">Seleccione una materia</option>
                  {materias.map(materia => (
                    <option key={materia.id} value={materia.nombre}>{materia.nombre}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-save">{editMode ? 'Guardar Cambios' : 'Agregar Maestro'}</button>
              <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Maestros;

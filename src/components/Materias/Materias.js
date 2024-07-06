import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import './Materias.css';

// Establecer el elemento root para el modal
Modal.setAppElement('#root');

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMateriaId, setCurrentMateriaId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const materiasCollection = collection(db, 'materias');
    const materiasSnapshot = await getDocs(materiasCollection);
    const materiasList = materiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMaterias(materiasList);
  };

  const addMateria = async (e) => {
    e.preventDefault();
    if (nombre.trim() !== '') {
      await addDoc(collection(db, 'materias'), { nombre });
      setNombre('');
      fetchData();
      closeModal();
    }
  };

  const deleteMateria = async (id) => {
    await deleteDoc(doc(db, 'materias', id));
    setMaterias(materias.filter(materia => materia.id !== id));
  };

  const openModal = (materia = null) => {
    if (materia) {
      setNombre(materia.nombre);
      setEditMode(true);
      setCurrentMateriaId(materia.id);
    } else {
      setNombre('');
      setEditMode(false);
      setCurrentMateriaId(null);
    }
    setModalIsOpen(true);
  };

  const updateMateria = async (e) => {
    e.preventDefault();
    if (nombre.trim() !== '') {
      await updateDoc(doc(db, 'materias', currentMateriaId), { nombre });
      setNombre('');
      fetchData();
      closeModal();
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="container">
      <h1>Materias</h1>
      <button className="btn-add" onClick={() => openModal()}>Agregar Materia</button>
      <h2>Lista de Materias</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.map((materia) => (
            <tr key={materia.id}>
              <td>{materia.nombre}</td>
              <td>
                <button className="btn-edit" onClick={() => openModal(materia)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn-delete" onClick={() => deleteMateria(materia.id)}>
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
        contentLabel={editMode ? "Editar Materia" : "Agregar Materia"}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{editMode ? 'Editar Materia' : 'Agregar Materia'}</h2>
        <form onSubmit={editMode ? updateMateria : addMateria}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-save">{editMode ? 'Guardar Cambios' : 'Agregar Materia'}</button>
          <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
        </form>
      </Modal>
    </div>
  );
};

export default Materias;

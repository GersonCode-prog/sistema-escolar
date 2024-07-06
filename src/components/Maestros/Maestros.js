import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import './Maestros.css'; // Estilo CSS compartido

// Establecer el elemento root para el modal
Modal.setAppElement('#root');

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [nombreMateria, setNombreMateria] = useState('');
  const [modalMateriaIsOpen, setModalMateriaIsOpen] = useState(false);
  const [editModeMateria, setEditModeMateria] = useState(false);
  const [currentMateriaId, setCurrentMateriaId] = useState(null);

  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      const materiasCollection = collection(db, 'materias');
      const materiasSnapshot = await getDocs(materiasCollection);
      const materiasList = materiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterias(materiasList);
    } catch (error) {
      console.error('Error fetching materias: ', error);
    }
  };

  const addMateria = async (e) => {
    e.preventDefault();
    if (nombreMateria.trim() !== '') {
      try {
        await addDoc(collection(db, 'materias'), { nombre: nombreMateria });
        setNombreMateria('');
        fetchMaterias();
        closeModal();
      } catch (error) {
        console.error('Error adding materia: ', error);
      }
    }
  };

  const updateMateria = async (e) => {
    e.preventDefault();
    if (nombreMateria.trim() !== '') {
      try {
        await updateDoc(doc(db, 'materias', currentMateriaId), { nombre: nombreMateria });
        setNombreMateria('');
        fetchMaterias();
        closeModal();
      } catch (error) {
        console.error('Error updating materia: ', error);
      }
    }
  };

  const deleteMateria = async (id) => {
    try {
      await deleteDoc(doc(db, 'materias', id));
      setMaterias(materias.filter(materia => materia.id !== id));
    } catch (error) {
      console.error('Error deleting materia: ', error);
    }
  };

  const openModal = (materia = null) => {
    if (materia) {
      setNombreMateria(materia.nombre);
      setEditModeMateria(true);
      setCurrentMateriaId(materia.id);
    } else {
      setNombreMateria('');
      setEditModeMateria(false);
    }
    setModalMateriaIsOpen(true);
  };

  const closeModal = () => {
    setModalMateriaIsOpen(false);
  };

  return (
    <div className="container">
      <h1>Materias</h1>
      <button className="btn-add" onClick={() => openModal()}>Agregar Materia</button>
      <h2>Lista de Materias</h2>
      <ul>
        {materias.map((materia) => (
          <li key={materia.id}>
            <span>{materia.nombre}</span>
            <button className="btn-edit" onClick={() => openModal(materia)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="btn-delete" onClick={() => deleteMateria(materia.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
      <Modal
        isOpen={modalMateriaIsOpen}
        onRequestClose={closeModal}
        contentLabel={editModeMateria ? "Editar Materia" : "Agregar Materia"}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{editModeMateria ? 'Editar Materia' : 'Agregar Materia'}</h2>
        <form onSubmit={editModeMateria ? updateMateria : addMateria}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombreMateria}
              onChange={(e) => setNombreMateria(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-save">{editModeMateria ? 'Guardar Cambios' : 'Agregar Materia'}</button>
          <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
        </form>
      </Modal>
    </div>
  );
};

export default Materias;

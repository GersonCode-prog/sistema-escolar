import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const materiasCollection = collection(db, 'materias');
      const materiasSnapshot = await getDocs(materiasCollection);
      const materiasList = materiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterias(materiasList);
    };

    fetchData();
  }, []);

  const addMateria = async (e) => {
    e.preventDefault();
    if (nombre.trim() !== '') {
      await addDoc(collection(db, 'materias'), { nombre });
      setNombre('');
      // Refresh the list of subjects
      const materiasCollection = collection(db, 'materias');
      const materiasSnapshot = await getDocs(materiasCollection);
      const materiasList = materiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterias(materiasList);
    }
  };

  const deleteMateria = async (id) => {
    await deleteDoc(doc(db, 'materias', id));
    setMaterias(materias.filter(materia => materia.id !== id));
  };

  return (
    <div className="container">
      <h1>Materias</h1>
      <form onSubmit={addMateria}>
        <input
          type="text"
          placeholder="Nombre de la materia"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button type="submit">Agregar Materia</button>
      </form>
      <ul>
        {materias.map((materia) => (
          <li key={materia.id}>
            <span>{materia.nombre}</span>
            <button className="delete-button" onClick={() => deleteMateria(materia.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Materias;

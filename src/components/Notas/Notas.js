import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Notas = () => {
  const [notas, setNotas] = useState([]);
  const [materia, setMateria] = useState('');
  const [calificacion, setCalificacion] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const notasCollection = collection(db, 'notas');
      const notasSnapshot = await getDocs(notasCollection);
      const notasList = notasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotas(notasList);
    };

    fetchData();
  }, []);

  const addNota = async (e) => {
    e.preventDefault();
    if (materia.trim() !== '' && calificacion.trim() !== '') {
      await addDoc(collection(db, 'notas'), { materia, calificacion });
      setMateria('');
      setCalificacion('');
      // Refresh the list of grades
      const notasCollection = collection(db, 'notas');
      const notasSnapshot = await getDocs(notasCollection);
      const notasList = notasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotas(notasList);
    }
  };

  const deleteNota = async (id) => {
    await deleteDoc(doc(db, 'notas', id));
    setNotas(notas.filter(nota => nota.id !== id));
  };

  return (
    <div className="container">
      <h1>Notas</h1>
      <form onSubmit={addNota}>
        <input
          type="text"
          placeholder="Nombre de la materia"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
        />
        <input
          type="text"
          placeholder="Calificación"
          value={calificacion}
          onChange={(e) => setCalificacion(e.target.value)}
        />
        <button type="submit">Agregar Nota</button>
      </form>
      <ul>
        {notas.map((nota) => (
          <li key={nota.id}>
            <span>{nota.materia}: {nota.calificacion}</span>
            <button className="delete-button" onClick={() => deleteNota(nota.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notas;

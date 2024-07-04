import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import './Maestros.css'; // Importamos el archivo de estilos CSS

const Maestros = () => {
  const [maestros, setMaestros] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [grado, setGrado] = useState('');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [materias, setMaterias] = useState([]);
  const [maestroSeleccionado, setMaestroSeleccionado] = useState(null);

  // Función para obtener los maestros de la base de datos
  const fetchData = async () => {
    const maestrosCollection = collection(db, 'maestros');
    const maestrosSnapshot = await getDocs(maestrosCollection);
    const maestrosList = maestrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMaestros(maestrosList);
  };

  useEffect(() => {
    fetchData(); // Llamamos a la función fetchData aquí
  }, []);

  const addMaestro = async (e) => {
    e.preventDefault();
    if (nombre.trim() !== '' && apellido.trim() !== '' && grado.trim() !== '' && materiaSeleccionada.trim() !== '') {
      await addDoc(collection(db, 'maestros'), { nombre, apellido, grado, materia: materiaSeleccionada });
      setNombre('');
      setApellido('');
      setGrado('');
      setMateriaSeleccionada('');
      fetchData(); // Actualizamos la lista de maestros después de agregar uno nuevo
    }
  };

  const deleteMaestro = async (id) => {
    await deleteDoc(doc(db, 'maestros', id));
    setMaestros(maestros.filter(maestro => maestro.id !== id));
  };

  const fetchMaterias = async () => {
    const materiasList = ["Español", "Matemáticas", "Ciencias", "Geografía de México y del Mundo", "Formación Cívica y Ética", "Educación Física", "Tutoría", "Tecnología"];
    setMaterias(materiasList);
  };

  useEffect(() => {
    fetchMaterias();
  }, []);

  const editarMaestro = (maestro) => {
    setMaestroSeleccionado(maestro);
    setNombre(maestro.nombre);
    setApellido(maestro.apellido);
    setGrado(maestro.grado);
    setMateriaSeleccionada(maestro.materia);
  };

  const guardarCambios = async () => {
    if (nombre.trim() !== '' && apellido.trim() !== '' && grado.trim() !== '' && materiaSeleccionada.trim() !== '') {
      await updateDoc(doc(db, 'maestros', maestroSeleccionado.id), { nombre, apellido, grado, materia: materiaSeleccionada });
      setNombre('');
      setApellido('');
      setGrado('');
      setMateriaSeleccionada('');
      setMaestroSeleccionado(null);
      fetchData(); // Actualizamos la lista de maestros después de editar uno
    }
  };

  return (
    <div className="container">
      <h1>Maestros</h1>
      <form onSubmit={maestroSeleccionado ? guardarCambios : addMaestro}>
        <input
          type="text"
          placeholder="Nombre del maestro"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido del maestro"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <input
          type="text"
          placeholder="Grado"
          value={grado}
          onChange={(e) => setGrado(e.target.value)}
        />
        <select
          value={materiaSeleccionada}
          onChange={(e) => setMateriaSeleccionada(e.target.value)}
        >
          <option value="">Selecciona una materia</option>
          {materias.map(materia => (
            <option key={materia} value={materia}>{materia}</option>
          ))}
        </select>
        {maestroSeleccionado ? (
          <button className="btn-edit" type="button" onClick={guardarCambios}>Guardar Cambios</button>
        ) : (
          <button className="btn-add" type="submit">Agregar Maestro</button>
        )}
      </form>
      <table>
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
                <button className="btn-edit" onClick={() => editarMaestro(maestro)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn-eliminar" onClick={() => deleteMaestro(maestro.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Maestros;

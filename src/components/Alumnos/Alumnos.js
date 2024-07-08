import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import './Alumnos.css';

const Alumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [edad, setEdad] = useState('');
  const [codigo, setCodigo] = useState('');
  const [foto, setFoto] = useState(null);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fotoEnGrande, setFotoEnGrande] = useState(null);
  const [grado, setGrado] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const alumnosCollection = collection(db, 'alumnos');
    const alumnosSnapshot = await getDocs(alumnosCollection);
    const alumnosList = alumnosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAlumnos(alumnosList);
  };

  const addAlumno = async (e) => {
    e.preventDefault();
    if (nombre.trim() !== '' && apellido.trim() !== '' && edad.trim() !== '' && codigo.trim() !== '' && grado.trim() !== '') {
      const alumnoData = { nombre, apellido, edad, codigo, grado };
      if (foto) {
        const storage = getStorage();
        const storageRef = ref(storage, foto.name);
        await uploadBytes(storageRef, foto);
        const fotoUrl = await getDownloadURL(storageRef);
        alumnoData.fotoUrl = fotoUrl;
      }
      await addDoc(collection(db, 'alumnos'), alumnoData);
      clearForm();
      setShowModal(false);
      fetchData();
    }
  };

  const handleFotoChange = (e) => {
    if (e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const deleteAlumno = async (id) => {
    await deleteDoc(doc(db, 'alumnos', id));
    setAlumnos(alumnos.filter(alumno => alumno.id !== id));
  };

  const editarAlumno = (id) => {
    const alumno = alumnos.find(a => a.id === id);
    setNombre(alumno.nombre);
    setApellido(alumno.apellido);
    setEdad(alumno.edad);
    setCodigo(alumno.codigo);
    setGrado(alumno.grado);
    setAlumnoSeleccionado(id);
    setShowModal(true);
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    if (alumnoSeleccionado) {
      const alumnoData = { nombre, apellido, edad, codigo, grado };
      if (foto) {
        const storage = getStorage();
        const storageRef = ref(storage, foto.name);
        await uploadBytes(storageRef, foto);
        const fotoUrl = await getDownloadURL(storageRef);
        alumnoData.fotoUrl = fotoUrl;
      }
      await updateDoc(doc(db, 'alumnos', alumnoSeleccionado), alumnoData);
      clearForm();
      setShowModal(false);
      fetchData();
    }
  };

  const clearForm = () => {
    setNombre('');
    setApellido('');
    setEdad('');
    setCodigo('');
    setFoto(null);
    setAlumnoSeleccionado(null);
    setGrado('');
  };

  const showFotoEnGrande = (url) => {
    setFotoEnGrande(url);
  };

  const closeFotoEnGrande = () => {
    setFotoEnGrande(null);
  };

  const grados = [
    'Primero',
    'Segundo',
    'Tercero',
    'Cuarto',
    'Quinto',
    'Sexto'
  ];

  return (
    <div className="container">
      <h1>Alumnos</h1>
      <button className="btn-agregar" onClick={() => setShowModal(true)}>Agregar Alumno</button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={() => { setShowModal(false); clearForm(); }}>&times;</span>
            <h2>{alumnoSeleccionado ? 'Editar Alumno' : 'Agregar Alumno'}</h2>
            <form onSubmit={alumnoSeleccionado ? guardarCambios : addAlumno} className="form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edad">Edad:</label>
                <input
                  type="number"
                  id="edad"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="codigo">Código:</label>
                <input
                  type="text"
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="grado">Grado:</label>
                <select
                  id="grado"
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                >
                  <option value="">Seleccione un grado</option>
                  {grados.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="foto">Foto:</label>
                <input
                  type="file"
                  id="foto"
                  accept="image/*"
                  onChange={handleFotoChange}
                />
              </div>
              <button type="submit" className="btn-save">{alumnoSeleccionado ? 'Guardar Cambios' : 'Agregar Alumno'}</button>
              <button type="button" className="btn-cancel" onClick={() => { setShowModal(false); clearForm(); }}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
      {fotoEnGrande && (
        <div className="foto-en-grande-overlay" onClick={() => closeFotoEnGrande()}>
          <div className="foto-en-grande-content">
            <span className="close" onClick={() => closeFotoEnGrande()}>&times;</span>
            <img src={fotoEnGrande} alt="Foto en grande" className="foto-en-grande-img" />
          </div>
        </div>
      )}
      <div className="results-container">
        <h2>Lista de Alumnos</h2>
        <table className="alumnos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Edad</th>
              <th>Código</th>
              <th>Grado</th>
              <th>Foto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td>{alumno.nombre}</td>
                <td>{alumno.apellido}</td>
                <td>{alumno.edad}</td>
                <td>{alumno.codigo}</td>
                <td>{alumno.grado}</td>
                <td>
                  {alumno.fotoUrl && (
                    <img
                      src={alumno.fotoUrl}
                      alt={`Foto de ${alumno.nombre}`}
                      className="foto-pequena"
                      onClick={() => showFotoEnGrande(alumno.fotoUrl)}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => editarAlumno(alumno.id)} className="btn-editar">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn-eliminar" onClick={() => deleteAlumno(alumno.id)}>
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

export default Alumnos;

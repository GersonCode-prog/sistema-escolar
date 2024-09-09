import React, { useState, useEffect } from 'react';
import { db } from '../../Firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import './Eventos.css';
import Modal from 'react-modal';

// Establecer el elemento root para el modal
Modal.setAppElement('#root');

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState('');
  const [fechaEvento, setFechaEvento] = useState(new Date());
  const [horaEvento, setHoraEvento] = useState('10:00');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editandoEvento, setEditandoEvento] = useState(null);
  const [eventoEditado, setEventoEditado] = useState('');
  const [fechaEditada, setFechaEditada] = useState(new Date());
  const [horaEditada, setHoraEditada] = useState('10:00');

  useEffect(() => {
    const fetchEventos = async () => {
      const eventosCollection = collection(db, 'eventos');
      const eventosSnapshot = await getDocs(eventosCollection);
      const eventosList = eventosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEventos(eventosList);
    };

    fetchEventos();
  }, []);

  const handleAddEvento = async (e) => {
    e.preventDefault();
    if (nuevoEvento.trim() !== '') {
      const fechaHoraEvento = new Date(fechaEvento);
      const [horas, minutos] = horaEvento.split(':');
      fechaHoraEvento.setHours(horas, minutos);

      const docRef = await addDoc(collection(db, 'eventos'), { 
        nombre: nuevoEvento,
        fecha: fechaHoraEvento.toISOString(),
        hora: horaEvento 
      });
      setEventos([...eventos, { id: docRef.id, nombre: nuevoEvento, fecha: fechaHoraEvento.toISOString(), hora: horaEvento }]);
      clearForm();
      setModalIsOpen(false);
    }
  };

  const handleDeleteEvento = async (id) => {
    await deleteDoc(doc(db, 'eventos', id));
    setEventos(eventos.filter(evento => evento.id !== id));
  };

  const handleEditEvento = async (e) => {
    e.preventDefault();
    if (eventoEditado.trim() !== '') {
      const fechaHoraEditada = new Date(fechaEditada);
      const [horas, minutos] = horaEditada.split(':');
      fechaHoraEditada.setHours(horas, minutos);

      await updateDoc(doc(db, 'eventos', editandoEvento), { 
        nombre: eventoEditado,
        fecha: fechaHoraEditada.toISOString(),
        hora: horaEditada 
      });
      setEventos(eventos.map(evento => 
        evento.id === editandoEvento 
        ? { ...evento, nombre: eventoEditado, fecha: fechaHoraEditada.toISOString(), hora: horaEditada } 
        : evento
      ));
      clearForm();
    }
  };

  const handleDateChange = (date) => {
    if (!date || isNaN(date.getTime())) {
      setFechaEvento(new Date());
    } else {
      setFechaEvento(date);
    }
  };

  const handleEditDateChange = (date) => {
    if (!date || isNaN(date.getTime())) {
      setFechaEditada(new Date());
    } else {
      setFechaEditada(date);
    }
  };

  const clearForm = () => {
    setNuevoEvento('');
    setFechaEvento(new Date());
    setHoraEvento('10:00');
    setEditandoEvento(null);
    setEventoEditado('');
    setFechaEditada(new Date());
    setHoraEditada('10:00');
  };

  return (
    <div className="eventos-container">
      <h2>Gestión de Eventos</h2>
      <button onClick={() => setModalIsOpen(true)} className="agregar-button">Agregar Evento</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close" onClick={() => { setModalIsOpen(false); clearForm(); }}>&times;</span>
            <h2>{editandoEvento ? 'Editar Evento' : 'Nuevo Evento'}</h2>
            <form onSubmit={editandoEvento ? handleEditEvento : handleAddEvento} className="evento-form">
              <input
                type="text"
                value={editandoEvento ? eventoEditado : nuevoEvento}
                onChange={(e) => editandoEvento ? setEventoEditado(e.target.value) : setNuevoEvento(e.target.value)}
                placeholder={editandoEvento ? 'Editar Evento' : 'Nombre del Evento'}
                required
              />
              <DatePicker
                selected={editandoEvento ? fechaEditada : fechaEvento}
                onChange={editandoEvento ? handleEditDateChange : handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="datepicker"
              />
              <TimePicker
                onChange={editandoEvento ? setHoraEditada : setHoraEvento}
                value={editandoEvento ? horaEditada : horaEvento}
                className="timepicker"
                disableClock={true}
                clearIcon={null}
              />
              <button type="submit" className="btn-save">{editandoEvento ? 'Guardar' : 'Agregar Evento'}</button>
              <button type="button" className="btn-cancel" onClick={() => { setModalIsOpen(false); clearForm(); }}>Cancelar</button>
            </form>
          </div>
        </div>
      </Modal>
      <ul className="evento-list">
        {eventos.map(evento => (
          <li key={evento.id} className="evento-item">
            {editandoEvento === evento.id ? (
              <form onSubmit={handleEditEvento} className="evento-edit-form">
                <input
                  type="text"
                  value={eventoEditado}
                  onChange={(e) => setEventoEditado(e.target.value)}
                  placeholder="Editar Evento"
                  required
                />
                <DatePicker
                  selected={fechaEditada}
                  onChange={handleEditDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="datepicker"
                />
                <TimePicker
                  onChange={setHoraEditada}
                  value={horaEditada}
                  className="timepicker"
                  disableClock={true}
                  clearIcon={null}
                />
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditandoEvento(null)}>Cancelar</button>
              </form>
            ) : (
              <>
                <span>{evento.nombre}</span>
                <span>{new Date(evento.fecha).toLocaleDateString()} {evento.hora}</span>
                <button className="edit-button" onClick={() => {
                  setEditandoEvento(evento.id);
                  setEventoEditado(evento.nombre);
                  setFechaEditada(new Date(evento.fecha));
                  setHoraEditada(evento.hora);
                }}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete-button" onClick={() => handleDeleteEvento(evento.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Eventos;

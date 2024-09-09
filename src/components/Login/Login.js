import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import escuelaImage from '../../assets/escuela1.jpeg'; // Asegúrate de que la ruta sea correcta

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth();

    // Establecer persistencia local
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Luego de establecer persistencia, iniciar sesión
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        navigate('/inicio');
      })
      .catch((error) => {
        console.error('Error al iniciar sesión:', error);
      });
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-image">
          <img src={escuelaImage} alt="Login Illustration" />
        </div>
        <div className="login-form">
          <h2>Inicio de Sesión</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="login-options">
              <label>
                <input type="checkbox" /> Recordarme
              </label>
              <a href="#forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

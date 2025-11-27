import React, { use, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import DenunciarGolpe from './pages/DenunciarGolpe';
import VerificarLink from './pages/VerificarLink';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import axios from 'axios';
import MinhaConta from './pages/MinhaConta';

function App() {
  const [message, setMessage] = React.useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/message')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Error fetching message:', error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/denunciar" element={<DenunciarGolpe />} />
        <Route path="/verificar" element={<VerificarLink />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/cadastro" element={<Cadastro/>} />
        <Route path="/minhaconta" element={<MinhaConta/>} />
      </Routes>
    </Router>
  );
}

export default App;

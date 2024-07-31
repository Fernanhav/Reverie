import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { CarritoProvider } from './CarritoContext';
import Registro from "./Registro";
import Login from "./Login";
import Usuarios from "./Usuarios";
import Productos from "./Productos";
import Resenas from "./Resenas";
import Catalogo from "./Catalogo";
import Recibos from "./Recibos";
import Landing from "./Landing";
import ComprasRealizadas from "./ComprasRealizadas";
import Inicio from "./Inicio";
import QuienesSomos from "./QuienesSomos";
import Contacto from "./Contacto";
import Carrito from "./Carrito";

const App = () => {
  return (
    <CarritoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/resenas" element={<Resenas />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/recibos" element={<Recibos />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/compras" element={<ComprasRealizadas />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/quienessomos" element={<QuienesSomos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </Router>
    </CarritoProvider>
  );
};

export default App;
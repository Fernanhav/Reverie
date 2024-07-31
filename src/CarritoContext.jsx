import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCarrito = async (userId) => {
    if (userId) {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/carrito/${userId}`);
        setCarrito(response.data);
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCarrito([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCarrito = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/carrito/${userId}`);
        setCarrito(response.data);
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchCarrito();
    } else {
      setCarrito([]);
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const currentUserId = Cookies.get("id_usuario");
    if (currentUserId) {
      setUserId(currentUserId);
    } else {
      setCarrito([]);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUserIdChange = () => {
      const currentUserId = Cookies.get("id_usuario");
      if (currentUserId !== userId) {
        setUserId(currentUserId);
      }
    };

    const intervalId = setInterval(handleUserIdChange, 1000);

    return () => clearInterval(intervalId);
  }, [userId]);

  const actualizarCarritoEnServidor = async (nuevoCarrito) => {
    if (userId) {
      try {
        await axios.post(`http://localhost:3000/carrito/${userId}`, { productos: nuevoCarrito });
      } catch (error) {
        console.error("Error al actualizar el carrito en el servidor:", error);
      }
    }
  };

  const agregarAlCarrito = (producto) => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = prevCarrito.find(item => item.id_producto === producto.id_producto)
        ? prevCarrito.map(item =>
            item.id_producto === producto.id_producto
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        : [...prevCarrito, { ...producto, cantidad: 1 }];

      actualizarCarritoEnServidor(nuevoCarrito);
      return nuevoCarrito;
    });
  };

  const eliminarDelCarrito = (id_producto) => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = prevCarrito.filter(item => item.id_producto !== id_producto);
      actualizarCarritoEnServidor(nuevoCarrito);
      return nuevoCarrito;
    });
  };

  const cambiarCantidad = (id_producto, cantidad) => {
    setCarrito(prevCarrito => {
      const nuevoCarrito = prevCarrito.map(item =>
        item.id_producto === id_producto ? { ...item, cantidad } : item
      );
      actualizarCarritoEnServidor(nuevoCarrito);
      return nuevoCarrito;
    });
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    actualizarCarritoEnServidor([]);
  };

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, cambiarCantidad, vaciarCarrito, isLoading }}>
      {isLoading ? (
        <p className="text-white">Cargando carrito...</p>
      ) : (
        children
      )}
    </CarritoContext.Provider>
  );
};
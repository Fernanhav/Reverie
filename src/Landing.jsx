import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaShoppingCart } from 'react-icons/fa'; // Importamos los iconos
import logo from './assets/img/logo.png';
import logoFooter from './assets/img/logo_footer.png';
import productosBackground from './assets/img/productos.jpg';

const Landing = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cantidadDirecta, setCantidadDirecta] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/productos")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });

    const id_usuario = Cookies.get("id_usuario");
    setIsLoggedIn(!!id_usuario);
    console.log("ID de usuario obtenido al cargar el componente:", id_usuario);

    if (id_usuario) {
      obtenerCarrito(id_usuario);
    }
  }, []);

  const obtenerCarrito = (id_usuario) => {
    axios.get(`http://localhost:3000/carrito/${id_usuario}`)
      .then((response) => {
        setCarrito(response.data.productos);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          axios.post(`http://localhost:3000/carrito/${id_usuario}`, { productos: [] })
            .then((response) => {
              setCarrito([]);
            })
            .catch((err) => {
              console.error("Error al crear un carrito vacío:", err);
            });
        } else {
          console.error("Error al obtener el carrito:", error);
        }
      });
  };  

  const agregarAlCarrito = (producto) => {
    const id_usuario = Cookies.get("id_usuario");
    const productoExistente = carrito.find(item => item.id_producto === producto.id_producto);

    if (productoExistente) {
      const nuevoCarrito = carrito.map(item => 
        item.id_producto === producto.id_producto 
          ? { ...item, cantidad: item.cantidad + 1 } 
          : item
      );
      setCarrito(nuevoCarrito);
      axios.put(`http://localhost:3000/carrito/${id_usuario}/${producto.id_producto}`, {
        cantidad: productoExistente.cantidad + 1
      }).then((response) => {
        console.log("Cantidad de producto actualizada en el carrito:", response.data);
      }).catch((error) => {
        console.error("Error al actualizar la cantidad del producto en el carrito:", error);
      });
    } else {
      const nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
      setCarrito(nuevoCarrito);
      axios.post(`http://localhost:3000/carrito/${id_usuario}`, {
        id_producto: producto.id_producto,
        cantidad: 1
      }).then((response) => {
        console.log("Producto agregado al carrito:", response.data);
      }).catch((error) => {
        console.error("Error al agregar el producto al carrito:", error);
      });
    }
  };

  const eliminarDelCarrito = (index) => {
    const id_usuario = Cookies.get("id_usuario");
    const productoAEliminar = carrito[index];
    console.log("Eliminando producto con ID:", productoAEliminar.id_producto, "del usuario con ID:", id_usuario);
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
    axios.delete(`http://localhost:3000/carrito/${id_usuario}/${productoAEliminar.id_producto}`)
      .then((response) => {
        console.log("Producto eliminado del carrito:", response.data);
      })
      .catch((error) => {
        console.error("Error al eliminar el producto del carrito:", error);
      });
  };  

  const cambiarCantidad = (index, cantidad) => {
    const id_usuario = Cookies.get("id_usuario");
    const productoAActualizar = carrito[index];
    const nuevoCarrito = carrito.map((item, i) => {
      if (i === index) {
        return { ...item, cantidad };
      }
      return item;
    });
    setCarrito(nuevoCarrito);
    axios.put(`http://localhost:3000/carrito/${id_usuario}/${productoAActualizar.id_producto}`, {
      cantidad
    }).then((response) => {
      console.log("Cantidad de producto actualizada:", response.data);
    }).catch((error) => {
      console.error("Error al actualizar la cantidad del producto en el carrito:", error);
    });
  };  

  const realizarCompra = (compraDirecta) => {
    const id_usuario = Cookies.get("id_usuario") || 0;
    console.log("ID de usuario obtenido al realizar compra:", id_usuario);
  
    let compra;
  
    if (compraDirecta) {
      const { producto, cantidad } = compraDirecta;
      compra = {
        id_usuario,
        productos: [{ id_producto: producto.id_producto, cantidad }]
      };
    } else {
      compra = {
        id_usuario,
        productos: carrito.map(({ id_producto, cantidad }) => ({
          id_producto,
          cantidad
        }))
      };
    }
  
    console.log("Compra a realizar:", compra);
  
    axios.post("http://localhost:3000/recibos", compra)
      .then((response) => {
        console.log("Compra realizada:", response.data);
        setCarrito([]);
        setProductoSeleccionado(null);
        setCantidadDirecta(1);
        axios.put(`http://localhost:3000/carrito/${id_usuario}`, { productos: [] })
          .then((response) => {
            console.log("Carrito vaciado:", response.data);
          })
          .catch((error) => {
            console.error("Error al vaciar el carrito:", error);
          });
      })
      .catch((error) => {
        console.error("Error al realizar la compra:", error);
      });
  };  

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  const calcularTotalDirecto = (producto, cantidad) => {
    return producto.precio * cantidad;
  };

  const handleAdminClick = () => {
    navigate("/usuarios");
  };

  const handleLogout = () => {
    Cookies.remove("id_usuario");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    navigate("/login"); // Cambiado a "/login" en lugar de "/inicio"
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const id_usuario = Cookies.get("id_usuario");

  return (
    <div className="bg-[#111827] font-['Montserrat']">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
        `}
      </style>
      <nav className="bg-[#111827] text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Logo" className="w-[116px]" />
          </Link>
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/inicio" className="hover:text-blue-500 uppercase">INICIO</Link>
            <Link to="/quienessomos" className="hover:text-blue-500 uppercase">QUIÉNES SOMOS</Link>
            <Link to="/landing" className="hover:text-blue-500 uppercase">CATÁLOGO DE PRODUCTOS</Link>
            <Link to="/contacto" className="hover:text-blue-500 uppercase">CONTACTO</Link>
            <Link to="/compras" className="hover:text-blue-500 uppercase">MIS COMPRAS</Link>
            {isLoggedIn && (
              <button onClick={() => setCarritoAbierto(true)} className="text-2xl hover:text-blue-500">
                <FaShoppingCart />
              </button>
            )}
            {isLoggedIn ? (
              <div className="relative">
                <button onClick={toggleDropdown} className="text-2xl hover:text-blue-500">
                  <FaUser />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#202938] rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-white hover:bg-[#2d3748] w-full text-left"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-blue-500 uppercase">INICIAR SESIÓN</Link>
            )}
          </div>
        </div>
      </nav>

      <main>
        <img src={productosBackground} alt="Productos Background" className="w-full object-cover" />
        
        <section className="bg-[#111827] py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8">
              {productos.map((producto) => (
                <div key={producto.id_producto} className="bg-[#202938] rounded-lg overflow-hidden w-[300px]">
                  <img src={producto.foto} alt={producto.nombre} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-white text-xl font-semibold mb-2 text-center">{producto.nombre}</h3>
                    <p className="text-gray-400 mb-2 text-center">{producto.descripcion}</p>
                    <p className="text-white text-lg font-bold mb-4 text-center">Precio: ${producto.precio}</p>
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => setProductoSeleccionado(producto)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition duration-300">
                        Comprar
                      </button>
                      <button onClick={() => agregarAlCarrito(producto)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition duration-300">
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {carritoAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#202938] p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-white text-xl font-bold mb-6">Carrito de compras</h2>
            {carrito.length === 0 ? (
              <div>
                <p className="text-white mb-6">El carrito está vacío.</p>
                <button onClick={() => setCarritoAbierto(false)} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition duration-300">
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <table className="w-full text-white mb-6">
                  <thead>
                    <tr>
                      <th className="text-left pb-4">Producto</th>
                      <th className="text-left pb-4">Precio</th>
                      <th className="text-left pb-4">Cantidad</th>
                      <th className="text-left pb-4">Subtotal</th>
                      <th className="text-left pb-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((producto, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-4 flex items-center">
                          <img src={producto.foto} alt={producto.nombre} className="w-[106px] h-auto rounded-md mr-4" />
                          {producto.nombre}
                        </td>
                        <td>${producto.precio}</td>
                        <td>
                          <input
                            type="number"
                            value={producto.cantidad}
                            onChange={(e) => cambiarCantidad(index, parseInt(e.target.value))}
                            className="w-16 bg-gray-700 text-white p-1 rounded"
                            min="1"
                          />
                        </td>
                        <td>${producto.precio * producto.cantidad}</td>
                        <td>
                          <button onClick={() => eliminarDelCarrito(index)} className="text-red-500 hover:text-red-700">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-white text-xl font-bold mb-6">
                  Total: ${calcularTotal()}
                </div>
                <div className="flex justify-between">
                  <button onClick={() => realizarCompra(null)} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300">
                    Realizar compra
                  </button>
                  <button onClick={() => setCarritoAbierto(false)} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition duration-300">
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#202938] p-8 rounded-lg w-full max-w-2xl">
            <h2 className="text-white text-3xl font-bold mb-6">Comprar {productoSeleccionado.nombre}</h2>
            <div className="flex flex-col md:flex-row mb-6">
              <img src={productoSeleccionado.foto} alt={productoSeleccionado.nombre} className="w-full md:w-1/2 h-64 md:h-auto object-cover rounded-lg mb-4 md:mb-0 md:mr-6" />
              <div className="flex-1">
                <p className="text-gray-300 mb-4 text-lg max-h-48 overflow-y-auto">{productoSeleccionado.descripcion}</p>
                <p className="text-white font-bold mb-4 text-xl">Precio: ${productoSeleccionado.precio}</p>
                <div className="flex items-center mb-4">
                  <label className="text-white mr-4 text-lg">Cantidad:</label>
                  <input
                    type="number"
                    value={cantidadDirecta}
                    onChange={(e) => setCantidadDirecta(parseInt(e.target.value))}
                    className="w-24 bg-gray-700 text-white p-2 rounded text-lg"
                    min="1"
                  />
                </div>
              </div>
            </div>
            <p className="text-white text-2xl font-bold mb-6">Total: ${calcularTotalDirecto(productoSeleccionado, cantidadDirecta)}</p>
            <div className="flex justify-between">
              <button 
                onClick={() => realizarCompra({ producto: productoSeleccionado, cantidad: cantidadDirecta })}
                className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700 transition duration-300"
              >
                Confirmar Compra
              </button>
              <button 
                onClick={() => setProductoSeleccionado(null)}
                className="bg-gray-600 text-white px-6 py-3 rounded text-lg hover:bg-gray-700 transition duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {id_usuario === "1" && (
        <div className="fixed bottom-4 right-4">
          <button onClick={handleAdminClick} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300">
            Modo Administrador
          </button>
        </div>
      )}

      <footer className="bg-[#202938] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <img src={logoFooter} alt="Logo Footer" className="max-w-full h-auto" />
            </div>
            <div className="flex space-x-8">
              <Link to="/inicio" className="text-white text-sm hover:text-blue-500 uppercase">INICIO</Link>
              <Link to="/quienessomos" className="text-white text-sm hover:text-blue-500 uppercase">QUIÉNES SOMOS</Link>
              <Link to="/landing" className="text-white text-sm hover:text-blue-500 uppercase">CATÁLOGO DE PRODUCTOS</Link>
              <Link to="/contacto" className="text-white text-sm hover:text-blue-500 uppercase">CONTACTO</Link>
              <Link to="/compras" className="text-white text-sm hover:text-blue-500 uppercase">MIS COMPRAS</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
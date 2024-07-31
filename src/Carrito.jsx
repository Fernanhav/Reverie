import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/img/logo.png';
import logoFooter from './assets/img/logo_footer.png';
import productImage from './assets/img/desk.jpg';

function Carrito() {
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
            <Link to="/catalogo" className="hover:text-blue-500 uppercase">CATÁLOGO DE PRODUCTOS</Link>
            <Link to="/contacto" className="hover:text-blue-500 uppercase">CONTACTO</Link>
            <Link to="/carrito" className="text-2xl hover:text-blue-500">
              <i className="fa fa-shopping-cart"></i>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-12">
        <h2 className="text-white text-xl font-bold mt-8 mb-6">Carrito de compras</h2>
        
        <div className="bg-[#202938] rounded-lg p-6">
          <table className="w-full text-white">
            <thead>
              <tr>
                <th className="text-left pb-4">Producto</th>
                <th className="text-left pb-4">Precio</th>
                <th className="text-left pb-4">Cantidad</th>
                <th className="text-left pb-4">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <tr key={item} className="border-b border-gray-700">
                  <td className="py-4 flex items-center">
                    <img src={productImage} alt="Producto" className="w-[106px] h-auto rounded-md mr-4" />
                    Producto ejemplo
                  </td>
                  <td>$0.00</td>
                  <td>1</td>
                  <td>$0.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#202938] mt-6 p-6 rounded-lg">
          <p className="text-white text-2xl">Total $0.00</p>
        </div>

        <button className="bg-[#2563eb] text-white px-8 py-3 mt-6 rounded-lg hover:bg-blue-700 transition duration-300">
          Comprar
        </button>
      </main>

      <footer className="bg-[#202938] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <img src={logoFooter} alt="Logo Footer" className="max-w-full h-auto" />
            </div>
            <div className="flex space-x-8">
              <Link to="/" className="text-white text-sm hover:text-blue-500 uppercase">INICIO</Link>
              <Link to="/quienes-somos" className="text-white text-sm hover:text-blue-500 uppercase">QUIÉNES SOMOS</Link>
              <Link to="/catalogo" className="text-white text-sm hover:text-blue-500 uppercase">CATÁLOGO DE PRODUCTOS</Link>
              <Link to="/contacto" className="text-white text-sm hover:text-blue-500 uppercase">CONTACTO</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Carrito;
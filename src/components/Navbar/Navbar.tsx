// Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Asegúrate de crear un archivo de estilo
import Logo from '../../assets/logo.jpg'
const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          <img src={Logo} alt="Logo" className="logo-img" />
        </div>

        {/* Titulo */}
        <div >
          <h1 className="navbar-title"> JSONs to XML Converter</h1>
          <h6 >Te permitira convertir los archivos json a formato xml compatible para Game Master 5</h6>

        </div>

        {/* Links de navegación */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Monsters</Link>
       {/*    <Link to="/items" className="navbar-link">Items</Link> */}
    
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

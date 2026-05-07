import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbarContainer">
      <a href="/" className="link">Inicio</a>
      <a href="/productos" className="link">Productos</a>
      <a href="/contacto" className="link">Contacto</a>
      <a href="/carrito" className="link">Carrito</a>
    </nav>
  );
};

export default Navbar;
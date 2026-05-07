import styles from "./Header.module.css";
import logo from "../../assets/react.svg";
import Navbar from "../Navbar";

function Header() {
  return (
    <header className={styles.header}>
      <h1>Bienvenidos a mi App React</h1>
      <Navbar />
      <img src={logo} alt="Logo" />
                   
    </header>
  );
}

export default Header;
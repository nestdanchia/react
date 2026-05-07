import styles from "./TarjetaProducto.module.css";

function TarjetaProducto({ imagen, nombre, precio }) {
  return (
    <article className={styles.card}>
      <img className={styles.image} src={imagen} alt={nombre} />
      <div className={styles.content}>
        <h3 className={styles.title}>{nombre}</h3>
        <p className={styles.price}>${precio}</p>
      </div>
    </article>
  );
}

export default TarjetaProducto;
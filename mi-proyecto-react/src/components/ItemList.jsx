import { Item } from "./Item";
import styles from "./ItemList.module.css";
/* ItemList = datos → filas/celdas en el DOM; ItemList.module.css (.frame) = cómo se reparten en columnas con CSS Grid. */
export function ItemList({ productos }) {
  return (
    <div className={styles.frame}>
      {productos
        .filter((prod) => prod.stock > 0)
        .map((prod) => (
          <div key={prod.id} className={styles.item}>
            {/* Este div es el wrapper de <Item /> dentro del grid */}
            <Item {...prod} />
          </div>
        ))}
    </div>
  );
}
/* ItemList se encarga de decidir qué productos se muestran (la lógica de negocio), mientras que Item solo se preocupa por
 cómo se ve un producto que sí existe.*/
import styles from '../../styles/Layout.module.css'

export function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className={styles.title}>🛍️ Proper React</h1>
          <p className={styles.subtitle}>Tienda Virtual con Best Practices</p>
        </div>
      </header>
      
      <main className={styles.main}>
        <div className={styles.container}>
          {children}
        </div>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2024 Proper React - Demo de Best Practices</p>
        </div>
      </footer>
    </div>
  )
}

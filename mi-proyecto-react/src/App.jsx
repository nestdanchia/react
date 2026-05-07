import { Layout } from './components/Layout/Layout';
import { TiendaVirtual } from './components/ItemListContainer';
import { ChatIA } from './components/ChatIA'; // Importamos el nuevo chat
function App() {
  return (
    <Layout>
      <TiendaVirtual mensaje="🏪 Tienda Virtual - 53 Productos Disponibles" />
      {/* El chat ahora es un componente independiente y dinámico */}
      <ChatIA /> 
    </Layout>
  );
}
export default App;
/**
 * App.jsx represents the root component of the React application. 
 * It renders the Layout component, which contains the Header, Main, and Footer.
 * It also renders the ChatIA component, which is a dynamic chat component.
 * 
 */
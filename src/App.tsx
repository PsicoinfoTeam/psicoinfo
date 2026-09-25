import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Busca from './pages/Busca';
import Categoria from './pages/Categoria';
import Home from './pages/Home';
import NaoEncontrada from './pages/NaoEncontrada';
import Servico from './pages/Servico';
import Sobre from './pages/Sobre';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/busca', element: <Busca /> },
      { path: '/categoria/:id', element: <Categoria /> },
      { path: '/servico/:id', element: <Servico /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Busca from './pages/Busca';
import Categoria from './pages/Categoria';
import Faq from './pages/Faq';
import Home from './pages/Home';
import NaoEncontrada from './pages/NaoEncontrada';
import PertoDeMim from './pages/PertoDeMim';
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
      { path: '/perto-de-mim', element: <PertoDeMim /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/faq', element: <Faq /> },
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

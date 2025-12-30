import { Navigate } from 'react-router';
import App from '../App.jsx';
import About from '../page/About/About.jsx';
import Error from '../page/Error/Error.jsx';
import Home from '../page/Home/Home.jsx';


export const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'About',
        element: <About />
      },
      {
        path: '*',
        element: <Error />,
      },
    ],
  },
];

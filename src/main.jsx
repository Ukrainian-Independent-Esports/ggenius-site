import './i18n.js'
// import { ViteSSG } from 'vite-plugin-ssg';
import { RouterProvider } from 'react-router-dom'
import { routes } from './Hooks/routers.jsx';
import { ViteReactSSG } from 'vite-react-ssg';
const redirect = sessionStorage.getItem("redirect");

if (redirect) {
  sessionStorage.removeItem("redirect");
  window.history.replaceState(null, "", redirect);
}
export const createApp = ViteReactSSG(
  { routes },
  ({ app }) => app,         // vite-react-ssg сам создаёт RouterProvider
  { rootContainer: '#app' }
);
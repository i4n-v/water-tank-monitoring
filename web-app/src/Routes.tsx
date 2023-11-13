import { useRoutes } from 'react-router-dom';
import routes from './config/routes';

const Routes = () => {
  const renderRoutes = useRoutes(routes);

  return renderRoutes;
};

export default Routes;

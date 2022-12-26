import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface PrivateRouteInterface {
  component: React.FC;
  path: string;
  exact?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteInterface> = ({ component, exact, path }) => {
  const { auth } = useSelector((state: any) => state.verifyUser);
  const Component = auth ? component : () => <Redirect to="/login" />;

  return (
    <Route
      exact={exact}
      path={path}
      component={Component}
    />
  );
};

export default PrivateRoute;

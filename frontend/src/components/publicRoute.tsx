import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface PublicRouteInterface {
  component: React.FC;
  path: string;
}

const PublicRoute: React.FC<PublicRouteInterface> = ({ path, component }) => {
  const { auth } = useSelector((state: any) => state.verifyUser);
  const Component = !auth ? component : () => <Redirect to="/" />;

  return (
    <Route
      path={path}
      component={Component}
    />
  );
};

export default PublicRoute;

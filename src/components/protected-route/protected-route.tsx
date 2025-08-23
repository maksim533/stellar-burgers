import { selectedUser } from '@slices';
import { useSelector } from '@store';
import { Preloader } from '@ui';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  isAuth?: boolean;
};

export const ProtectedRoute = ({ children, isAuth }: ProtectedRouteProps) => {
  const selector = useSelector(selectedUser);
  const isAuthChecked = selector.isAuthChecked;
  const user = selector.user;
  const location = useLocation();

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!isAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (isAuth && user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }
  return children;
};

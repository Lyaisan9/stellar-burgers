import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router';
import { ReactElement, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { useParams } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectLoginRequest,
  selectUserData
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps): ReactElement => {
  const isAuthChecked = useSelector(selectIsAuthenticated);
  const loginRequested = useSelector(selectLoginRequest);
  const user = useSelector(selectUserData).name;
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };
  const { number } = useParams();

  if (!isAuthChecked && loginRequested) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate replace to={from} state={location} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};

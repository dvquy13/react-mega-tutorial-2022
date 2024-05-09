import { useLocation, Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

export default function PrivateRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();

  if (user === undefined) {
    // When this variable is undefined, it means that the application
    // isn't ready to provide user information yet. In this situation,
    // this component cannot do anything, so it returns null to not
    // render anything. This isn't a problem because the undefined value
    // for the user is temporary. As soon as the user state variable in the
    // user context resolves to null or to the user's details, this
    // component will re-render.
    return null;
  }
  else if (user) {
    return children;
  }
  else {
    const url = location.pathname + location.search + location.hash;
    return <Navigate to="/login" state={{next: url}} />
  }
}
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function UserRoute({ children }: Props) {
  const role = localStorage.getItem('role');

  if (!role || role !== 'USER') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const role =
    localStorage.getItem('role');

  if (!role) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
}
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({
  children,
}: Props) {
  const role =
    localStorage.getItem('role');

  if (role !== 'ADMIN') {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
}
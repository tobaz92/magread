import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <p>Chargement...</p>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
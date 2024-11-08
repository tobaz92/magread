import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../context/AuthContext';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return <p>Chargement...</p>;
  }

  return <>{children}</>;
};

export default PublicRoute;
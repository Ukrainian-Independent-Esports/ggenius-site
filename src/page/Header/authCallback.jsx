import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

const AuthCallback = () => {
  const { setAccess, setRefresh } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get('access');
    const refresh = params.get('refresh');

    if (access && refresh) {
      setAccess(access);
      setRefresh(refresh);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      navigate('/'); // редирект на главную
    } else {
      navigate('/error');
    }
  }, []);

  return <div>Авторизация...</div>;
};

export default AuthCallback;

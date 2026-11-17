import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { Alert, AuthLayout, Field } from '../components/AuthLayout';
import { LockIcon, MailIcon } from '../components/Icons';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/dashboard" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(form);
      login(data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const { success, message } = location.state || {};

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Ingresa tus credenciales para acceder a tu panel."
      footer={<>¿No tienes cuenta? <Link to="/register">Crear una cuenta</Link></>}
    >
      <form onSubmit={onSubmit}>
        {success && <Alert type="success">{success}</Alert>}
        {!success && message && <Alert type="info">{message}</Alert>}

        <Field
          label="Correo electrónico"
          icon={MailIcon}
          name="email"
          type="email"
          placeholder="tucorreo@ejemplo.com"
          autoComplete="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <Field
          label="Contraseña"
          icon={LockIcon}
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={form.password}
          onChange={onChange}
          required
        />

        {error && <Alert type="error">{error}</Alert>}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </AuthLayout>
  );
}

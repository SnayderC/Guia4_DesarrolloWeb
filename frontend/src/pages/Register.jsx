import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Alert, AuthLayout, Field } from '../components/AuthLayout';
import { LockIcon, MailIcon, UserIcon } from '../components/Icons';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.register(form);
      navigate('/login', { state: { success: 'Registro exitoso. Ahora inicia sesión.' } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Regístrate para acceder al panel protegido."
      footer={<>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></>}
    >
      <form onSubmit={onSubmit}>
        <Field
          label="Nombre completo"
          icon={UserIcon}
          name="name"
          placeholder="Juan Pérez"
          autoComplete="name"
          value={form.name}
          onChange={onChange}
          required
          minLength={2}
        />
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
        <div>
          <Field
            label="Contraseña"
            icon={LockIcon}
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
          />
          <p className="field-hint">Usa al menos 6 caracteres.</p>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  );
}

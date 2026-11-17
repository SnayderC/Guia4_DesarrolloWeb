import { useState } from 'react';
import { AlertIcon, CheckIcon, EyeIcon, EyeOffIcon, InfoIcon, KeyIcon, LockIcon, ShieldIcon } from './Icons';

// Layout de pantalla dividida para Login y Registro
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth-brand">
        <div className="brand">
          <span className="brand-logo"><ShieldIcon /></span>
          <span>SecureAuth</span>
        </div>

        <div className="auth-brand-body">
          <h2>Acceso seguro con JSON Web Tokens</h2>
          <p>Aplicación Full Stack con React, Node.js, Express y MongoDB.</p>
          <ul className="feature-list">
            <li><span><LockIcon /></span>Contraseñas cifradas con bcrypt</li>
            <li><span><KeyIcon /></span>Sesiones firmadas con JWT</li>
            <li><span><ShieldIcon /></span>Rutas protegidas en el servidor</li>
          </ul>
        </div>

        <p className="auth-brand-foot">Práctica 4 · Desarrollo Web</p>
      </aside>

      <section className="auth-main">
        <div className="auth-card">
          <div className="brand brand-mobile">
            <span className="brand-logo"><ShieldIcon /></span>
            <span>SecureAuth</span>
          </div>
          <header className="auth-header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </header>
          {children}
          {footer && <p className="auth-footer">{footer}</p>}
        </div>
      </section>
    </div>
  );
}

// Campo con ícono a la izquierda
export function Field({ label, icon: Icon, type = 'text', ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="field-control">
        <Icon className="field-icon" />
        <input type={isPassword && show ? 'text' : type} {...props} />
        {isPassword && (
          <button
            type="button"
            className="field-toggle"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </span>
    </label>
  );
}

const alertIcons = { error: AlertIcon, success: CheckIcon, info: InfoIcon };

export function Alert({ type = 'info', children }) {
  const Icon = alertIcons[type];
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <Icon />
      <span>{children}</span>
    </div>
  );
}

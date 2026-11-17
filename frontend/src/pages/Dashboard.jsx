import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { Alert } from '../components/AuthLayout';
import { ClockIcon, KeyIcon, LogoutIcon, MailIcon, ShieldIcon, UserIcon, UsersIcon } from '../components/Icons';

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';

// Color de avatar estable a partir del email
const AVATAR_COLORS = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#db2777', '#7c3aed'];
const avatarColor = (seed = '') =>
  AVATAR_COLORS[[...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

// Lee la fecha de expiración del JWT (solo para mostrarla; la validación real es del backend)
function tokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch {
    return null;
  }
}

const fmtDate = (d) => new Date(d).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtTime = (d) => d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

function Avatar({ name, seed, size = 'md' }) {
  return (
    <span className={`avatar avatar-${size}`} style={{ background: avatarColor(seed) }}>
      {initials(name)}
    </span>
  );
}

// Página protegida: consume GET /api/users/me y GET /api/users
export default function Dashboard() {
  const { token, logout } = useAuth();
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([api.me(token), api.users(token)])
      .then(([meData, usersData]) => {
        if (!active) return;
        setMe(meData.user);
        setUsers(usersData.users);
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 401) {
          // Token inválido o expirado: se cierra la sesión y ProtectedRoute redirige al login
          logout(err.message);
        } else {
          setError(err.message);
        }
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token, logout]);

  const onLogout = () => logout('Sesión cerrada correctamente');
  const expiry = tokenExpiry(token);

  return (
    <div className="app">
      <nav className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-logo"><ShieldIcon /></span>
            <span>SecureAuth</span>
          </div>
          <div className="topbar-user">
            {me && (
              <div className="topbar-id">
                <Avatar name={me.name} seed={me.email} size="sm" />
                <span className="topbar-name">{me.name}</span>
              </div>
            )}
            <button className="btn btn-ghost" onClick={onLogout} aria-label="Cerrar sesión">
              <LogoutIcon />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container">
        <header className="page-header">
          <div>
            <span className="badge badge-success"><span className="dot" />Sesión autenticada</span>
            <h1>{me ? `Hola, ${me.name.split(' ')[0]}` : 'Panel protegido'}</h1>
            <p className="muted">Este contenido solo es visible con un token JWT válido.</p>
          </div>
        </header>

        {error && <Alert type="error">{error}</Alert>}

        {loading ? (
          <DashboardSkeleton />
        ) : (
          !error && (
            <>
              <section className="stats">
                <div className="stat">
                  <span className="stat-icon stat-indigo"><UsersIcon /></span>
                  <div>
                    <p className="stat-label">Usuarios registrados</p>
                    <p className="stat-value">{users.length}</p>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon stat-green"><KeyIcon /></span>
                  <div>
                    <p className="stat-label">Estado del token</p>
                    <p className="stat-value stat-value-sm">Válido</p>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon stat-amber"><ClockIcon /></span>
                  <div>
                    <p className="stat-label">Sesión expira a las</p>
                    <p className="stat-value stat-value-sm">{expiry ? fmtTime(expiry) : '—'}</p>
                  </div>
                </div>
              </section>

              <div className="grid">
                {me && (
                  <section className="panel profile">
                    <div className="panel-head">
                      <h2>Mi perfil</h2>
                      <code className="endpoint">GET /api/users/me</code>
                    </div>
                    <div className="profile-hero">
                      <Avatar name={me.name} seed={me.email} size="lg" />
                      <div>
                        <p className="profile-name">{me.name}</p>
                        <p className="muted">{me.email}</p>
                      </div>
                    </div>
                    <dl className="details">
                      <div><dt><UserIcon />Nombre</dt><dd>{me.name}</dd></div>
                      <div><dt><MailIcon />Email</dt><dd>{me.email}</dd></div>
                      <div><dt><ClockIcon />Miembro desde</dt><dd>{fmtDate(me.createdAt)}</dd></div>
                    </dl>
                  </section>
                )}

                <section className="panel">
                  <div className="panel-head">
                    <h2>Usuarios registrados</h2>
                    <code className="endpoint">GET /api/users</code>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr><th>Usuario</th><th>Email</th><th>Registro</th></tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td>
                              <div className="cell-user">
                                <Avatar name={u.name} seed={u.email} size="sm" />
                                <span>{u.name}</span>
                                {me && u._id === me._id && <span className="badge badge-primary">Tú</span>}
                              </div>
                            </td>
                            <td className="muted">{u.email}</td>
                            <td className="muted nowrap">{fmtDate(u.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </>
          )
        )}
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-label="Cargando" aria-busy="true">
      <section className="stats">
        {[0, 1, 2].map((i) => <div key={i} className="stat skeleton" style={{ height: 88 }} />)}
      </section>
      <div className="grid">
        <div className="panel skeleton" style={{ height: 300 }} />
        <div className="panel skeleton" style={{ height: 300 }} />
      </div>
    </div>
  );
}

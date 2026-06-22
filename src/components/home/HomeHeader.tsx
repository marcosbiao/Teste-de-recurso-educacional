import * as React from 'react';
import { Code2, FlaskConical, LogIn, LogOut, Map, UserRound } from 'lucide-react';
import type { UserProfile } from '../../types';

interface HomeHeaderProps {
  user: UserProfile | null;
  onOpenWorkshop: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onShowTrails: () => void;
}

export function HomeHeader({ user, onOpenWorkshop, onLogin, onLogout, onShowTrails }: HomeHeaderProps) {
  return (
    <header className="home-header">
      <div className="home-container home-header__inner">
        <button className="brand-mark" type="button" onClick={onShowTrails} aria-label="Ir para Desafios Guiados">
          <span className="brand-mark__icon" aria-hidden="true"><Code2 size={23} /></span>
          <span>Oficina Interativa <strong>de Código</strong></span>
        </button>

        <nav className="home-nav" aria-label="Navegação principal">
          <button className="home-nav__item is-active" type="button" onClick={onShowTrails} aria-current="page">
            <Map size={18} /> Desafios Guiados
          </button>
          <button className="home-nav__item" type="button" onClick={onOpenWorkshop}>
            <FlaskConical size={18} /> Novos formatos
          </button>
        </nav>

        <div className="home-header__account">
          {user ? (
            <>
              <div className="header-user" title={user.displayName || user.email || 'Estudante'}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <UserRound size={18} aria-hidden="true" />
                )}
                <span>{user.displayName || 'Estudante'}</span>
              </div>
              <button className="icon-button" type="button" onClick={onLogout} aria-label="Sair da conta" title="Sair">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button className="header-login" type="button" onClick={onLogin}>
              <LogIn size={18} /> <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

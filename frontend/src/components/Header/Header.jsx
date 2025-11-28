import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { SiHiveBlockchain } from 'react-icons/si';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = () => {
      const saved = localStorage.getItem("usuario");
      setUsuario(saved ? JSON.parse(saved) : null);
    };
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setUserMenuOpen(false);
    setMenuOpen(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/"); // volta pra Home
  };

  return (
    <header className={styles.header}>

      <Link to="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
        <SiHiveBlockchain className={styles.logoIcon} />
        &lt; zeroScam &gt;
      </Link>

      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        
        <Link
          to="/verificar"
          className={`${styles.navItem} ${
            location.pathname === "/verificar" ? styles.active : ""
          }`}
          onClick={() => setMenuOpen(false)}
        >
          VERIFICAR LINK
        </Link>

        <Link
          to="/denunciar"
          className={`${styles.navItem} ${
            location.pathname === "/denunciar" ? styles.active : ""
          }`}
          onClick={() => setMenuOpen(false)}
        >
          DENUNCIAR GOLPE
        </Link>

        {usuario ? (
          <div className={styles.userMenuContainer}>
            
            <button
              className={styles.userButton}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              {`OLÁ, ${usuario.nome?.toUpperCase() || "USUÁRIO"}!`}
            </button>

            {userMenuOpen && (
              <div className={styles.dropdown}>
                <Link 
                  to="/minhaconta"
                  onClick={() => {
                    setUserMenuOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Minha Conta
                </Link>
                <button onClick={handleLogout}>Sair</button>
              </div>
            )}

          </div>
        ) : (
          <Link
            to="/login"
            className={`${styles.entrarBtn} ${
              location.pathname === "/login" ? styles.active : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            ENTRAR
          </Link>
        )}

      </nav>
    </header>
  );
}

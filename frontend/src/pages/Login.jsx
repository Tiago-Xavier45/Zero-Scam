import React, { useState } from "react";
import { SiHiveBlockchain } from "react-icons/si";
import Header from "../components/Header/Header";
import styles from "./Login.module.css";

export default function Login() {

 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    senha: "",
    login: "",
  });

  const validateFields = () => {
    let valid = true;
    let newErrors = { email: "", senha: "", login: "" };

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Digite um email válido.";
      valid = false;

      
    }

 
    if (senha.length < 8) {
      newErrors.senha = "A senha deve ter pelo menos 8 caracteres.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = validateFields();
  if (!isValid) return;

  try {
    const response = await fetch("http://localhost:8080/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    });


    if (response.ok) {
      const usuario = await response.json();
      console.log("Login bem-sucedido!", usuario);
      
      
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setIsLoggedIn(true);

      window.dispatchEvent(new Event("storage"));

      
        window.location.href = "/";
      
    } else if (response.status === 401) {
      setErrors({
        email: "",
        senha: "",
        login: "Email ou senha incorretos.",
      });
    } else {
      setErrors({
        email: "",
        senha: "",
        login: "Erro inesperado ao tentar fazer login",
      });
    }
  } catch (error) {
    console.error("Erro no login:", error);
    setErrors({
      email: "",
      senha: "",
      login: "Erro ao conectar ao servidor.",
    });
  }
};

  return (
    <>
      <Header />
      <section className={styles.hero}>
        <div className={styles.card}>
          <SiHiveBlockchain className={styles.logoIcon} />
          <h2>Login.</h2>
          <p className={styles.subtitle}>
            Acesse sua conta para continuar explorando nossa comunidade.
          </p>
          <hr className={styles.divider} />

          <form onSubmit={handleSubmit} className={styles.form}>
            <label>EMAIL</label>
            <input
              type="email"
              placeholder="Digite o seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}

            <label>SENHA</label>
            <input
              type="password"
              placeholder="Digite a sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            {errors.senha && <span className={styles.error}>{errors.senha}</span>}

            {errors.login && (
              <span className={`${styles.error} ${styles.loginError}`}>
                {errors.login}
              </span>
            )}

              {!isLoggedIn && ( // Renderização condicional do botão
              <button type="submit" className={styles.btn}>
                ENTRAR
              </button>
            )}
          </form>
          

          {!isLoggedIn && (
          <div className={styles.footerLinks}>
            <a href="/esqueci-senha" className={styles.forgotPassword}>
              Esqueceu a senha?
            </a>
            <p className={styles.signupText}>
              Ainda não tem uma conta?{" "}
              <a href="/cadastro" className={styles.signupLink}>
                Faça o seu cadastro
              </a>
            </p>
          </div>
            )}
        </div>
      </section>
    </>
  );
}

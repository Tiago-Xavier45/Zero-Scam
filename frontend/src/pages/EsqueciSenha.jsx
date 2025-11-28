import React, { useState } from "react";
import Header from "../components/Header/Header";
import styles from "./EsqueciSenha.module.css";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function verificarEmail(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    try {
      const res = await fetch(`http://localhost:8080/api/usuarios/email/${email}`);

      if (!res.ok) {
        setErro("Nenhum usuário encontrado com esse email.");
        return;
      }

      const usuario = await res.json();

      // Salva temporariamente o ID para usar na próxima tela
      sessionStorage.setItem("resetUserId", usuario.id);

      window.location.href = "/resetar-senha";
    } catch (error) {
      setErro("Erro ao conectar ao servidor.");
    }
  }

  return (
    <>
      <Header />

      <section className={styles.hero}>
        <div className={styles.card}>
          <h2>Esqueci minha senha</h2>
          <p className={styles.subtitle}>
            Informe seu email para redefinir a senha.
          </p>

          <hr className={styles.divider} />

          {erro && <p className={styles.errorBox}>{erro}</p>}
          {mensagem && <p className={styles.successBox}>{mensagem}</p>}

          <form className={styles.form} onSubmit={verificarEmail}>
            <label>Email cadastrado</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className={styles.btn} type="submit">
              Continuar
            </button>
          </form>

          <p className={styles.backText}>
            <a href="/login" className={styles.backLink}>
              Voltar ao login
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

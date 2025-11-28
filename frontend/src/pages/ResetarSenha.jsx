import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Header from "../components/Header/Header";
import styles from "./ResetarSenha.module.css";

export default function ResetarSenha() {
  const userId = sessionStorage.getItem("resetUserId");

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    number: false,
    uppercase: false,
    special: false,
    match: false,
  });

  // Redireciona para "esqueci a senha" se não tiver ID
  useEffect(() => {
    if (!userId) {
      window.location.href = "/esqueci-senha";
    }
  }, [userId]);

  // Validação da senha
  const validatePassword = (senha, confirmarSenha) => {
    const checks = {
      length: senha.length >= 8,
      number: /\d/.test(senha),
      uppercase: /[A-Z]/.test(senha),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
      match: senha !== "" && senha === confirmarSenha,
    };
    setValidations(checks);
  };

  // ============================
  // 🔐 SALVAR NOVA SENHA
  // ============================
  async function salvarNovaSenha(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    // Verifica validações
    if (
      !validations.length ||
      !validations.number ||
      !validations.uppercase ||
      !validations.special ||
      !validations.match
    ) {
      return setErro("A nova senha não atende aos requisitos.");
    }

    try {
      console.log("Enviando nova senha para API...");

      const res = await fetch(`http://localhost:8080/api/usuarios/${userId}/senha`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }), // <-- Forma correta
      });

      if (!res.ok) {
        setErro("Erro ao redefinir senha.");
        return;
      }

      setMensagem("Senha redefinida com sucesso!");

      // Remove o ID da sessão
      sessionStorage.removeItem("resetUserId");

      // Redireciona para login
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);

    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Erro ao conectar ao servidor.");
    }
  }

  return (
    <>
      <Header />

      <section className={styles.hero}>
        <div className={styles.card}>
          <h2>Redefinir Senha</h2>
          <p className={styles.subtitle}>Digite sua nova senha abaixo.</p>
          <hr className={styles.divider} />

          {erro && <p className={styles.errorBox}>{erro}</p>}
          {mensagem && <p className={styles.successBox}>{mensagem}</p>}

          <form className={styles.form} onSubmit={salvarNovaSenha}>
            <label>Nova senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                validatePassword(e.target.value, confirmar);
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
            />

            <label>Confirmar nova senha</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => {
                setConfirmar(e.target.value);
                validatePassword(senha, e.target.value);
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
            />

            {/* VALIDAÇÕES */}
            {isPasswordFocused && (
              <div className={styles.validationBox}>
                <p className={validations.length ? styles.valid : styles.invalid}>
                  {validations.length ? <FaCheckCircle /> : <FaTimesCircle />}
                  Pelo menos 8 caracteres
                </p>

                <p className={validations.number ? styles.valid : styles.invalid}>
                  {validations.number ? <FaCheckCircle /> : <FaTimesCircle />}
                  Pelo menos um número
                </p>

                <p className={validations.uppercase ? styles.valid : styles.invalid}>
                  {validations.uppercase ? <FaCheckCircle /> : <FaTimesCircle />}
                  Pelo menos uma letra maiúscula
                </p>

                <p className={validations.special ? styles.valid : styles.invalid}>
                  {validations.special ? <FaCheckCircle /> : <FaTimesCircle />}
                  Pelo menos um caractere especial
                </p>

                <p className={validations.match ? styles.valid : styles.invalid}>
                  {validations.match ? <FaCheckCircle /> : <FaTimesCircle />}
                  As senhas coincidem
                </p>
              </div>
            )}

            <button className={styles.btn} type="submit">
              Salvar nova senha
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

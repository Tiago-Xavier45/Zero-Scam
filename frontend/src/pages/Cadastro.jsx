import React, { useState } from "react";
import { SiHiveBlockchain } from "react-icons/si";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Header from "../components/Header/Header";
import styles from "./Cadastro.module.css";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    cidade: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState({
    nome: "",
    sobrenome: "",
    email: "",
  });

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    number: false,
    uppercase: false,
    special: false,
    match: false,
  });

  // Atualiza os campos e faz validações básicas
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "senha" || name === "confirmarSenha") {
      validatePassword(
        name === "senha" ? value : formData.senha,
        name === "confirmarSenha" ? value : formData.confirmarSenha
      );
    }

    if (name === "nome" || name === "sobrenome" || name === "email") {
      validateField(name, value);
    }
  };

  // Valida nome, sobrenome e email
  const validateField = (name, value) => {
    let message = "";

    if ((name === "nome" || name === "sobrenome") && value.trim().length < 3) {
      message = "Deve ter pelo menos 3 caracteres.";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        message = "Digite um email válido.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  // Valida senha e confirmação
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

  // Envio do formulário
  const handleSubmit = async (e) => {
  e.preventDefault();

  validateField("nome", formData.nome);
  validateField("sobrenome", formData.sobrenome);
  validateField("email", formData.email);

  if (errors.nome || errors.sobrenome || errors.email || !validations.match) {
    console.log("Formulário inválido");
    return;
  }

  const dadosCadastro = {
    nome: formData.nome,
    sobrenome: formData.sobrenome,
    email: formData.email,
    senha: formData.senha
  };

  try {
    const response = await fetch("http://localhost:8080/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosCadastro),
    });

    if (!response.ok) {
      const err = await response.json();
      alert("Erro ao cadastrar: " + (err.erro || "Tente novamente"));
      return;
    }

    alert("Cadastro realizado com sucesso!");
    setFormData({ nome: "", sobrenome: "", email: "", senha: "", confirmarSenha: "" });
    window.location.href = "/";

  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar ao servidor.");
  }
};


  return (
    <>
      <Header />
      <section className={styles.hero}>
        <div className={styles.card}>
          <SiHiveBlockchain className={styles.logoIcon} />
          <h2>Cadastro.</h2>
          <p className={styles.subtitle}>
            Crie sua conta para acessar nossa comunidade.
          </p>
          <hr className={styles.divider} />

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  placeholder="Digite seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                  onBlur={(e) => validateField("nome", e.target.value)}
                  required
                />
                {errors.nome && <span className={styles.error}>{errors.nome}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label>Sobrenome:</label>
                <input
                  type="text"
                  name="sobrenome"
                  placeholder="Digite seu sobrenome"
                  value={formData.sobrenome}
                  onChange={handleChange}
                  onBlur={(e) => validateField("sobrenome", e.target.value)}
                  required
                />
                {errors.sobrenome && (
                  <span className={styles.error}>{errors.sobrenome}</span>
                )}
              </div>
            </div>

            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              onBlur={(e) => validateField("email", e.target.value)}
              required
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}

            <label>Senha:</label>
            <input
              type="password"
              name="senha"
              placeholder="Digite sua senha"
              value={formData.senha}
              onChange={handleChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
            />

            <label>Confirmar Senha:</label>
            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              required
            />

            {isPasswordFocused && (
              <div className={`${styles.validationBox}`}>
                <p className={validations.length ? styles.valid : styles.invalid}>
                  {validations.length ? <FaCheckCircle /> : <FaTimesCircle />} Pelo menos 8 caracteres
                </p>
                <p className={validations.number ? styles.valid : styles.invalid}>
                  {validations.number ? <FaCheckCircle /> : <FaTimesCircle />} Pelo menos um número
                </p>
                <p className={validations.uppercase ? styles.valid : styles.invalid}>
                  {validations.uppercase ? <FaCheckCircle /> : <FaTimesCircle />} Pelo menos uma letra maiúscula
                </p>
                <p className={validations.special ? styles.valid : styles.invalid}>
                  {validations.special ? <FaCheckCircle /> : <FaTimesCircle />} Pelo menos um caractere especial
                </p>
                <p className={validations.match ? styles.valid : styles.invalid}>
                  {validations.match ? <FaCheckCircle /> : <FaTimesCircle />} As senhas coincidem
                </p>
              </div>
            )}

            <button type="submit" className={styles.btn}>
              Cadastrar
            </button>
          </form>

          <p className={styles.loginText}>
            Já tem uma conta?
            <a href="/login" className={styles.loginLink}>
              Faça o login
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import styles from "./MinhaConta.module.css";
import { SiHiveBlockchain } from "react-icons/si";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function MinhaConta() {
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));

  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    cidade: "",
    estado: "",
    senha: "",
  });

  const [editando, setEditando] = useState(false);
  const [editSenha, setEditSenha] = useState(false);

  const [editData, setEditData] = useState({});
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // ESTADOS DAS VALIDAÇÕES (COPIADO DO CADASTRO)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    number: false,
    uppercase: false,
    special: false,
    match: false,
  });

  // FUNÇÃO DE VALIDAÇÃO DE SENHA (COPIADO DO CADASTRO)
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

  // 🔹 Buscar dados reais
  useEffect(() => {
    async function fetchUsuario() {
      const res = await fetch(
        `http://localhost:8080/api/usuarios/${usuarioLocal.id}`
      );
      const data = await res.json();
      setDados(data);
      setEditData(data);
    }
    fetchUsuario();
  }, []);

  function handleEditChange(e) {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  async function salvarDados() {
    setErro("");
    setMensagem("");

    const res = await fetch(
      `http://localhost:8080/api/usuarios/${usuarioLocal.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      }
    );

    if (!res.ok) return setErro("Erro ao atualizar dados.");

    const atualizado = await res.json();
    localStorage.setItem("usuario", JSON.stringify(atualizado));
    setDados(atualizado);
    setEditando(false);
    setMensagem("Dados atualizados com sucesso!");
  }

  async function salvarNovaSenha() {
    setErro("");
    setMensagem("");

    // Não deixa salvar se as regras não forem atendidas
    if (
      !validations.length ||
      !validations.number ||
      !validations.uppercase ||
      !validations.special ||
      !validations.match
    ) {
      return setErro("A nova senha não atende aos requisitos.");
    }

    if (senhaForm.senhaAtual !== dados.senha)
      return setErro("Senha atual incorreta.");

    const atualizado = { ...dados, senha: senhaForm.novaSenha };

    const res = await fetch(
      `http://localhost:8080/api/usuarios/${usuarioLocal.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atualizado),
      }
    );

    if (!res.ok) return setErro("Erro ao alterar senha.");

    const newUser = await res.json();
    localStorage.setItem("usuario", JSON.stringify(newUser));

    setDados(newUser);
    setEditSenha(false);
    setSenhaForm({
      senhaAtual: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    });

    setMensagem("Senha alterada com sucesso!");
  }

  return (
    <>
      <Header />

      <section className={styles.hero}>
        <div className={styles.card}>
          <SiHiveBlockchain className={styles.logoIcon} />
          <h2>Minha Conta</h2>
          <p className={styles.subtitle}>Gerencie seus dados com segurança.</p>
          <hr className={styles.divider} />

          {erro && <p className={styles.errorBox}>{erro}</p>}
          {mensagem && <p className={styles.successBox}>{mensagem}</p>}

          {/* VISUALIZAÇÃO */}
          {!editando && !editSenha && (
            <div className={styles.viewBox}>
              <div className={styles.row}>
                <span className={styles.label}>Nome:</span>
                <span>
                  {dados.nome} {dados.sobrenome}
                </span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Email:</span>
                <span>{dados.email}</span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Cidade:</span>
                <span>{dados.cidade}</span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Estado:</span>
                <span>{dados.estado}</span>
              </div>

              <div className={styles.rowSenha}>
                <div className={styles.row}>
                  <span className={styles.label}>Senha:</span>
                  <span className={styles.senhaValor}>***********</span>
                </div>

                <div className={styles.senhaRightBox}>
                  <button
                    className={styles.altSenhaRight}
                    onClick={() => setEditSenha(true)}
                  >
                    Alterar senha
                  </button>
                </div>
              </div>

              <button className={styles.btn} onClick={() => setEditando(true)}>
                Editar dados
              </button>
            </div>
          )}

          {/* EDITAR DADOS */}
          {editando && (
            <div>
              <h3 className={styles.sectionTitle}>Editar Dados</h3>

              <form className={styles.form}>
                <label>Nome</label>
                <input
                  name="nome"
                  value={editData.nome}
                  onChange={handleEditChange}
                />

                <label>Sobrenome</label>
                <input
                  name="sobrenome"
                  value={editData.sobrenome}
                  onChange={handleEditChange}
                />

                <label>Email</label>
                <input
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                />

                <label>Cidade</label>
                <input
                  name="cidade"
                  value={editData.cidade}
                  onChange={handleEditChange}
                />

                <label>Estado</label>
                <select
                  name="estado"
                  value={editData.estado}
                  onChange={handleEditChange}
                  className={styles.select}
                >
                  <option value="">Selecione...</option>
                  {[
                    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
                    "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
                  ].map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </form>

              <div className={styles.rowButtons}>
                <button className={styles.btn} onClick={salvarDados}>
                  Salvar
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* ALTERAR SENHA */}
          {editSenha && (
            <div>
              <h3 className={styles.sectionTitle}>Alterar Senha</h3>

              <form className={styles.form}>
                <label>Senha atual</label>
                <input
                  type="password"
                  value={senhaForm.senhaAtual}
                  onChange={(e) =>
                    setSenhaForm({
                      ...senhaForm,
                      senhaAtual: e.target.value,
                    })
                  }
                />

                <label>Nova senha</label>
                <input
                  type="password"
                  value={senhaForm.novaSenha}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => {
                    const nova = e.target.value;
                    setSenhaForm({ ...senhaForm, novaSenha: nova });
                    validatePassword(nova, senhaForm.confirmarNovaSenha);
                  }}
                />

                <label>Confirmar nova senha</label>
                <input
                  type="password"
                  value={senhaForm.confirmarNovaSenha}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => {
                    const confirm = e.target.value;
                    setSenhaForm({
                      ...senhaForm,
                      confirmarNovaSenha: confirm,
                    });
                    validatePassword(senhaForm.novaSenha, confirm);
                  }}
                />
              </form>

              {/* VALIDAÇÕES DA SENHA */}
              {isPasswordFocused && (
                <div className={styles.validationBox}>
                  <p
                    className={
                      validations.length ? styles.valid : styles.invalid
                    }
                  >
                    {validations.length ? <FaCheckCircle /> : <FaTimesCircle />}
                    Pelo menos 8 caracteres
                  </p>

                  <p
                    className={
                      validations.number ? styles.valid : styles.invalid
                    }
                  >
                    {validations.number ? <FaCheckCircle /> : <FaTimesCircle />}
                    Pelo menos um número
                  </p>

                  <p
                    className={
                      validations.uppercase ? styles.valid : styles.invalid
                    }
                  >
                    {validations.uppercase ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}
                    Pelo menos uma letra maiúscula
                  </p>

                  <p
                    className={
                      validations.special ? styles.valid : styles.invalid
                    }
                  >
                    {validations.special ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}
                    Pelo menos um caractere especial
                  </p>

                  <p
                    className={
                      validations.match ? styles.valid : styles.invalid
                    }
                  >
                    {validations.match ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}
                    As senhas coincidem
                  </p>
                </div>
              )}

              <div className={styles.rowButtons}>
                <button className={styles.btn} onClick={salvarNovaSenha}>
                  Salvar nova senha
                </button>

                <button
                  className={styles.cancelBtn}
                  onClick={() => setEditSenha(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

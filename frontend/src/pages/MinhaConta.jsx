import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import styles from "./MinhaConta.module.css";
import { SiHiveBlockchain } from "react-icons/si";

export default function MinhaConta() {
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));

  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    email: "",
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

    if (senhaForm.senhaAtual !== dados.senha)
      return setErro("Senha atual incorreta.");

    if (senhaForm.novaSenha !== senhaForm.confirmarNovaSenha)
      return setErro("As senhas não coincidem.");

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
                <span>{dados.nome} {dados.sobrenome}</span>
              </div>

              <div className={styles.row}>
                <span className={styles.label}>Email:</span>
                <span>{dados.email}</span>
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
                <input name="nome" value={editData.nome} onChange={handleEditChange} />

                <label>Sobrenome</label>
                <input name="sobrenome" value={editData.sobrenome} onChange={handleEditChange} />

                <label>Email</label>
                <input name="email" value={editData.email} onChange={handleEditChange} />
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
                    setSenhaForm({ ...senhaForm, senhaAtual: e.target.value })
                  }
                />

                <label>Nova senha</label>
                <input
                  type="password"
                  value={senhaForm.novaSenha}
                  onChange={(e) =>
                    setSenhaForm({ ...senhaForm, novaSenha: e.target.value })
                  }
                />

                <label>Confirmar nova senha</label>
                <input
                  type="password"
                  value={senhaForm.confirmarNovaSenha}
                  onChange={(e) =>
                    setSenhaForm({
                      ...senhaForm,
                      confirmarNovaSenha: e.target.value,
                    })
                  }
                />
              </form>

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

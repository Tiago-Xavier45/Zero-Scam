import React, { useState } from "react";
import { FaSpinner } from 'react-icons/fa';
import Header from "../components/Header/Header";
import styles from "./DenunciarGolpe.module.css";

export default function DenunciarGolpe() {
  const [canal, setCanal] = useState("");
  const [inputExtra, setInputExtra] = useState("");
  const [perda, setPerda] = useState("");
  const [valor, setValor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Máscara de valor em reais
  const formatarValor = (value) => {
    const num = value.replace(/\D/g, "");
    const valorFloat = (parseInt(num, 10) / 100).toFixed(2);
    return `R$ ${valorFloat.replace(".", ",")}`;
  };

  const handleValorChange = (e) => {
    const formatted = formatarValor(e.target.value);
    setValor(formatted);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  // Preparar dados para enviar
  const denunciaData = {
    link: document.querySelector('input[name="link"]').value,
    canal: canal,
    inputExtra: inputExtra,
    perda: perda,
    valorPerdido: perda === "sim" ? parseFloat(valor.replace("R$ ", "").replace(",", ".")) : 0,
    relato: document.querySelector('textarea[name="relato"]').value
  };

  try {
    const response = await fetch('http://localhost:8081/api/denuncias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(denunciaData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Denúncia criada:', data);
      
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        
        // Limpar formulário
        e.target.reset();
        setCanal("");
        setInputExtra("");
        setPerda("");
        setValor("");
      }, 2000);
    } else {
      throw new Error('Erro ao enviar denúncia');
    }
  } catch (error) {
    console.error('Erro:', error);
    setIsLoading(false);
    alert('Erro ao enviar denúncia. Tente novamente.');
  }
};

  return (
    <section className={styles.hero}>
      <Header />
      <div className={styles.contentWrapper}>
        <div className={styles.textBlock}>
          <h1>Denunciar Link.</h1>
          <p>
            Sua denúncia é essencial para proteger outras pessoas contra golpes online.
            Todas as informações enviadas são tratadas de forma completamente anônima
            e ajudam a tornar a internet mais segura para todos.
          </p>
        </div>

        <div className={styles.formCard}>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>
                  {canal === "email" ? "Link recebido por e-mail *" : "Link recebido *"}
                </label>
                <input
                  type="url"
                  name="link"
                  required
                  placeholder="https://exemplo.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Como recebeu o link?</label>
                <select
                  value={canal}
                  onChange={(e) => setCanal(e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="email">E-mail</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              {canal && (
                <div className={styles.formGroup}>
                  <label>
                    {canal === "email" ? "E-mail remetente" : "Número remetente"}
                  </label>
                  <input
                    type={canal === "email" ? "email" : "tel"}
                    value={inputExtra}
                    onChange={(e) => setInputExtra(e.target.value)}
                    placeholder={
                      canal === "email"
                        ? "exemplo@email.com"
                        : "(11) 99999-9999"
                    }
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Houve perda de algum valor?</label>
                <select
                  value={perda}
                  onChange={(e) => setPerda(e.target.value)}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>

              {perda === "sim" && (
                <div className={styles.formGroup}>
                  <label>Valor perdido (R$)</label>
                  <input
                    type="text"
                    value={valor}
                    onChange={handleValorChange}
                    placeholder="R$ 0,00"
                    maxLength={15}
                  />
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Relato *</label>
                <textarea
                  name="relato"
                  rows="4"
                  required
                  placeholder="Descreva brevemente o ocorrido..."
                ></textarea>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <FaSpinner className={styles.spin} />
                ) : (
                  "Enviar denúncia"
                )}
              </button>

            </form>
          ) : (
            <p className={styles.confirmation}>
              Obrigado! Sua denúncia foi registrada com sucesso.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

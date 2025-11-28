import React from "react";
import styles from "./RelatorioLink.module.css";

export default function RelatorioLink({ detalhes }) {
  if (!detalhes) return null;

  const { dominioRegistrado, score = 0, totalDenuncias = 0, valorColetado = 0 } =
    detalhes;

  
  const valorFormatado = valorColetado.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  
  const dica = detalhes.dicaSeguranca;

  
    const radius = 40; 
    const circumference = Math.PI * radius;
    const progress = Math.min(100, Math.max(0, score));
    const offset = circumference - (progress / 100) * circumference;

  // Cor dinâmica para o arco
  const getColor = () => {
    if (score >= 70) return "#00E676"; // verde
    if (score >= 40) return "#FFC400"; // amarelo
    return "#FF5252"; // vermelho
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Relatório Completo</h2>

      <div className={styles.grid}>
        {/* Total de denúncias */}
        <div className={styles.card}>
          <p className={styles.kicker}>TOTAL DE DENÚNCIAS:</p>
          <h3 className={styles.metric}>{totalDenuncias}</h3>
        </div>

        {/* Valor coletado */}
        <div className={styles.card}>
          <p className={styles.kicker}>VALOR TOTAL COLETADO:</p>
          <h3 className={styles.metricV}>{valorFormatado}</h3>
        </div>

        {/* Domínio */}
        <div className={styles.card}>
          <p className={styles.kicker}>O DOMÍNIO É:</p>
          <h3
            className={`${styles.metricD} ${
              dominioRegistrado ? styles.ok : styles.bad
            }`}
          >
            {dominioRegistrado ? "REGISTRADO" : "NÃO REGISTRADO"}
          </h3>
        </div>

        {/* Score */}
        <div className={styles.card}>
          <p className={styles.kicker}>SCORE DE SEGURANÇA:</p>
          <h3 className={styles.metric}>{score}</h3>

            <div className={styles.donutContainer}>
            <svg
                viewBox="0 0 100 50"
                className={styles.svgGauge}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Fundo do gauge */}
                <path
                d="M10,50 A40,40 0 0,1 90,50"
                stroke="rgba(15, 12, 20, 0.85)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                />

                {/* Arco dinâmico */}
                <path
                d="M10,50 A40,40 0 0,1 90,50"
                stroke={getColor()}
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                   transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease",
                }}
                />
            </svg>
          </div>
        </div>

        {/* Dica de segurança */}
        <div className={`${styles.card} ${styles.cardFull}`}>
          <p className={styles.kicker}>DICA DE SEGURANÇA:</p>
          <p className={styles.tip}>{dica}</p>
        </div>
      </div>
    </div>
  );
}

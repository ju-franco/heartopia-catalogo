import React from 'react';

const MARCOS = [0, 125, 135, 145, 160, 170, 180];
const MAX = 180;

const ProgressBar = ({ atual }) => {
  const porcentagem = Math.min((atual / MAX) * 100, 100);

  return (
    <div style={styles.container}>
      {/* O total de estrelas agora fica aqui em cima da barra */}
      <div style={styles.label}>⭐ {atual} / {MAX}</div>
      
      <div style={styles.trilho}>
        {/* Parte amarela que cresce */}
        <div style={{ ...styles.preenchimento, width: `${porcentagem}%` }} />
        
        {/* Os números e pinos brancos */}
        {MARCOS.map((valor) => (
          <div 
            key={valor} 
            style={{ 
              ...styles.marcador, 
              left: `${(valor / MAX) * 100}%` 
            }}
          >
            <div style={styles.pino} />
            <span style={{
              ...styles.numero,
              color: atual >= valor ? "#f7c948" : "#8d7a66"
            }}>
              {valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { 
    width: "90%", 
    maxWidth: "600px", 
    margin: "20px auto 40px",
    paddingTop: "20px" 
  },
  label: { 
    fontSize: "18px", 
    fontWeight: "800", 
    marginBottom: "15px", 
    textAlign: "center", 
    color: "#5e4d44" 
  },
  trilho: { 
    height: "16px", 
    backgroundColor: "#e0d3c5", 
    borderRadius: "10px", 
    position: "relative" 
  },
  preenchimento: { 
    height: "100%", 
    backgroundColor: "#ffcb3d", 
    borderRadius: "10px", 
    transition: "width 0.5s ease-in-out" 
  },
  marcador: { 
    position: "absolute", 
    top: 0, 
    transform: "translateX(-50%)", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center" 
  },
  pino: { 
    width: "2px", 
    height: "16px", 
    backgroundColor: "rgba(255,255,255,0.7)" 
  },
  numero: { 
    marginTop: "10px", 
    fontSize: "11px", 
    fontWeight: "bold", 
    backgroundColor: "#fff", 
    padding: "2px 6px", 
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  }
};

export default ProgressBar;
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { IoEyeOutline, IoEyeOffOutline, IoMailOutline, IoLockClosedOutline } from "react-icons/io5";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Variável para o GitHub Pages
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const handleAcesso = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      if (!isLogin) {
        await createUserWithEmailAndPassword(auth, email, senha);
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setErro("Este e-mail já está em uso.");
      else if (err.code === "auth/weak-password") setErro("A senha deve ter pelo menos 6 dígitos.");
      else setErro("E-mail ou senha inválidos!");
    }
    setCarregando(false);
  };

  return (
    <div style={{
      ...styles.authWrapper,
      backgroundImage: `url(${base}/imagens/background-login.jpg)`
    }}>
      <div style={styles.backgroundOverlay}></div>

      <div style={styles.authContainer}>
        <img
          src={`${base}/imagens/logo-heartopia.png`}
          alt="Heartopia Logo"
          style={styles.logo}
        />
        <p style={styles.subtitle}>Catálogo Funmade</p>

        <h2 style={styles.title}>{isLogin ? "Bem-vindo de volta!" : "Criar Nova Conta"}</h2>

        <form style={styles.form} onSubmit={handleAcesso}>
          <div style={styles.inputWrapper}>
            <IoMailOutline style={styles.inputIcon} />
            <input
              type="email"
              placeholder="E-mail"
              required
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputWrapper}>
            <IoLockClosedOutline style={styles.inputIcon} />
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              required
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
            />
            <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} style={styles.eyeBtn}>
              {mostrarSenha ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
            </button>
          </div>

          {erro && <p style={styles.errorText}>{erro}</p>}

          <button type="submit" disabled={carregando} style={styles.mainBtn}>
            {carregando ? "Aguarde..." : (isLogin ? "Entrar" : "Cadastrar")}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isLogin ? "Não tem uma conta?" : "Já possui uma conta?"}
          </p>
          <button
            onClick={() => { setIsLogin(!isLogin); setErro(""); }}
            style={styles.switchBtn}
          >
            {isLogin ? "Criar conta agora" : "Fazer login"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authWrapper: {
    display: "flex", justifyContent: "center", alignItems: "center", height: "100vh",
    position: "relative", overflow: "hidden", backgroundSize: "cover", backgroundPosition: "center",
    fontFamily: "'Quicksand', sans-serif",
  },
  backgroundOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255, 230, 242, 0.4)", zIndex: 1 },
  authContainer: {
    position: "relative", zIndex: 2, display: "flex", flexDirection: "column",
    alignItems: "center", padding: "40px", backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "35px", boxShadow: "0 20px 40px rgba(255, 105, 180, 0.2)",
    width: "90%", maxWidth: "400px", textAlign: "center"
  },
  logo: { width: "240px", marginBottom: "-10px" },
  subtitle: { color: "#0cb3eb", marginBottom: "20px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" },
  title: { color: "#444", fontSize: "20px", marginBottom: "25px", fontWeight: "700" },
  form: { display: "flex", flexDirection: "column", gap: "15px", width: "100%" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "15px", color: "#ffb6e6", fontSize: "20px" },
  input: {
    width: "100%", padding: "14px 45px", borderRadius: "18px", border: "2px solid #fff0f7",
    backgroundColor: "#fffafa", outline: "none", fontSize: "15px", boxSizing: "border-box",
    fontFamily: "'Quicksand', sans-serif"
  },
  eyeBtn: { position: "absolute", right: "15px", background: "none", border: "none", color: "#ffb6e6", cursor: "pointer", display: "flex", alignItems: "center" },
  mainBtn: {
    padding: "15px", backgroundColor: "#ff69b4", color: "white", border: "none",
    borderRadius: "18px", cursor: "pointer", fontWeight: "700", fontSize: "16px",
    boxShadow: "0 8px 15px rgba(255, 105, 180, 0.3)", marginTop: "10px"
  },
  errorText: { color: "#ff4d4d", fontSize: "13px", fontWeight: "600", margin: "5px 0" },
  footer: { marginTop: "25px", borderTop: "1px solid #fff0f7", paddingTop: "20px", width: "100%" },
  footerText: { color: "#888", fontSize: "14px", marginBottom: "5px" },
  switchBtn: { backgroundColor: "transparent", color: "#ff69b4", border: "none", cursor: "pointer", fontWeight: "800", fontSize: "14px", textDecoration: "underline" },
};
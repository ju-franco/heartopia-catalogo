import { useState, useEffect, useRef } from "react";
import { db, auth } from "./firebase";
import { onAuthStateChanged, signOut, updateEmail } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Login from "./components/Login";
import LoadingScreen from "./components/LoadingScreen";

import { styles, stylesIA } from "./styles";
import { aves } from "./data/aves";
import { peixes } from "./data/peixes";
import { insetos } from "./data/insetos";
import { jardinagem } from "./data/jardinagem";
import { iguarias } from "./data/iguarias";
import { esculturas } from "./data/esculturas";
import { conquistas } from "./data/conquistas";

import {
  IoLocationSharp,
  IoRainy,
  IoSunny,
  IoSnow,
  IoSearch,
  IoLogOutOutline,
  IoGiftOutline,
  IoCheckmarkSharp,
  IoSettingsOutline,
  IoPersonOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoMailOutline,
  IoImageOutline,
  IoStatsChartOutline,
  IoGlobeOutline,
  IoHeart,
  IoHeartOutline,
  IoFilterOutline,
  IoTrophyOutline,
  IoAddCircleOutline,
  IoTrashOutline,
  IoCameraOutline,
  IoSparklesOutline,
  IoArrowUp,
  IoHomeOutline,
} from "react-icons/io5";
import {
  PiRainbowCloud,
  PiBird,
  PiFish,
  PiButterfly,
  PiFlower,
  PiChefHat,
  PiMedalFill,
  PiDog,
  PiCat,
  PiSnowflake,
} from "react-icons/pi";
import { IoTimeOutline } from "react-icons/io5";
import { GiRoundStar, GiTrophy } from "react-icons/gi";
import { MdAttachMoney, MdMovieFilter } from "react-icons/md";

import { obterRespostaIA } from "./services/aiService";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState({
    nickname: "",
    avatar: "🌸",
    modoEscuro: false,
    conquistasConcluidas: [],
    pets: [],
    favoritos: [],
  });
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState("");
  const [nivelHobby, setNivelHobby] = useState(1);

  const [hoveredId, setHoveredId] = useState(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState("jardinagem");
  const [telaAtual, setTelaAtual] = useState("home");
  const [menuAberto, setMenuAberto] = useState(false);

  const [apenasFaltantes, setApenasFaltantes] = useState(false);
  const [apenasFavoritos, setApenasFavoritos] = useState(false);
  const [apenasDisponiveisAgora, setApenasDisponiveisAgora] = useState(false);
  const [climaSelecionado, setClimaSelecionado] = useState("");

  const [filtroEstrelas, setFiltroEstrelas] = useState(0); // 0 significa que o filtro está desativado

  const [novoEmail, setNovoEmail] = useState("");
  const [urlFoto, setUrlFoto] = useState("");

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  const coresFundoCategorias = {
    jardinagem: "#e8f5e9",
    peixes: "#e3f2fd",
    iguarias: "#fffde7",
    aves: "#f3e5f5",
    insetos: "#fce4ec",
    conquistas: "#fff4e6",
    cachorros: "#e1fefc",
    gatos: "#ffe0ea",
    esculturas: "#e1e3fe",
  };

  const coresDestaqueCategorias = {
    jardinagem: "#4caf50",
    peixes: "#2196f3",
    iguarias: "#ffcf54",
    aves: "#9c27b0",
    insetos: "#ff69b4",
    conquistas: "#ff9800",
    cachorros: "#16e2db",
    gatos: "#ff4375",
    esculturas: "#5e65cd",
  };

  const tabelaMetas = {
    jardinagem: [
      3, 5, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72,
      76,
    ],
    iguarias: [
      5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100,
      110, 120,
    ],
    peixes: [
      5, 10, 25, 40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220,
      235, 250, 260, 270, 280,
    ],
    insetos: [
      10, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165,
      175, 185, 200,
    ],
    aves: [
      5, 10, 15, 20, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145,
      160, 170, 180,
    ],
    esculturas: [10, 15, 20, 25, 25, 30, 40, 45, 50, 55],
  };

  const categorias = [
    { id: "jardinagem", nome: "Jardinagem", icone: <PiFlower /> },
    { id: "peixes", nome: "Peixes", icone: <PiFish /> },
    { id: "iguarias", nome: "Iguarias", icone: <PiChefHat /> },
    { id: "aves", nome: "Aves", icone: <PiBird /> },
    { id: "insetos", nome: "Insetos", icone: <PiButterfly /> },
    { id: "cachorros", nome: "Cachorros", icone: <PiDog /> },
    { id: "gatos", nome: "Gatos", icone: <PiCat /> },
    { id: "esculturas", nome: "Esculturas", icone: <PiSnowflake /> },
    { id: "conquistas", nome: "Conquistas", icone: <IoTrophyOutline /> },
  ];

  const [chatAberto, setChatAberto] = useState(false);
  const [mensagens, setMensagens] = useState([
    {
      autor: "npc",
      texto: "Olá! Sou sua IA Guia. Em que posso ajudar hoje? 🦋",
    },
  ]);
  const [inputUsuario, setInputUsuario] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [pensandoIA, setPensandoIA] = useState(false);

  const [mostrarSubir, setMostrarSubir] = useState(false);

  const irParaOTopo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const verificarScroll = () => {
      if (window.scrollY > 300) {
        setMostrarSubir(true);
      } else {
        setMostrarSubir(false);
      }
    };

    window.addEventListener("scroll", verificarScroll);
    return () => window.removeEventListener("scroll", verificarScroll);
  }, []);

  const mensagensEndRef = useRef(null);
  useEffect(() => {
    // Rola para o marcador sempre que 'mensagens' mudar
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      if (user) {
        setNovoEmail(user.email);
        carregarDadosDoUsuario(user.uid);
      } else {
        setItens([]);
        setCarregando(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    localStorage.setItem("nivelHobby", nivelHobby);
  }, [nivelHobby]);

  const carregarDadosDoUsuario = async (uid) => {
    setCarregando(true);
    const todosItensLocais = [
      ...aves,
      ...peixes,
      ...insetos,
      ...jardinagem,
      ...iguarias,
      ...esculturas,
    ];
    try {
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const itensAtualizados = todosItensLocais.map((itemLocal) => {
          const progressoNuvem = (data.itens || []).find(
            (n) => n.id === itemLocal.id,
          );
          return progressoNuvem
            ? {
                ...itemLocal,
                coletado: progressoNuvem.coletado,
                estrelas: progressoNuvem.estrelas,
              }
            : itemLocal;
        });
        setItens(itensAtualizados);
        setNivelHobby(data.nivelHobby || 1);
        setPerfil({
          nickname: data.nickname || "",
          avatar: data.avatar || "🌸",
          modoEscuro: data.modoEscuro || false,
          conquistasConcluidas: data.conquistasConcluidas || [],
          pets: data.pets || [],
          favoritos: data.favoritos || [],
        });
        setUrlFoto(data.avatar?.length > 4 ? data.avatar : "");
      } else {
        setItens(todosItensLocais);
        const inicial = {
          itens: todosItensLocais,
          nivelHobby: 1,
          nickname: "",
          avatar: "🌸",
          modoEscuro: false,
          conquistasConcluidas: [],
          pets: [],
          favoritos: [],
        };
        await setDoc(docRef, inicial);
        setPerfil(inicial);
      }
    } catch (error) {
      console.error(error);
      setItens(todosItensLocais);
    }
    setCarregando(false);
  };

  const salvarPerfil = async (novosDados) => {
    const novoPerfil = { ...perfil, ...novosDados };
    setPerfil(novoPerfil);
    if (usuario) await updateDoc(doc(db, "usuarios", usuario.uid), novosDados);
  };

  const alternarFavorito = (id) => {
    const novosFavoritos = perfil.favoritos.includes(id)
      ? perfil.favoritos.filter((favId) => favId !== id)
      : [...perfil.favoritos, id];
    salvarPerfil({ favoritos: novosFavoritos });
  };

  const alterarEmailSessao = async () => {
    try {
      await updateEmail(auth.currentUser, novoEmail);
      alert("E-mail atualizado!");
    } catch (error) {
      alert("Erro ao atualizar e-mail.");
    }
  };

  const atualizarItem = async (id, novosDados) => {
    const novaLista = itens.map((item) =>
      item.id === id ? { ...item, ...novosDados } : item,
    );
    setItens(novaLista);
    if (usuario)
      await setDoc(
        doc(db, "usuarios", usuario.uid),
        { itens: novaLista },
        { merge: true },
      );
  };

  const atualizarConquista = async (id, status) => {
    const listaAtual = perfil.conquistasConcluidas || [];
    const novaLista = status
      ? [...listaAtual, id]
      : listaAtual.filter((cid) => cid !== id);
    salvarPerfil({ conquistasConcluidas: novaLista });
  };

  const adicionarPet = (tipo) => {
    const novoPet = {
      id: Date.now().toString(),
      tipo: tipo,
      nome: tipo === "cachorros" ? "Novo Totó" : "Novo Gatinho",
      avatar: null,
      estrelas: 0,
    };
    salvarPerfil({ pets: [...perfil.pets, novoPet] });
  };

  const atualizarPet = (id, dados) => {
    const novosPets = perfil.pets.map((p) =>
      p.id === id ? { ...p, ...dados } : p,
    );
    salvarPerfil({ pets: novosPets });
  };

  const removerPet = (id) => {
    if (window.confirm("Deseja remover este pet?")) {
      const novosPets = perfil.pets.filter((p) => p.id !== id);
      salvarPerfil({ pets: novosPets });
    }
  };

  const handlePetImage = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => atualizarPet(id, { avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const enviarPergunta = async () => {
    if (!inputUsuario.trim()) return;

    const textoMsg = inputUsuario;
    setInputUsuario("");
    setMensagens((prev) => [...prev, { autor: "user", texto: textoMsg }]);
    setPensandoIA(true);

    try {
      // Juntamos apenas o que existir de fato.
      // Se 'aves' não estiver definido, ele ignora e não quebra o código.
      const todosOsDados = [
        ...aves,
        ...peixes,
        ...insetos,
        ...jardinagem,
        ...iguarias,
        ...esculturas,
      ];

      console.log("Dados enviados para o Guia:", todosOsDados.length, "itens.");

      const resposta = await obterRespostaIA(
        textoMsg,
        todosOsDados,
        perfil,
        mensagens,
      );
      setMensagens((prev) => [...prev, { autor: "npc", texto: resposta }]);
    } catch (e) {
      console.error("Erro real que aconteceu:", e); // Isso vai te mostrar a verdade no F12!
      setMensagens((prev) => [
        ...prev,
        {
          autor: "npc",
          texto: "O Guia se distraiu com uma borboleta... 🦋 Tente de novo!",
        },
      ]);
    } finally {
      setPensandoIA(false);
    }
  };

  const renderizarIconeClima = (clima) => {
    const size = "22px";
    if (!clima) return null;
    const nomeLimpo = clima
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    if (nomeLimpo === "ensolarado" || nomeLimpo === "sol")
      return <IoSunny style={{ color: "#f7c948", fontSize: size }} />;
    if (nomeLimpo === "chuva")
      return <IoRainy style={{ color: "#4da6ff", fontSize: size }} />;
    if (["arco-iris", "arcoiris"].includes(nomeLimpo))
      return <PiRainbowCloud style={{ color: "#ff00bf", fontSize: size }} />;
    return null;
  };

  const theme = perfil.modoEscuro ? darkTheme : lightTheme;
  const corFundoBase = perfil.modoEscuro
    ? theme.bg
    : coresFundoCategorias[categoriaAtiva];
  const corDestaqueAtiva = coresDestaqueCategorias[categoriaAtiva];
  const gridOpacity = perfil.modoEscuro
    ? "rgba(255,255,255,0.05)"
    : "rgba(0,0,0,0.03)";
  const corDestaqueSutil = perfil.modoEscuro
    ? "rgba(255,255,255,0.03)"
    : `${corDestaqueAtiva}10`;

  useEffect(() => {
    if (!corDestaqueAtiva || !corFundoBase) return;

    const root = document.documentElement;

    root.style.setProperty("--cor-barra-destaque", corDestaqueAtiva);
    root.style.setProperty("--cor-barra-fundo", corFundoBase);
  }, [corDestaqueAtiva, corFundoBase]);

  const itensDaCategoria = itens.filter(
    (item) => item.categoria === categoriaAtiva,
  );
  const totalColetadoGeral = itens.filter((i) => i.coletado).length;
  const porcentagemGeral =
    itens.length > 0
      ? ((totalColetadoGeral / itens.length) * 100).toFixed(1)
      : 0;
  const estrelasDaCategoriaAtiva = itensDaCategoria
    .filter((item) => item.coletado)
    .reduce((total, item) => total + (item.estrelas || 0), 0);

  const metasAtuais = tabelaMetas[categoriaAtiva] || [
    10, 20, 30, 40, 50, 60, 70,
  ];
  const valorMaximo = metasAtuais[metasAtuais.length - 1];

  const itensDaGala = itensDaCategoria.filter(
    (item) => item.evento === "Gala da Neve",
  );
  const itensLuzSombra = itensDaCategoria.filter(
    (item) => item.evento === "Luz e Sombra Onírica",
  );

  const itensFiltrados = itensDaCategoria.filter((item) => {
    const passaBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
    const passaNivel = (item.nivelNecessario || 1) <= nivelHobby;
    const passaFaltantes = apenasFaltantes ? !item.coletado : true;
    const passaFavoritos = apenasFavoritos
      ? perfil.favoritos.includes(item.id)
      : true;

    const passaEstrelas =
      filtroEstrelas > 0 ? item.estrelas === filtroEstrelas : true;

    return (
      passaBusca &&
      passaNivel &&
      passaFaltantes &&
      passaFavoritos &&
      passaEstrelas &&
      item.evento !== "Gala da Neve" &&
      item.evento !== "Luz e Sombra Onírica"
    );
  });

  const itensExibidosNoGrid = [...itensFiltrados].sort((a, b) => {
    const aFav = perfil.favoritos.includes(a.id);
    const bFav = perfil.favoritos.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  // Função auxiliar para renderizar o Card (para evitar repetição de código)
  const renderCard = (item) => {
    const isFav = perfil.favoritos.includes(item.id);
    const isGala = item.evento === "Gala da Neve";
    const isLuzSombra = item.evento === "Luz e Sombra Onírica";

    return (
      <div
        key={item.id}
        style={{
          ...styles.card,
          backgroundColor: theme.cardBg,
          border: isGala
            ? "2px solid #2196f3"
            : isLuzSombra
              ? "2px solid #aa0000"
              : item.coletado
                ? "2px solid var(--cor-destaque)"
                : isFav
                  ? "2px solid #ff4375"
                  : "2px solid transparent",
        }}
      >
        <div style={styles.cardHeader}>
          <label style={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={item.coletado}
              onChange={(e) =>
                atualizarItem(item.id, {
                  coletado: e.target.checked,
                  estrelas: e.target.checked ? item.estrelas || 1 : 0,
                })
              }
            />
            <span
              style={{
                color: item.coletado ? "var(--cor-destaque)" : "#999",
                fontWeight: "bold",
                fontSize: "10px",
              }}
            >
              {item.coletado ? "COLETADO" : "PENDENTE"}
            </span>
          </label>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            {isGala && (
              <PiSnowflake title="Gala da Neve" color="#2196f3" size={16} />
            )}
            {isLuzSombra && (
              <MdMovieFilter
                title="Luz e Sombra Onírica"
                color="#aa0000"
                size={16}
              />
            )}
            <button
              onClick={() => alternarFavorito(item.id)}
              style={{ ...styles.favBtn, color: isFav ? "#ff4375" : "#ddd" }}
            >
              {isFav ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
            </button>
          </div>
        </div>

        <img
          src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}${item.imagem}`}
          alt={item.nome}
          style={{
            ...styles.image,
            filter: item.coletado ? "none" : "grayscale(100%) opacity(0.6)",
          }}
        />
        <h3 style={{ ...styles.title, color: theme.textMain }}>{item.nome}</h3>

        {item.categoria === "jardinagem" && (
          <div style={styles.infoRow}>
            <MdAttachMoney style={{ color: "var(--cor-destaque)" }} />
            <span style={styles.infoText}>
              Semente:{" "}
              <b style={{ color: "#4caf50" }}>{item.precoSemente || "0"}</b>
            </span>
          </div>
        )}
        {["peixes", "aves", "insetos", "esculturas"].includes(
          item.categoria,
        ) && (
          <>
            <div style={styles.infoRow}>
              <IoLocationSharp style={{ color: "var(--cor-destaque)" }} />
              <span style={styles.infoText}>{item.local}</span>
            </div>
            <div style={styles.infoRow}>
              <div style={styles.climaContainer}>
                {item.clima?.map((c, i) => (
                  <span key={i}>{renderizarIconeClima(c)}</span>
                ))}
              </div>
            </div>
          </>
        )}
        {item.categoria === "peixes" && (
          <div style={styles.infoRow}>
            <div
              style={{
                ...styles.shadowBadge,
                backgroundColor:
                  item.sombra === "Dourada"
                    ? "#fff9e6"
                    : item.sombra === "Azul"
                      ? "#e6f0ff"
                      : "var(--cor-fundo-sutil)",
                color:
                  item.sombra === "Dourada"
                    ? "#d4a017"
                    : item.sombra === "Azul"
                      ? "#007bff"
                      : "var(--cor-destaque)",
              }}
            >
              Sombra: {item.sombra || "N/A"}
            </div>
          </div>
        )}
        {item.categoria !== "iguarias" && (
          <div style={styles.infoRow}>
            <IoTimeOutline style={{ color: "#888" }} />
            <span style={styles.infoText}>{item.horario}</span>
          </div>
        )}

        {/* Selo de Nível Ajustado */}
        <div
          style={{
            backgroundColor:
              nivelHobby < (item.nivelNecessario || 1)
                ? "#fff0f0"
                : "rgba(0,0,0,0.05)",
            color:
              nivelHobby < (item.nivelNecessario || 1) ? "#ff4d4d" : "#888",
            border:
              nivelHobby < (item.nivelNecessario || 1)
                ? "1px solid #ffcccb"
                : "none",
            padding: "2px 6px",
            borderRadius: "8px",
            fontSize: "10px",
            fontWeight: "800",
            fontFamily: "'Quicksand', sans-serif",

            // ESTAS DUAS LINHAS SÃO A CHAVE:
            width: "fit-content", // Faz o fundo ter exatamente o tamanho do texto
            display: "inline-flex", // Garante que ele não se comporte como um bloco que ocupa a linha toda

            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px auto",
          }}
        >
          Lv.{item.nivelNecessario || 1}
        </div>

        {item.coletado && (
          <div
            style={styles.starContainer}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip de preços (mantém igual) */}
            {hoveredId === item.id && item.precos && item.precos.length > 0 && (
              <div style={{ ...styles.tooltip, backgroundColor: theme.cardBg }}>
                {item.precos.map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.tooltipLine,
                      borderBottom: `1px solid ${theme.badgeBg}`,
                    }}
                  >
                    <span style={{ color: "#f7c948" }}>
                      {"⭐".repeat(idx + 1)}
                    </span>
                    <span
                      style={{
                        fontWeight: "700",
                        color: "var(--cor-destaque)",
                      }}
                    >
                      {p.toLocaleString("pt-BR")}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    ...styles.tooltipArrow,
                    borderColor: `${theme.cardBg} transparent transparent transparent`,
                  }}
                ></div>
              </div>
            )}

            {/* Lógica das Estrelas com Limite */}
            {[1, 2, 3, 4, 5].map((num) => {
              // Se o item tiver limiteEstrela e o número for maior que esse limite, não mostra a estrela
              if (item.limiteEstrela && num > item.limiteEstrela) return null;

              return (
                <GiRoundStar
                  key={num}
                  onClick={() => atualizarItem(item.id, { estrelas: num })}
                  style={{
                    ...styles.star,
                    color: num <= item.estrelas ? "#f7c948" : "#ddd",
                    cursor: item.limiteEstrela === 1 ? "default" : "pointer", // Remove a mãozinha se for fixo
                  }}
                />
              );
            })}

            {/* Aviso visual opcional para itens de 1 estrela */}
            {item.limiteEstrela === 1 && (
              <span
                style={{
                  fontSize: "9px",
                  color: "#999",
                  marginLeft: "5px",
                  fontWeight: "bold",
                }}
              ></span>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!usuario) return <Login />;
  if (carregando) {
    return <LoadingScreen theme={theme} />;
  }

  if (telaAtual === "home") {
    return (
      <div
        style={{
          minHeight: "100vh",
          // SUBSTITUA A LINHA ABAIXO PELO NOVO LINK:
          backgroundImage: `url("https://assetsio.gnwcdn.com/heartopia-keyart-1.jpeg?width=1200&quality=85&format=jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Quicksand",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Overlay com gradiente para melhorar leitura */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
            backdropFilter: "blur(4px)",
          }}
        />

        {/* Conteúdo Central */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {/* Header da Home */}
          <header style={{ marginBottom: "50px" }}>
            <h1
              className="titulo-home"
              style={{
                fontSize: "clamp(32px, 8vw, 64px)", // Responsivo
                fontWeight: "900",
                color: "#fff",
                margin: 0,
                textShadow:
                  "0 4px 15px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.2)",
                letterSpacing: "-1px",
              }}
            >
              Catálogo Heartopia
            </h1>
            <p
              style={{
                color: "#f0f0f0",
                fontSize: "18px",
                fontWeight: "500",
                opacity: 0.9,
                marginTop: "10px",
              }}
            >
              Sua enciclopédia mágica de bolso ✨
            </p>
          </header>

          {/* Grid de Seleção */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "15px",
              padding: "10px",
            }}
          >
            {categorias.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setCategoriaAtiva(cat.id);
                  setTelaAtual("app");
                }}
                className="card-home"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "24px",
                  padding: "25px 15px",
                  cursor: "pointer",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                {/* Círculo do Ícone */}
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: coresDestaqueCategorias[cat.id],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    color: "#fff",
                    boxShadow: `0 0 20px ${coresDestaqueCategorias[cat.id]}66`,
                  }}
                >
                  {cat.icone}
                </div>

                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#fff",
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {cat.nome}
                </h3>
              </div>
            ))}
          </div>

          {/* Footer da Home opcional */}
          <div
            style={{
              marginTop: "50px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Explore o mundo de Heartopia
          </div>
        </div>

        {/* Estilos Globais de Animação */}
        <style>{`
        .titulo-home {
          animation: floatTitle 6s ease-in-out infinite;
        }

        @keyframes floatTitle {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }

        .card-home:hover {
          transform: translateY(-12px) scale(1.03);
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .card-home:active {
          transform: scale(0.95);
        }
      `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: corFundoBase,
        backgroundImage: `linear-gradient(${gridOpacity} 1px, transparent 1px), linear-gradient(90deg, ${gridOpacity} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",

        "--cor-destaque": corDestaqueAtiva,
        "--cor-fundo-sutil": corDestaqueSutil,

        // 👇 ADICIONA ISSO
        "--cor-barra-destaque": corDestaqueAtiva,
        "--cor-barra-fundo": corFundoBase,
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.userInfoHeader}>
          <div style={styles.avatarCircle}>
            {perfil.avatar.length > 4 ? (
              <img src={perfil.avatar} alt="Avatar" style={styles.avatarImg} />
            ) : (
              perfil.avatar
            )}
          </div>
          <div>
            <div style={{ ...styles.userNickname, color: theme.textMain }}>
              {perfil.nickname || "Viajante"}
            </div>
            <div style={styles.userEmail}>{usuario.email}</div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            style={styles.settingsBtn}
          >
            <IoSettingsOutline size={20} color="var(--cor-destaque)" />
          </button>
          {menuAberto && (
            <div
              style={{ ...styles.dropdownMenu, backgroundColor: theme.cardBg }}
            >
              <p style={styles.menuTitle}>Configurações</p>
              <div style={styles.menuItem}>
                <IoPersonOutline color="var(--cor-destaque)" />
                <input
                  placeholder="Nickname"
                  value={perfil.nickname}
                  onChange={(e) => salvarPerfil({ nickname: e.target.value })}
                  style={{
                    ...styles.menuInput,
                    color: theme.textMain,
                    backgroundColor: theme.badgeBg,
                  }}
                />
              </div>
              <div style={styles.menuItem}>
                <IoMailOutline color="var(--cor-destaque)" />
                <div style={{ display: "flex", gap: "5px", width: "100%" }}>
                  <input
                    placeholder="E-mail"
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    style={{
                      ...styles.menuInput,
                      color: theme.textMain,
                      backgroundColor: theme.badgeBg,
                      fontSize: "10px",
                    }}
                  />
                  <button onClick={alterarEmailSessao} style={styles.miniBtn}>
                    OK
                  </button>
                </div>
              </div>
              <div style={styles.menuItem}>
                <IoImageOutline color="var(--cor-destaque)" />
                <input
                  placeholder="URL Avatar"
                  value={urlFoto}
                  onChange={(e) => {
                    setUrlFoto(e.target.value);
                    salvarPerfil({ avatar: e.target.value || "🌸" });
                  }}
                  style={{
                    ...styles.menuInput,
                    color: theme.textMain,
                    backgroundColor: theme.badgeBg,
                  }}
                />
              </div>
              <div
                style={{
                  ...styles.menuItem,
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  {perfil.modoEscuro ? (
                    <IoMoonOutline color="var(--cor-destaque)" />
                  ) : (
                    <IoSunnyOutline color="var(--cor-destaque)" />
                  )}
                  <span style={{ color: theme.textMain }}>Modo Escuro</span>
                </div>

                {/* O BOTÃO DESLIZANTE (TOGGLE) */}
                <div
                  onClick={() =>
                    salvarPerfil({ modoEscuro: !perfil.modoEscuro })
                  }
                  style={{
                    width: "40px",
                    height: "20px",
                    backgroundColor: perfil.modoEscuro
                      ? "var(--cor-destaque)"
                      : "#ddd",
                    borderRadius: "20px",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                      left: perfil.modoEscuro ? "22px" : "2px", // Desliza a bolinha
                      transition:
                        "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Efeito mola
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {perfil.modoEscuro ? (
                      <IoMoonOutline size={10} color="var(--cor-destaque)" />
                    ) : (
                      <IoSunnyOutline size={10} color="#f7c948" />
                    )}
                  </div>
                </div>
              </div>
              <hr style={styles.menuDivider} />
              <div
                style={{
                  ...styles.menuItem,
                  color: "#ff4d4d",
                  cursor: "pointer",
                }}
                onClick={() => signOut(auth)}
              >
                <IoLogOutOutline />
                <span>Desconectar</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav Menu */}
      <div style={styles.navMenu}>
        <button
          onClick={() => setTelaAtual("home")}
          style={{
            ...styles.navButton,
            backgroundColor: "transparent",
            color: "var(--cor-destaque)",
            borderColor: "var(--cor-destaque)",
          }}
        >
          <IoHomeOutline /> Home
        </button>

        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setCategoriaAtiva(cat.id);
              setBusca("");
              setClimaSelecionado("");
            }}
            style={{
              ...styles.navButton,
              backgroundColor:
                categoriaAtiva === cat.id
                  ? "var(--cor-destaque)"
                  : theme.cardBg,
              color:
                categoriaAtiva === cat.id ? "white" : "var(--cor-destaque)",
              borderColor: "var(--cor-destaque)",
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              transform: categoriaAtiva === cat.id ? "scale(1.1)" : "scale(1)",
            }}
          >
            <span style={styles.navIcon}>{cat.icone}</span> {cat.nome}
          </button>
        ))}
      </div>

      <div style={styles.mainContent}>
        {["cachorros", "gatos"].includes(categoriaAtiva) ? (
          <div style={styles.conquistasWrapper}>
            <div
              style={{
                ...styles.conquistasHeader,
                color: "var(--cor-destaque)",
              }}
            >
              {categoriaAtiva === "cachorros" ? (
                <PiDog size={40} />
              ) : (
                <PiCat size={40} />
              )}
              <h2>
                Meus {categoriaAtiva === "cachorros" ? "Cachorros" : "Gatos"}
              </h2>
              <p>Gerencie seus pets e suas habilidades</p>
              <button
                onClick={() => adicionarPet(categoriaAtiva)}
                style={{
                  ...styles.addPetBtn,
                  backgroundColor: "var(--cor-destaque)",
                }}
              >
                <IoAddCircleOutline size={20} /> Adicionar Pet
              </button>
            </div>
            <div style={styles.grid}>
              {perfil.pets
                .filter((p) => p.tipo === categoriaAtiva)
                .map((pet) => (
                  <div
                    key={pet.id}
                    style={{
                      ...styles.card,
                      backgroundColor: theme.cardBg,
                      border: `2px solid var(--cor-destaque)`,
                    }}
                  >
                    <div style={styles.petHeader}>
                      <button
                        onClick={() => removerPet(pet.id)}
                        style={styles.removePetBtn}
                      >
                        <IoTrashOutline size={14} />
                      </button>
                    </div>
                    <div style={styles.petAvatarWrapper}>
                      {pet.avatar ? (
                        <img
                          src={pet.avatar}
                          alt="Pet"
                          style={styles.petAvatarImg}
                        />
                      ) : (
                        <div
                          style={{
                            ...styles.petAvatarPlaceholder,
                            color: "var(--cor-destaque)",
                          }}
                        >
                          {pet.tipo === "cachorros" ? (
                            <PiDog size={40} />
                          ) : (
                            <PiCat size={40} />
                          )}
                        </div>
                      )}
                      <label
                        style={{
                          ...styles.cameraIcon,
                          backgroundColor: "var(--cor-destaque)",
                        }}
                      >
                        <IoCameraOutline size={14} color="white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePetImage(pet.id, e)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                    <input
                      style={{ ...styles.petNameInput, color: theme.textMain }}
                      value={pet.nome}
                      onChange={(e) =>
                        atualizarPet(pet.id, { nome: e.target.value })
                      }
                    />
                    <div style={styles.petSkills}>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "800",
                          color: "var(--cor-destaque)",
                          marginBottom: "5px",
                        }}
                      >
                        HABILIDADE: {pet.estrelas} / 70
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="70"
                        value={pet.estrelas}
                        onChange={(e) =>
                          atualizarPet(pet.id, {
                            estrelas: parseInt(e.target.value),
                          })
                        } // Nome correto
                        style={{
                          width: "100%",
                          accentColor: "var(--cor-destaque)",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : categoriaAtiva === "conquistas" ? (
          <div style={styles.conquistasWrapper}>
            <div
              style={{
                ...styles.conquistasHeader,
                color: "var(--cor-destaque)",
              }}
            >
              <GiTrophy size={40} />
              <h2>Galeria de Troféus</h2>
              <p>Marque suas conquistas alcançadas no jogo!</p>
            </div>
            <div style={styles.medalGrid}>
              {conquistas.map((medalha) => {
                const estaConcluida = perfil.conquistasConcluidas?.includes(
                  medalha.id,
                );
                return (
                  <div
                    key={medalha.id}
                    onClick={() =>
                      atualizarConquista(medalha.id, !estaConcluida)
                    }
                    style={{
                      ...styles.medalCard,
                      backgroundColor: theme.cardBg,
                      border: estaConcluida
                        ? `2px solid ${medalha.cor}`
                        : `2px solid transparent`,
                      opacity: estaConcluida ? 1 : 0.5,
                      cursor: "pointer",
                      transform: estaConcluida ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <div
                      style={{
                        ...styles.medalIconCircle,
                        backgroundColor: estaConcluida
                          ? `${medalha.cor}20`
                          : "#eee",
                      }}
                    >
                      <PiMedalFill
                        size={40}
                        color={estaConcluida ? medalha.cor : "#999"}
                      />
                    </div>
                    <h4
                      style={{
                        color: theme.textMain,
                        margin: "10px 0 5px 0",
                        fontSize: "14px",
                      }}
                    >
                      {medalha.nome}
                    </h4>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#888",
                        margin: 0,
                        lineHeight: "1.2",
                      }}
                    >
                      {medalha.desc}
                    </p>
                    <div
                      style={{
                        marginTop: "10px",
                        fontSize: "10px",
                        fontWeight: "800",
                        color: estaConcluida ? medalha.cor : "#ccc",
                      }}
                    >
                      {estaConcluida ? "CONQUISTADO!" : "PENDENTE"}
                    </div>
                    {estaConcluida && (
                      <div
                        style={{
                          ...styles.conquistaCheck,
                          backgroundColor: medalha.cor,
                        }}
                      >
                        <IoCheckmarkSharp color="white" size={10} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                ...styles.progressContainer,
                backgroundColor: theme.cardBg,
              }}
            >
              <div style={styles.progressHeader}>
                <div
                  style={{
                    ...styles.starBadge,
                    backgroundColor: "var(--cor-fundo-sutil)",
                  }}
                >
                  <GiRoundStar style={{ color: "#f7c948", fontSize: "20px" }} />
                  <span style={styles.progressText}>
                    {categoriaAtiva.toUpperCase()}: {estrelasDaCategoriaAtiva} /{" "}
                    {valorMaximo}
                  </span>
                </div>
              </div>
              <div
                style={{
                  ...styles.progressBarBg,
                  backgroundColor: theme.badgeBg,
                }}
              >
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${Math.min((estrelasDaCategoriaAtiva / valorMaximo) * 100, 100)}%`,
                  }}
                />
                {metasAtuais.map((marco) => (
                  <div
                    key={marco}
                    style={{
                      ...styles.marker,
                      left: `${(marco / valorMaximo) * 100}%`,
                      backgroundColor:
                        estrelasDaCategoriaAtiva >= marco
                          ? "var(--cor-destaque)"
                          : theme.cardBg,
                      border: "2px solid var(--cor-destaque)",
                    }}
                  >
                    {estrelasDaCategoriaAtiva >= marco ? (
                      <IoCheckmarkSharp size={10} color="white" />
                    ) : (
                      <IoGiftOutline size={10} color="var(--cor-destaque)" />
                    )}
                    <span style={styles.markerLabel}>{marco}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.searchAndLevelRow}>
              <div
                style={{
                  ...styles.searchWrapper,
                  backgroundColor: theme.cardBg,
                  position: "relative",
                }}
              >
                <IoSearch style={styles.searchIcon} />

                <input
                  type="text"
                  placeholder={`Procurar em ${categoriaAtiva}...`}
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  style={{
                    ...styles.searchInput,
                    backgroundColor: "transparent",
                    color: theme.textMain,
                    fontFamily: "Quicksand",
                    paddingRight: "35px", // Espaço extra para o botão X
                  }}
                />

                {/* Botão de Limpar - Só aparece se houver texto na busca */}
                {busca && (
                  <button
                    onClick={() => setBusca("")}
                    style={{
                      position: "absolute",
                      right: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--cor-destaque)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <IoTrashOutline size={16} />
                    {/* Dica: Se quiser um "X", troque IoTrashOutline por IoCloseCircle (importe do react-icons/io5) */}
                  </button>
                )}
              </div>

              <div
                style={{
                  ...styles.levelControls,
                  backgroundColor: theme.cardBg,
                }}
              >
                <span style={styles.levelLabel}>Nível</span>
                {/* Botão de Diminuir */}
                <button
                  onClick={() => {
                    const novoNivel = Math.max(1, nivelHobby - 1);
                    setNivelHobby(novoNivel);
                    salvarPerfil({ nivelHobby: novoNivel }); // Salva no Firebase
                  }}
                  style={styles.levelBtn}
                >
                  -
                </button>

                <div style={styles.levelDisplay}>{nivelHobby}</div>

                <button
                  onClick={() => {
                    const novoNivel = Math.min(14, nivelHobby + 1);
                    setNivelHobby(novoNivel);
                    salvarPerfil({ nivelHobby: novoNivel });
                  }}
                  // Desativa o botão se o nível for 14 ou maior
                  disabled={nivelHobby >= 14}
                  style={{
                    ...styles.levelBtn,
                    // Fica meio transparente e muda o cursor se estiver no máximo
                    opacity: nivelHobby >= 14 ? 0.4 : 1,
                    cursor: nivelHobby >= 14 ? "not-allowed" : "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={styles.filterRow}>
              <button
                onClick={() => setApenasFaltantes(!apenasFaltantes)}
                style={{
                  ...styles.filterBadge,
                  backgroundColor: apenasFaltantes
                    ? "var(--cor-destaque)"
                    : theme.cardBg,
                  color: apenasFaltantes ? "white" : "var(--cor-destaque)",
                  border: `2px solid var(--cor-destaque)`,
                }}
              >
                {apenasFaltantes ? <IoCheckmarkSharp /> : <IoSearch />}{" "}
                Faltantes
              </button>
              <button
                onClick={() => setApenasFavoritos(!apenasFavoritos)}
                style={{
                  ...styles.filterBadge,
                  backgroundColor: apenasFavoritos ? "#ff4375" : theme.cardBg,
                  color: apenasFavoritos ? "white" : "#ff4375",
                  border: `2px solid #ff4375`,
                }}
              >
                {apenasFavoritos ? <IoHeart /> : <IoHeartOutline />} Favoritos
              </button>
              <button
                onClick={() =>
                  setApenasDisponiveisAgora(!apenasDisponiveisAgora)
                }
                style={{
                  ...styles.filterBadge,
                  backgroundColor: apenasDisponiveisAgora
                    ? "var(--cor-destaque)"
                    : theme.cardBg,
                  color: apenasDisponiveisAgora
                    ? "white"
                    : "var(--cor-destaque)",
                  border: `2px solid var(--cor-destaque)`,
                }}
              >
                <IoTimeOutline /> Agora
              </button>

              {/* NOVO FILTRO DE ESTRELAS */}
              <div
                style={{
                  ...styles.filterBadge,
                  border: `2px solid #f7c948`,
                  backgroundColor: theme.cardBg,
                  padding: "0 10px",
                }}
              >
                <GiRoundStar
                  color={filtroEstrelas > 0 ? "#f7c948" : "#f7c948"}
                />
                <select
                  value={filtroEstrelas}
                  onChange={(e) => setFiltroEstrelas(parseInt(e.target.value))}
                  style={{
                    ...styles.selectInput,
                    color: "#d4a017",
                    backgroundColor: "transparent",
                  }}
                >
                  <option value="0">Estrelas</option>
                  <option value="1">1 Estrela</option>
                  <option value="2">2 Estrelas</option>
                  <option value="3">3 Estrelas</option>
                  <option value="4">4 Estrelas</option>
                  <option value="5">5 Estrelas</option>
                </select>
              </div>
            </div>

            {/* SEÇÃO NOVA: ITENS DO EVENTO GALA DA NEVE */}
            {itensDaGala.length > 0 && !busca && (
              <div style={styles.eventSection}>
                <div style={styles.eventHeader}>
                  <PiSnowflake size={24} color="#2196f3" />
                  <h2 style={styles.eventTitle}>Gala da Neve</h2>
                  <div style={styles.eventBadge}>Limitado</div>
                </div>
                <div style={styles.grid}>
                  {itensDaGala.map((item) => renderCard(item))}
                </div>
                <div style={styles.sectionDivider} />
              </div>
            )}

            {/* SEÇÃO: LUZ E SOMBRA ONÍRICA */}
            {itensLuzSombra.length > 0 && !busca && (
              <div
                style={{
                  ...styles.eventSection,
                  borderColor: "#aa0000", // Cor do pontilhado (Vermelho/Vinho)
                  backgroundColor: "rgba(170, 0, 0, 0.05)", // Fundo sutil avermelhado
                  borderStyle: "dashed", // Garante que seja pontilhado
                }}
              >
                <div style={styles.eventHeader}>
                  <MdMovieFilter size={24} color="#aa0000" />
                  <h2 style={{ ...styles.eventTitle, color: "#aa0000" }}>
                    Luz e Sombra Onírica
                  </h2>
                  <div
                    style={{ ...styles.eventBadge, backgroundColor: "#aa0000" }}
                  >
                    Limitado
                  </div>
                </div>

                <div style={styles.grid}>
                  {itensLuzSombra.map((item) => renderCard(item))}
                </div>
                <div style={styles.sectionDivider} />
              </div>
            )}

            {/* GRID PRINCIPAL (ITENS NORMAIS) */}
            <div style={styles.grid}>
              {itensExibidosNoGrid.map((item) => renderCard(item))}
            </div>
          </>
        )}
      </div>

      <footer
        style={{
          ...styles.ft_container,
          borderTop: `2px dashed var(--cor-destaque)`,
          backgroundColor: theme.badgeBg,
        }}
      >
        <div style={styles.ft_grid}>
          <div style={styles.ft_column}>
            <div style={{ ...styles.ft_title, color: "var(--cor-destaque)" }}>
              <IoStatsChartOutline /> Seu Progresso Global
            </div>
            <div style={styles.ft_stat_row}>
              <span style={{ color: theme.textMain, fontWeight: "700" }}>
                Conclusão
              </span>
              <div
                style={{ ...styles.ft_bar_bg, backgroundColor: theme.cardBg }}
              >
                <div
                  style={{
                    ...styles.ft_bar_fill,
                    width: `${porcentagemGeral}%`,
                  }}
                ></div>
              </div>
              <span style={{ color: "var(--cor-destaque)", fontWeight: "800" }}>
                {porcentagemGeral}%
              </span>
            </div>
            <p style={styles.ft_description}>
              Você já registrou <b>{totalColetadoGeral}</b> de{" "}
              <b>{itens.length}</b> itens.
            </p>
          </div>
          <div style={styles.ft_column}>
            <div style={{ ...styles.ft_title, color: "var(--cor-destaque)" }}>
              <IoHeart /> Links Úteis
            </div>
            <a
              href="https://heartopia.xd.com/pt/"
              target="_blank"
              rel="noreferrer"
              style={styles.ft_link}
            >
              <IoGlobeOutline /> Site Oficial
            </a>
          </div>
          <div style={styles.ft_column}>
            <div style={{ ...styles.ft_title, color: "var(--cor-destaque)" }}>
              Catálogo Heartopia
            </div>
            <div style={{ ...styles.ft_credit_tag, color: theme.textMain }}>
              Desenvolvido por fãs.
            </div>
            <p style={styles.ft_disclaimer}>Guia independente. © 2026</p>
          </div>
        </div>
      </footer>

      {/* Só aparece se mostrarSubir for true */}
      {mostrarSubir && (
        <button onClick={irParaOTopo} style={styles.btnSubirTopo}>
          <IoArrowUp size={24} />
        </button>
      )}

      {/* --- CÓDIGO DO CHAT IA --- */}
      <div
        style={stylesIA.chatFloatingBtn}
        onClick={() => setChatAberto(!chatAberto)}
      >
        <IoSparklesOutline />
      </div>

      {chatAberto && (
        <div style={stylesIA.chatWindow}>
          <div style={stylesIA.chatHeader}>
            <PiButterfly size={20} /> Guia da Natureza
          </div>
          <div style={stylesIA.messageArea}>
            {mensagens.map((m, i) => (
              <div
                key={i}
                style={m.autor === "user" ? stylesIA.msgUser : stylesIA.msgNPC}
              >
                {m.texto}
              </div>
            ))}

            <div ref={mensagensEndRef} />

            {carregando && (
              <small style={{ color: "#999", marginLeft: "10px" }}>
                O Guia está pensando...
              </small>
            )}
          </div>
          <div style={stylesIA.inputArea}>
            <input
              style={stylesIA.inputField}
              value={inputUsuario}
              onChange={(e) => setInputUsuario(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && enviarPergunta()}
              placeholder="Pergunte ao Guia..."
            />
            <button
              onClick={enviarPergunta}
              style={{
                border: "none",
                background: "none",
                color: "var(--cor-destaque)",
                cursor: "pointer",
              }}
            >
              <IoSearch size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const lightTheme = {
  bg: "#ffe6f2",
  cardBg: "#fff",
  textMain: "#333",
  badgeBg: "#fff0f7",
};
const darkTheme = {
  bg: "#0d0d0f", // fundo quase preto
  cardBg: "#1a1a1d", // cards bem escuros
  textMain: "#f5f5f5", // branco suave (não cansa)
  badgeBg: "#2a2a2e", // elementos secundários
};

export default App;

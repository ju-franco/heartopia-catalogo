import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { onAuthStateChanged, signOut, updateEmail } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Login from "./components/Login";

// Importe de dados
import { aves } from "./data/aves";
import { peixes } from "./data/peixes";
import { insetos } from "./data/insetos";
import { jardinagem } from "./data/jardinagem";
import { iguarias } from "./data/iguarias";
import { conquistas } from "./data/conquistas";

import {
  IoLocationSharp, IoRainy, IoSunny, IoSnow, IoSearch,
  IoLogOutOutline, IoGiftOutline, IoCheckmarkSharp, IoSettingsOutline,
  IoPersonOutline, IoMoonOutline, IoSunnyOutline, IoMailOutline, IoImageOutline,
  IoStatsChartOutline, IoGlobeOutline, IoHeart, IoHeartOutline, IoFilterOutline, IoTrophyOutline,
  IoAddCircleOutline, IoTrashOutline, IoCameraOutline
} from "react-icons/io5";
import { PiRainbowCloud, PiBird, PiFish, PiBug, PiFlower, PiChefHat, PiMedalFill, PiDog, PiCat } from "react-icons/pi";
import { IoTimeOutline } from "react-icons/io5";
import { GiRoundStar, GiTrophy } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [perfil, setPerfil] = useState({ 
    nickname: "", 
    avatar: "🌸", 
    modoEscuro: false,
    conquistasConcluidas: [],
    pets: [],
    favoritos: [] 
  });
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState("");
  const [nivelHobby, setNivelHobby] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState("jardinagem");
  const [menuAberto, setMenuAberto] = useState(false);

  const [apenasFaltantes, setApenasFaltantes] = useState(false);
  const [apenasFavoritos, setApenasFavoritos] = useState(false);
  const [apenasDisponiveisAgora, setApenasDisponiveisAgora] = useState(false);
  const [climaSelecionado, setClimaSelecionado] = useState("");

  const [novoEmail, setNovoEmail] = useState("");
  const [urlFoto, setUrlFoto] = useState("");

  const coresFundoCategorias = {
    jardinagem: "#e8f5e9",
    peixes: "#e3f2fd",
    iguarias: "#fffde7",
    aves: "#f3e5f5",
    insetos: "#fce4ec",
    conquistas: "#fff4e6",
    cachorros: "#e1fefc",
    gatos: "#ffe0ea"
  };

  const coresDestaqueCategorias = {
    jardinagem: "#4caf50",
    peixes: "#2196f3",
    iguarias: "#ffcf54",
    aves: "#9c27b0",
    insetos: "#ff69b4",
    conquistas: "#ff9800",
    cachorros: "#16e2db",
    gatos: "#ff4375"
  };

  const tabelaMetas = {
    jardinagem: [3, 5, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76],
    iguarias: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100, 110, 120],
    peixes: [5, 10, 25, 40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190, 205, 220, 235, 250, 260, 270, 280],
    insetos: [10, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 165, 175, 185, 200],
    aves: [5, 10, 15, 20, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 160, 170, 180]
  };

  const categorias = [
    { id: "jardinagem", nome: "Jardinagem", icone: <PiFlower /> },
    { id: "peixes", nome: "Peixes", icone: <PiFish /> },
    { id: "iguarias", nome: "Iguarias", icone: <PiChefHat /> },
    { id: "aves", nome: "Aves", icone: <PiBird /> },
    { id: "insetos", nome: "Insetos", icone: <PiBug /> },
    { id: "cachorros", nome: "Cachorros", icone: <PiDog /> },
    { id: "gatos", nome: "Gatos", icone: <PiCat /> },
    { id: "conquistas", nome: "Conquistas", icone: <IoTrophyOutline /> },
  ];

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

  const carregarDadosDoUsuario = async (uid) => {
    setCarregando(true);
    const todosItensLocais = [...aves, ...peixes, ...insetos, ...jardinagem, ...iguarias];
    try {
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const itensAtualizados = todosItensLocais.map(itemLocal => {
          const progressoNuvem = (data.itens || []).find(n => n.id === itemLocal.id);
          return progressoNuvem ? { ...itemLocal, coletado: progressoNuvem.coletado, estrelas: progressoNuvem.estrelas } : itemLocal;
        });
        setItens(itensAtualizados);
        setNivelHobby(data.nivelHobby || 1);
        setPerfil({
          nickname: data.nickname || "",
          avatar: data.avatar || "🌸",
          modoEscuro: data.modoEscuro || false,
          conquistasConcluidas: data.conquistasConcluidas || [],
          pets: data.pets || [],
          favoritos: data.favoritos || []
        });
        setUrlFoto(data.avatar?.length > 4 ? data.avatar : "");
      } else {
        setItens(todosItensLocais);
        const inicial = { itens: todosItensLocais, nivelHobby: 1, nickname: "", avatar: "🌸", modoEscuro: false, conquistasConcluidas: [], pets: [], favoritos: [] };
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
      ? perfil.favoritos.filter(favId => favId !== id)
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
    const novaLista = itens.map((item) => item.id === id ? { ...item, ...novosDados } : item);
    setItens(novaLista);
    if (usuario) await setDoc(doc(db, "usuarios", usuario.uid), { itens: novaLista }, { merge: true });
  };

  const atualizarConquista = async (id, status) => {
    const listaAtual = perfil.conquistasConcluidas || [];
    const novaLista = status ? [...listaAtual, id] : listaAtual.filter(cid => cid !== id);
    salvarPerfil({ conquistasConcluidas: novaLista });
  };

  const adicionarPet = (tipo) => {
    const novoPet = {
      id: Date.now().toString(),
      tipo: tipo,
      nome: tipo === "cachorros" ? "Novo Totó" : "Novo Gatinho",
      avatar: null,
      estrelas: 0
    };
    salvarPerfil({ pets: [...perfil.pets, novoPet] });
  };

  const atualizarPet = (id, dados) => {
    const novosPets = perfil.pets.map(p => p.id === id ? { ...p, ...dados } : p);
    salvarPerfil({ pets: novosPets });
  };

  const removerPet = (id) => {
    if (window.confirm("Deseja remover este pet?")) {
      const novosPets = perfil.pets.filter(p => p.id !== id);
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

  const renderizarIconeClima = (clima) => {
    const size = "22px";
    if (!clima) return null;
    const nomeLimpo = clima.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if (nomeLimpo === "ensolarado" || nomeLimpo === "sol") return <IoSunny style={{ color: "#f7c948", fontSize: size }} />;
    if (nomeLimpo === "chuva") return <IoRainy style={{ color: "#4da6ff", fontSize: size }} />;
    if (nomeLimpo === "neve") return <IoSnow style={{ color: "#a3f0ff", fontSize: size }} />;
    if (["arco-iris", "arcoiris"].includes(nomeLimpo)) return <PiRainbowCloud style={{ color: "#ff00bf", fontSize: size }} />;
    return null;
  };

  const theme = perfil.modoEscuro ? darkTheme : lightTheme;
  const corFundoBase = perfil.modoEscuro ? theme.bg : coresFundoCategorias[categoriaAtiva];
  const corDestaqueAtiva = coresDestaqueCategorias[categoriaAtiva];
  const gridOpacity = perfil.modoEscuro ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  const corDestaqueSutil = perfil.modoEscuro ? "rgba(255,255,255,0.03)" : `${corDestaqueAtiva}10`;

  const itensDaCategoria = itens.filter(item => item.categoria === categoriaAtiva);
  const totalColetadoGeral = itens.filter(i => i.coletado).length;
  const porcentagemGeral = itens.length > 0 ? ((totalColetadoGeral / itens.length) * 100).toFixed(1) : 0;
  const estrelasDaCategoriaAtiva = itensDaCategoria.filter((item) => item.coletado).reduce((total, item) => total + (item.estrelas || 0), 0);

  const metasAtuais = tabelaMetas[categoriaAtiva] || [10, 20, 30, 40, 50, 60, 70];
  const valorMaximo = metasAtuais[metasAtuais.length - 1];

  const itensFiltrados = itensDaCategoria.filter(item => {
    const passaBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
    const passaNivel = (item.nivelNecessario || 1) <= nivelHobby;
    const passaFaltantes = apenasFaltantes ? !item.coletado : true;
    const passaFavoritos = apenasFavoritos ? perfil.favoritos.includes(item.id) : true;
    
    let passaClima = true;
    if (climaSelecionado !== "") {
      passaClima = item.clima && item.clima.some(c => c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(climaSelecionado));
    }
    
    let passaDisponivel = true;
    if (apenasDisponiveisAgora && item.horario && item.horario !== "O dia todo") {
      const horaAtual = new Date().getHours();
      const horas = item.horario.match(/\d+/g);
      if (horas && horas.length >= 2) {
        const inicio = parseInt(horas[0]);
        const fim = parseInt(horas[2]);
        passaDisponivel = inicio < fim ? (horaAtual >= inicio && horaAtual < fim) : (horaAtual >= inicio || horaAtual < fim);
      }
    }
    return passaBusca && passaNivel && passaFaltantes && passaDisponivel && passaClima && passaFavoritos;
  });

  const itensExibidosNoGrid = [...itensFiltrados].sort((a, b) => {
    const aFav = perfil.favoritos.includes(a.id);
    const bFav = perfil.favoritos.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  if (!usuario) return <Login />;
  if (carregando) return <div style={{ ...styles.loading, backgroundColor: theme.bg }}><h2 style={{ fontFamily: 'Quicksand' }}>Carregando Heartopia... 🌸</h2></div>;

  return (
    <div style={{ 
      ...styles.container, 
      backgroundColor: corFundoBase,
      backgroundImage: `linear-gradient(${gridOpacity} 1px, transparent 1px), linear-gradient(90deg, ${gridOpacity} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      '--cor-destaque': corDestaqueAtiva,
      '--cor-fundo-sutil': corDestaqueSutil,
    }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.userInfoHeader}>
          <div style={styles.avatarCircle}>
            {perfil.avatar.length > 4 ? <img src={perfil.avatar} alt="Avatar" style={styles.avatarImg} /> : perfil.avatar}
          </div>
          <div>
            <div style={{ ...styles.userNickname, color: theme.textMain }}>{perfil.nickname || "Viajante"}</div>
            <div style={styles.userEmail}>{usuario.email}</div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuAberto(!menuAberto)} style={styles.settingsBtn}>
            <IoSettingsOutline size={20} color="var(--cor-destaque)" />
          </button>
          {menuAberto && (
            <div style={{ ...styles.dropdownMenu, backgroundColor: theme.cardBg }}>
              <p style={styles.menuTitle}>Configurações</p>
              <div style={styles.menuItem}><IoPersonOutline color="var(--cor-destaque)" /><input placeholder="Nickname" value={perfil.nickname} onChange={(e) => salvarPerfil({ nickname: e.target.value })} style={{ ...styles.menuInput, color: theme.textMain, backgroundColor: theme.badgeBg }} /></div>
              <div style={styles.menuItem}><IoMailOutline color="var(--cor-destaque)" /><div style={{ display: 'flex', gap: '5px', width: '100%' }}><input placeholder="E-mail" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} style={{ ...styles.menuInput, color: theme.textMain, backgroundColor: theme.badgeBg, fontSize: '10px' }} /><button onClick={alterarEmailSessao} style={styles.miniBtn}>OK</button></div></div>
              <div style={styles.menuItem}><IoImageOutline color="var(--cor-destaque)" /><input placeholder="URL Avatar" value={urlFoto} onChange={(e) => { setUrlFoto(e.target.value); salvarPerfil({ avatar: e.target.value || "🌸" }); }} style={{ ...styles.menuInput, color: theme.textMain, backgroundColor: theme.badgeBg }} /></div>
              <div style={styles.menuItem} onClick={() => salvarPerfil({ modoEscuro: !perfil.modoEscuro })}>{perfil.modoEscuro ? <IoSunnyOutline color="var(--cor-destaque)" /> : <IoMoonOutline color="var(--cor-destaque)" />}<span style={{ color: theme.textMain }}>Modo {perfil.modoEscuro ? "Claro" : "Escuro"}</span></div>
              <hr style={styles.menuDivider} /><div style={{ ...styles.menuItem, color: "#ff4d4d", cursor: 'pointer' }} onClick={() => signOut(auth)}><IoLogOutOutline /><span>Desconectar</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Nav Menu Mobile Ready */}
      <div style={styles.navMenu}>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setCategoriaAtiva(cat.id); setBusca(""); setClimaSelecionado(""); }}
            style={{ ...styles.navButton, backgroundColor: categoriaAtiva === cat.id ? "var(--cor-destaque)" : theme.cardBg, color: categoriaAtiva === cat.id ? "white" : "var(--cor-destaque)", borderColor: "var(--cor-destaque)" }}
          >
            <span style={styles.navIcon}>{cat.icone}</span> {cat.nome}
          </button>
        ))}
      </div>

      <div style={styles.mainContent}>
        {["cachorros", "gatos"].includes(categoriaAtiva) ? (
          <div style={styles.conquistasWrapper}>
            <div style={{...styles.conquistasHeader, color: "var(--cor-destaque)"}}>
              {categoriaAtiva === "cachorros" ? <PiDog size={40} /> : <PiCat size={40} />}
              <h2>Meus {categoriaAtiva === "cachorros" ? "Cachorros" : "Gatos"}</h2>
              <p>Gerencie seus pets e suas habilidades</p>
              <button onClick={() => adicionarPet(categoriaAtiva)} style={{...styles.addPetBtn, backgroundColor: "var(--cor-destaque)"}}>
                <IoAddCircleOutline size={20} /> Adicionar Pet
              </button>
            </div>
            <div style={styles.grid}>
              {perfil.pets.filter(p => p.tipo === categoriaAtiva).map(pet => (
                <div key={pet.id} style={{ ...styles.card, backgroundColor: theme.cardBg, border: `2px solid var(--cor-destaque)` }}>
                  <div style={styles.petHeader}>
                    <button onClick={() => removerPet(pet.id)} style={styles.removePetBtn}><IoTrashOutline size={14}/></button>
                  </div>
                  <div style={styles.petAvatarWrapper}>
                    {pet.avatar ? (
                      <img src={pet.avatar} alt="Pet" style={styles.petAvatarImg} />
                    ) : (
                      <div style={{...styles.petAvatarPlaceholder, color: "var(--cor-destaque)"}}>
                        {pet.tipo === "cachorros" ? <PiDog size={40} /> : <PiCat size={40} />}
                      </div>
                    )}
                    <label style={{...styles.cameraIcon, backgroundColor: "var(--cor-destaque)"}}>
                      <IoCameraOutline size={14} color="white" />
                      <input type="file" accept="image/*" onChange={(e) => handlePetImage(pet.id, e)} style={{ display: 'none' }} />
                    </label>
                  </div>
                  <input 
                    style={{...styles.petNameInput, color: theme.textMain}} 
                    value={pet.nome} 
                    onChange={(e) => atualizarPet(pet.id, { nome: e.target.value })}
                  />
                  <div style={styles.petSkills}>
                    <div style={{fontSize: '11px', fontWeight: '800', color: "var(--cor-destaque)", marginBottom: '5px'}}>
                      HABILIDADE: {pet.estrelas} / 70
                    </div>
                    <input 
                      type="range" min="0" max="70" value={pet.estrelas} 
                      onChange={(e) => atualizarPet(pet.id, { estrelas: parseInt(e.target.value) })}
                      style={{width: '100%', accentColor: "var(--cor-destaque)"}}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : categoriaAtiva === "conquistas" ? (
          <div style={styles.conquistasWrapper}>
            <div style={{...styles.conquistasHeader, color: "var(--cor-destaque)"}}>
              <GiTrophy size={40} />
              <h2>Galeria de Troféus</h2>
              <p>Marque suas conquistas alcançadas no jogo!</p>
            </div>
            <div style={styles.medalGrid}>
              {conquistas.map(medalha => {
                const estaConcluida = perfil.conquistasConcluidas?.includes(medalha.id);
                return (
                  <div 
                    key={medalha.id} 
                    onClick={() => atualizarConquista(medalha.id, !estaConcluida)}
                    style={{ 
                      ...styles.medalCard, 
                      backgroundColor: theme.cardBg, 
                      border: estaConcluida ? `2px solid ${medalha.cor}` : `2px solid transparent`, 
                      opacity: estaConcluida ? 1 : 0.5,
                      cursor: 'pointer',
                      transform: estaConcluida ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <div style={{ ...styles.medalIconCircle, backgroundColor: estaConcluida ? `${medalha.cor}20` : '#eee' }}>
                      <PiMedalFill size={40} color={estaConcluida ? medalha.cor : "#999"} />
                    </div>
                    <h4 style={{ color: theme.textMain, margin: '10px 0 5px 0', fontSize: '14px' }}>{medalha.nome}</h4>
                    <p style={{ fontSize: '11px', color: '#888', margin: 0, lineHeight: '1.2' }}>{medalha.desc}</p>
                    <div style={{ marginTop: '10px', fontSize: '10px', fontWeight: '800', color: estaConcluida ? medalha.cor : '#ccc' }}>
                      {estaConcluida ? "CONQUISTADO!" : "PENDENTE"}
                    </div>
                    {estaConcluida && (
                      <div style={{...styles.conquistaCheck, backgroundColor: medalha.cor}}><IoCheckmarkSharp color="white" size={10} /></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div style={{ ...styles.progressContainer, backgroundColor: theme.cardBg }}>
              <div style={styles.progressHeader}>
                <div style={{ ...styles.starBadge, backgroundColor: "var(--cor-fundo-sutil)" }}>
                  <GiRoundStar style={{ color: "#f7c948", fontSize: "20px" }} />
                  <span style={styles.progressText}>{categoriaAtiva.toUpperCase()}: {estrelasDaCategoriaAtiva} / {valorMaximo}</span>
                </div>
              </div>
              <div style={{ ...styles.progressBarBg, backgroundColor: theme.badgeBg }}>
                <div style={{ ...styles.progressBarFill, width: `${Math.min((estrelasDaCategoriaAtiva / valorMaximo) * 100, 100)}%` }} />
                {metasAtuais.map(marco => (
                  <div key={marco} style={{ ...styles.marker, left: `${(marco / valorMaximo) * 100}%`, backgroundColor: estrelasDaCategoriaAtiva >= marco ? "var(--cor-destaque)" : theme.cardBg, border: "2px solid var(--cor-destaque)" }}>
                    {estrelasDaCategoriaAtiva >= marco ? <IoCheckmarkSharp size={10} color="white" /> : <IoGiftOutline size={10} color="var(--cor-destaque)" />}
                    <span style={styles.markerLabel}>{marco}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.searchAndLevelRow}>
              <div style={{ ...styles.searchWrapper, backgroundColor: theme.cardBg }}>
                <IoSearch style={styles.searchIcon} />
                <input type="text" placeholder={`Procurar em ${categoriaAtiva}...`} value={busca} onChange={(e) => setBusca(e.target.value)} style={{ ...styles.searchInput, backgroundColor: "transparent", color: theme.textMain, fontFamily: 'Quicksand' }} />
              </div>
              <div style={{ ...styles.levelControls, backgroundColor: theme.cardBg }}>
                <span style={styles.levelLabel}>Nível</span>
                <button onClick={() => setNivelHobby(prev => Math.max(1, prev - 1))} style={styles.levelBtn}>-</button>
                <div style={styles.levelDisplay}>{nivelHobby}</div>
                <button onClick={() => setNivelHobby(prev => Math.min(10, prev + 1))} style={styles.levelBtn}>+</button>
              </div>
            </div>

            <div style={styles.filterRow}>
              <button onClick={() => setApenasFaltantes(!apenasFaltantes)} style={{ ...styles.filterBadge, backgroundColor: apenasFaltantes ? "var(--cor-destaque)" : theme.cardBg, color: apenasFaltantes ? "white" : "var(--cor-destaque)", border: `2px solid var(--cor-destaque)` }}>{apenasFaltantes ? <IoCheckmarkSharp /> : <IoSearch />} Faltantes</button>
              <button onClick={() => setApenasFavoritos(!apenasFavoritos)} style={{ ...styles.filterBadge, backgroundColor: apenasFavoritos ? "#ff4375" : theme.cardBg, color: apenasFavoritos ? "white" : "#ff4375", border: `2px solid #ff4375` }}>{apenasFavoritos ? <IoHeart /> : <IoHeartOutline />} Favoritos</button>
              <button onClick={() => setApenasDisponiveisAgora(!apenasDisponiveisAgora)} style={{ ...styles.filterBadge, backgroundColor: apenasDisponiveisAgora ? "var(--cor-destaque)" : theme.cardBg, color: apenasDisponiveisAgora ? "white" : "var(--cor-destaque)", border: `2px solid var(--cor-destaque)` }}><IoTimeOutline /> Agora</button>
              {["peixes", "aves", "insetos"].includes(categoriaAtiva) && (
                <div style={{ ...styles.filterBadge, border: `2px solid var(--cor-destaque)`, backgroundColor: theme.cardBg, padding: '0 10px' }}><IoFilterOutline color="var(--cor-destaque)" />
                  <select value={climaSelecionado} onChange={(e) => setClimaSelecionado(e.target.value)} style={{ ...styles.selectInput, color: "var(--cor-destaque)", backgroundColor: "transparent" }}>
                    <option value="">Clima</option><option value="sol">Sol</option><option value="chuva">Chuva</option><option value="neve">Neve</option><option value="arco-iris">Arco-íris</option>
                  </select>
                </div>
              )}
            </div>

            <div style={styles.grid}>
              {itensExibidosNoGrid.map((item) => {
                const isFav = perfil.favoritos.includes(item.id);
                return (
                  <div key={item.id} style={{ ...styles.card, backgroundColor: theme.cardBg, border: item.coletado ? "2px solid var(--cor-destaque)" : isFav ? "2px solid #ff4375" : "2px solid transparent" }}>
                    <div style={styles.cardHeader}>
                       <label style={styles.checkboxContainer}><input type="checkbox" checked={item.coletado} onChange={(e) => atualizarItem(item.id, { coletado: e.target.checked, estrelas: e.target.checked ? (item.estrelas || 1) : 0 })} /><span style={{ color: item.coletado ? "var(--cor-destaque)" : "#999", fontWeight: "bold", fontSize: "10px" }}>{item.coletado ? "COLETADO" : "PENDENTE"}</span></label>
                       <button onClick={() => alternarFavorito(item.id)} style={{...styles.favBtn, color: isFav ? "#ff4375" : "#ddd"}}>
                         {isFav ? <IoHeart size={20}/> : <IoHeartOutline size={20}/>}
                       </button>
                    </div>
                    <img src={item.imagem} alt={item.nome} style={{ ...styles.image, filter: item.coletado ? "none" : "grayscale(100%) opacity(0.6)" }} />
                    <h3 style={{ ...styles.title, color: theme.textMain }}>{item.nome}</h3>
                    {item.categoria === "jardinagem" && (<div style={styles.infoRow}><MdAttachMoney style={{ color: "var(--cor-destaque)" }} /><span style={styles.infoText}>Semente: <b style={{ color: '#4caf50' }}>{item.precoSemente || "0"}</b></span></div>)}
                    {["peixes", "aves", "insetos"].includes(item.categoria) && (<><div style={styles.infoRow}><IoLocationSharp style={{ color: "var(--cor-destaque)" }} /><span style={styles.infoText}>{item.local}</span></div><div style={styles.infoRow}><div style={styles.climaContainer}>{item.clima?.map((c, i) => <span key={i}>{renderizarIconeClima(c)}</span>)}</div></div></>)}
                    {item.categoria === "peixes" && (<div style={styles.infoRow}><div style={{ ...styles.shadowBadge, backgroundColor: item.sombra === "Dourada" ? "#fff9e6" : item.sombra === "Azul" ? "#e6f0ff" : "var(--cor-fundo-sutil)", color: item.sombra === "Dourada" ? "#d4a017" : item.sombra === "Azul" ? "#007bff" : "var(--cor-destaque)" }}>Sombra: {item.sombra || "N/A"}</div></div>)}
                    {item.categoria !== "iguarias" && (<div style={styles.infoRow}><IoTimeOutline style={{ color: "#888" }} /><span style={styles.infoText}>{item.horario}</span></div>)}
                    {item.coletado && (
                      <div style={styles.starContainer} onMouseEnter={() => setHoveredId(item.id)} onMouseLeave={() => setHoveredId(null)}>
                        {hoveredId === item.id && item.precos && item.precos.length > 0 && (
                          <div style={{ ...styles.tooltip, backgroundColor: theme.cardBg }}>
                            {item.precos.map((p, idx) => (
                              <div key={idx} style={{ ...styles.tooltipLine, borderBottom: `1px solid ${theme.badgeBg}` }}><span style={{ color: '#f7c948' }}>{"⭐".repeat(idx + 1)}</span><span style={{ fontWeight: '700', color: "var(--cor-destaque)" }}>{p.toLocaleString('pt-BR')}</span></div>
                            ))}
                            <div style={{ ...styles.tooltipArrow, borderColor: `${theme.cardBg} transparent transparent transparent` }}></div>
                          </div>
                        )}
                        {[1, 2, 3, 4, 5].map((num) => (<GiRoundStar key={num} onClick={() => atualizarItem(item.id, { estrelas: num })} style={{ ...styles.star, color: num <= item.estrelas ? "#f7c948" : "#ddd" }} />))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <footer style={{ ...styles.ft_container, borderTop: `2px dashed var(--cor-destaque)`, backgroundColor: theme.badgeBg }}>
        <div style={styles.ft_grid}>
          <div style={styles.ft_column}>
            <div style={{...styles.ft_title, color: "var(--cor-destaque)"}}><IoStatsChartOutline /> Seu Progresso Global</div>
            <div style={styles.ft_stat_row}><span style={{color: theme.textMain, fontWeight: '700'}}>Conclusão</span><div style={{...styles.ft_bar_bg, backgroundColor: theme.cardBg}}><div style={{...styles.ft_bar_fill, width: `${porcentagemGeral}%`}}></div></div><span style={{color: "var(--cor-destaque)", fontWeight: '800'}}>{porcentagemGeral}%</span></div>
            <p style={styles.ft_description}>Você já registrou <b>{totalColetadoGeral}</b> de <b>{itens.length}</b> itens.</p>
          </div>
          <div style={styles.ft_column}><div style={{...styles.ft_title, color: "var(--cor-destaque)"}}><IoHeart /> Links Úteis</div><a href="https://heartopia.xd.com/pt/" target="_blank" rel="noreferrer" style={styles.ft_link}><IoGlobeOutline /> Site Oficial</a></div>
          <div style={styles.ft_column}><div style={{...styles.ft_title, color: "var(--cor-destaque)"}}>Heartopia Guide</div><div style={{...styles.ft_credit_tag, color: theme.textMain}}>Desenvolvido por fãs.</div><p style={styles.ft_disclaimer}>Guia independente. © 2026</p></div>
        </div>
      </footer>
    </div>
  );
}

const lightTheme = { bg: "#ffe6f2", cardBg: "#fff", textMain: "#333", badgeBg: "#fff0f7" };
const darkTheme = { bg: "#2d1b24", cardBg: "#3d2b34", textMain: "#fff", badgeBg: "#4d3b44" };

const styles = {
  container: { padding: "20px 10px 0 10px", minHeight: "100vh", fontFamily: "'Quicksand', sans-serif", transition: "background-color 0.5s ease", boxSizing: 'border-box' },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", maxWidth: "1200px", margin: "0 auto 20px auto", width: '100%' },
  userInfoHeader: { display: "flex", alignItems: "center", gap: "10px" },
  avatarCircle: { width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", border: "2px solid #ffb6e6", overflow: "hidden", flexShrink: 0 },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  userNickname: { fontWeight: "800", fontSize: "14px" },
  userEmail: { color: "var(--cor-destaque)", fontSize: "11px", opacity: 0.8 },
  settingsBtn: { backgroundColor: "white", border: "2px solid var(--cor-destaque)", width: "38px", height: "38px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  dropdownMenu: { position: "absolute", top: "50px", right: "0", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", border: "2px solid var(--cor-destaque)", padding: "15px", zIndex: 1000, width: "220px" },
  menuTitle: { fontSize: "12px", fontWeight: "800", color: "var(--cor-destaque)", marginBottom: "10px", textAlign: "center", textTransform: "uppercase" },
  menuItem: { display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", fontSize: "13px", fontWeight: "600" },
  menuInput: { border: "none", borderRadius: "10px", padding: "8px 12px", width: "100%", fontFamily: "'Quicksand', sans-serif", fontSize: "12px", outline: "none" },
  miniBtn: { backgroundColor: "var(--cor-destaque)", color: "white", border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", fontSize: "10px", fontWeight: "700", fontFamily: "'Quicksand', sans-serif" },
  menuDivider: { border: "0", borderTop: "1px solid #ffdaed", margin: "10px 0" },
  
  // NAVBAR ADAPTADA PARA CELULAR (Scroll Horizontal)
  navMenu: { 
    display: "flex", 
    justifyContent: "flex-start", 
    gap: "10px", 
    marginBottom: "25px", 
    overflowX: "auto", 
    padding: "10px 5px",
    whiteSpace: "nowrap",
    WebkitOverflowScrolling: "touch",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    maxWidth: "1000px",
    margin: "0 auto 25px auto"
  },
  navButton: { fontFamily: "'Quicksand', sans-serif", display: "flex", alignItems: "center", gap: "8px", padding: "8px 18px", borderRadius: "25px", border: "2px solid", cursor: "pointer", fontWeight: "700", transition: "all 0.3s", flexShrink: 0 },
  navIcon: { fontSize: "18px" },
  
  mainContent: { maxWidth: "1160px", margin: "0 auto", minHeight: "60vh", width: '100%' },
  
  // PROGRESSO ADAPTADO
  progressContainer: { width: "100%", padding: "20px 15px 40px 15px", borderRadius: "20px", border: "2px solid var(--cor-destaque)", marginBottom: "30px", boxSizing: "border-box" },
  progressHeader: { display: "flex", marginBottom: "15px" },
  starBadge: { display: "flex", alignItems: "center", gap: "8px", padding: "6px 15px", borderRadius: "20px" },
  progressText: { color: "var(--cor-destaque)", fontWeight: "800", fontSize: "11px" },
  progressBarBg: { height: "14px", borderRadius: "12px", position: "relative", display: "flex", alignItems: "center", margin: "0 5px", border: "3px solid var(--cor-fundo-sutil)" },
  progressBarFill: { height: "100%", backgroundColor: "var(--cor-destaque)", borderRadius: "10px", transition: "width 0.5s" },
  marker: { position: "absolute", width: "14px", height: "14px", borderRadius: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 },
  markerLabel: { position: "absolute", top: "22px", color: "var(--cor-destaque)", fontSize: "9px", fontWeight: "700" },
  
  // BUSCA E FILTROS ADAPTADOS
  searchAndLevelRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  searchWrapper: { display: "flex", alignItems: "center", padding: "8px 15px", borderRadius: "50px", border: "2px solid var(--cor-destaque)", flex: 2, minWidth: "180px" },
  searchInput: { border: "none", outline: "none", width: "100%", fontSize: "14px", fontFamily: "'Quicksand', sans-serif" },
  searchIcon: { color: "var(--cor-destaque)", marginRight: "8px" },
  levelControls: { display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "30px", border: "2px solid var(--cor-destaque)", flexShrink: 0 },
  levelLabel: { color: "var(--cor-destaque)", fontWeight: "700", fontSize: "11px" },
  levelBtn: { backgroundColor: "var(--cor-destaque)", color: "white", border: "none", width: "22px", height: "22px", borderRadius: "50%", cursor: "pointer", fontWeight: "bold" },
  levelDisplay: { fontSize: "16px", fontWeight: "800", color: "var(--cor-destaque)", minWidth: "15px", textAlign: "center" },
  filterRow: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center" },
  filterBadge: { display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "11px", fontWeight: "700", fontFamily: "'Quicksand', sans-serif", transition: "all 0.2s ease", flexShrink: 0 },
  selectInput: { border: 'none', outline: 'none', fontFamily: "'Quicksand', sans-serif", fontWeight: '700', fontSize: '11px', cursor: 'pointer' },
  
  // GRID RESPONSIVO (2 colunas no celular, várias no PC)
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", 
    justifyContent: "center", 
    gap: "15px", 
    width: "100%",
    padding: "0 5px",
    boxSizing: "border-box"
  },
  card: { padding: "12px", borderRadius: "20px", boxSizing: "border-box", textAlign: "center", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", transition: 'border-color 0.3s', position: 'relative' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  favBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.2s' },
  checkboxContainer: { display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" },
  image: { width: "100%", height: "110px", objectFit: "cover", borderRadius: "15px", marginBottom: "8px" },
  title: { fontWeight: "700", fontSize: "14px", height: "35px", overflow: "hidden", marginBottom: '5px' },
  infoRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", marginBottom: "4px", fontSize: "11px" },
  infoText: { color: "#777", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  shadowBadge: { padding: "2px 8px", borderRadius: "10px", fontSize: "9px", fontWeight: "800", textTransform: "uppercase" },
  climaContainer: { display: "flex", gap: "3px" },
  starContainer: { display: "flex", justifyContent: "center", marginTop: "10px", padding: "8px 0", borderTop: "1.5px dashed var(--cor-fundo-sutil)", gap: "1px", position: "relative" },
  star: { fontSize: "18px", cursor: "pointer" },
  tooltip: { position: "absolute", bottom: "130%", left: "50%", transform: "translateX(-50%)", padding: "10px", borderRadius: "15px", border: "2px solid var(--cor-destaque)", zIndex: 100, width: "140px" },
  tooltipLine: { display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" },
  tooltipArrow: { position: "absolute", top: "100%", left: "50%", marginLeft: "-8px", borderWidth: "8px", borderStyle: "solid" },
  
  loading: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" },
  
  // FOOTER RESPONSIVO
  ft_container: { marginTop: "60px", padding: "40px 15px", transition: 'border-color 0.3s' },
  ft_grid: { maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px" },
  ft_column: { display: "flex", flexDirection: "column", gap: "12px" },
  ft_title: { fontSize: "14px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" },
  ft_stat_row: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" },
  ft_bar_bg: { flex: 1, height: "8px", borderRadius: "10px", overflow: "hidden", border: '2px solid var(--cor-fundo-sutil)' },
  ft_bar_fill: { height: "100%", background: "var(--cor-destaque)", borderRadius: "10px" },
  ft_description: { fontSize: "11px", opacity: 0.7, lineHeight: "1.5", color: '#666' },
  ft_link: { color: "var(--cor-destaque)", textDecoration: "none", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" },
  ft_disclaimer: { fontSize: "10px", color: "#999", fontStyle: "italic" },
  ft_credit_tag: { fontSize: "13px", fontWeight: "800" },
  
  conquistasWrapper: { padding: '10px', textAlign: 'center' },
  conquistasHeader: { marginBottom: '30px' },
  medalGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px", maxWidth: "1000px", margin: "0 auto" },
  medalCard: { padding: '15px', borderRadius: '20px', textAlign: 'center', position: 'relative', transition: 'all 0.3s ease' },
  medalIconCircle: { width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  conquistaCheck: { position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  addPetBtn: { border: 'none', padding: '8px 16px', borderRadius: '20px', color: 'white', fontWeight: '800', cursor: 'pointer', marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Quicksand', fontSize: '12px' },
  petHeader: { display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' },
  removePetBtn: { background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '5px' },
  petAvatarWrapper: { position: 'relative', width: '80px', height: '80px', margin: '0 auto 12px auto' },
  petAvatarImg: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--cor-destaque)' },
  petAvatarPlaceholder: { width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #ddd' },
  cameraIcon: { position: 'absolute', bottom: '0', right: '0', padding: '5px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', display: 'flex' },
  petNameInput: { border: 'none', background: 'transparent', textAlign: 'center', fontWeight: '800', fontSize: '16px', width: '100%', outline: 'none', marginBottom: '12px', fontFamily: 'Quicksand' },
  petSkills: { borderTop: '1px dashed #ddd', paddingTop: '12px' }
};

export default App;
export const styles = {
  container: {
  padding: "20px 10px 0 10px",
  minHeight: "100vh",
  fontFamily: "'Quicksand', sans-serif",
  transition: "background-color 0.5s ease",
  boxSizing: "border-box"
},

header: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  maxWidth: "1200px",
  margin: "0 auto 20px auto",
  width: "100%"
},

userInfoHeader: {
  display: "flex",
  alignItems: "center",
  gap: "10px"
},

avatarCircle: {
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  backgroundColor: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  border: "2px solid #ffb6e6",
  overflow: "hidden",
  flexShrink: 0
},

avatarImg: {
  width: "100%",
  height: "100%",
  objectFit: "cover"
},

userNickname: {
  fontWeight: "800",
  fontSize: "14px"
},

userEmail: {
  color: "var(--cor-destaque)",
  fontSize: "11px",
  opacity: 0.8
},

settingsBtn: {
  backgroundColor: "white",
  border: "2px solid var(--cor-destaque)",
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
},

dropdownMenu: {
  position: "absolute",
  top: "50px",
  right: "0",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  border: "2px solid var(--cor-destaque)",
  padding: "15px",
  zIndex: 1000,
  width: "220px"
},

menuTitle: {
  fontSize: "12px",
  fontWeight: "800",
  color: "var(--cor-destaque)",
  marginBottom: "10px",
  textAlign: "center",
  textTransform: "uppercase"
},

menuItem: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 0",
  fontSize: "13px",
  fontWeight: "600"
},

menuInput: {
  border: "none",
  borderRadius: "10px",
  padding: "8px 12px",
  width: "100%",
  fontFamily: "'Quicksand', sans-serif",
  fontSize: "12px",
  outline: "none"
},

miniBtn: {
  backgroundColor: "var(--cor-destaque)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "5px 10px",
  cursor: "pointer",
  fontSize: "10px",
  fontWeight: "700",
  fontFamily: "'Quicksand', sans-serif"
},

menuDivider: {
  border: "0",
  borderTop: "1px solid #ffdaed",
  margin: "10px 0"
},

navMenu: {
  display: "flex",
  flexWrap: "wrap", // <-- Isso faz os hobbies pularem para a linha de baixo se não couberem
  justifyContent: "center", // Centraliza para ficar bonito em qualquer tamanho
  gap: "10px",
  marginBottom: "25px",
  padding: "10px 5px",
  width: "100%",
  maxWidth: "1160px", // Alinhado com o seu conteúdo principal
  margin: "0 auto 25px auto"
},

navButton: {
  fontFamily: "'Quicksand', sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 18px",
  borderRadius: "25px",
  border: "2px solid",
  cursor: "pointer",
  fontWeight: "700",
  transition: "all 0.3s",
  flexShrink: 0,
  minWidth: "fit-content", // Garante que o botão tenha o tamanho do texto
},

navIcon: {
  fontSize: "18px"
},

mainContent: {
  maxWidth: "1160px",
  margin: "0 auto",
  minHeight: "60vh",
  width: "100%"
},

progressContainer: {
  width: "100%",
  padding: "20px 15px 40px 15px",
  borderRadius: "20px",
  border: "2px solid var(--cor-destaque)",
  marginBottom: "30px",
  boxSizing: "border-box"
},

progressHeader: {
  display: "flex",
  marginBottom: "15px"
},

starBadge: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 15px",
  borderRadius: "20px"
},

progressText: {
  color: "var(--cor-destaque)",
  fontWeight: "800",
  fontSize: "11px"
},

progressBarBg: {
  height: "14px",
  borderRadius: "12px",
  position: "relative",
  display: "flex",
  alignItems: "center",
  margin: "0 5px",
  border: "3px solid var(--cor-fundo-sutil)"
},

progressBarFill: {
  height: "100%",
  backgroundColor: "var(--cor-destaque)",
  borderRadius: "10px",
  transition: "width 0.5s"
},

marker: {
  position: "absolute",
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2
},

markerLabel: {
  position: "absolute",
  top: "22px",
  color: "var(--cor-destaque)",
  fontSize: "9px",
  fontWeight: "700"
},

searchAndLevelRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap"
},

searchWrapper: {
  display: "flex",
  alignItems: "center",
  padding: "8px 15px",
  borderRadius: "50px",
  border: "2px solid var(--cor-destaque)",
  flex: 2,
  minWidth: "180px"
},

searchInput: {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: "14px",
  fontFamily: "'Quicksand', sans-serif"
},

searchIcon: {
  color: "var(--cor-destaque)",
  marginRight: "8px"
},

levelControls: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 12px",
  borderRadius: "30px",
  border: "2px solid var(--cor-destaque)",
  flexShrink: 0
},

levelLabel: {
  color: "var(--cor-destaque)",
  fontWeight: "700",
  fontSize: "11px"
},

levelBtn: {
  backgroundColor: "var(--cor-destaque)",
  color: "white",
  border: "none",
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  cursor: "pointer",
  fontWeight: "bold"
},

levelDisplay: {
  fontSize: "16px",
  fontWeight: "800",
  color: "var(--cor-destaque)",
  minWidth: "15px",
  textAlign: "center"
},

filterRow: {
  display: "flex",
  gap: "8px",
  marginBottom: "20px",
  flexWrap: "wrap",
  justifyContent: "center"
},

filterBadge: {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: "700",
  fontFamily: "'Quicksand', sans-serif",
  transition: "all 0.2s ease",
  flexShrink: 0
},

selectInput: {
  border: "none",
  outline: "none",
  fontFamily: "'Quicksand', sans-serif",
  fontWeight: "700",
  fontSize: "11px",
  cursor: "pointer"
},

grid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  justifyContent: "center",
  gap: "15px",
  width: "100%",
  padding: "0 5px",
  boxSizing: "border-box"
},

card: {
  padding: "12px",
  borderRadius: "20px",
  boxSizing: "border-box",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  position: "relative"
},

cardHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px"
},

favBtn: {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "transform 0.2s"
},

checkboxContainer: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px"
},

image: {
  width: "100%",
  height: "110px",
  objectFit: "cover",
  borderRadius: "15px",
  marginBottom: "8px"
},

title: {
  fontWeight: "700",
  fontSize: "14px",
  height: "35px",
  overflow: "hidden",
  marginBottom: "5px"
},

infoRow: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "4px",
  marginBottom: "4px",
  fontSize: "11px"
},

infoText: {
  color: "#777",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
},

shadowBadge: {
  padding: "2px 8px",
  borderRadius: "10px",
  fontSize: "9px",
  fontWeight: "800",
  textTransform: "uppercase"
},

climaContainer: {
  display: "flex",
  gap: "3px"
},

starContainer: {
  display: "flex",
  justifyContent: "center",
  marginTop: "10px",
  padding: "8px 0",
  borderTop: "1.5px dashed var(--cor-fundo-sutil)",
  gap: "1px",
  position: "relative"
},

star: {
  fontSize: "18px",
  cursor: "pointer"
},

tooltip: {
  position: "absolute",
  bottom: "130%",
  left: "50%",
  transform: "translateX(-50%)",
  padding: "10px",
  borderRadius: "15px",
  border: "2px solid var(--cor-destaque)",
  zIndex: 100,
  width: "140px"
},

tooltipLine: {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "11px",
  marginBottom: "3px"
},

tooltipArrow: {
  position: "absolute",
  top: "100%",
  left: "50%",
  marginLeft: "-8px",
  borderWidth: "8px",
  borderStyle: "solid"
},

loading: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh"
},

ft_container: {
  marginTop: "60px",
  padding: "40px 15px",
  transition: "border-color 0.3s"
},

ft_grid: {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "30px"
},

ft_column: {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
},

ft_title: {
  fontSize: "14px",
  fontWeight: "800",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  textTransform: "uppercase"
},

ft_stat_row: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px"
},

ft_bar_bg: {
  flex: 1,
  height: "8px",
  borderRadius: "10px",
  overflow: "hidden",
  border: "2px solid var(--cor-fundo-sutil)"
},

ft_bar_fill: {
  height: "100%",
  background: "var(--cor-destaque)",
  borderRadius: "10px"
},

ft_description: {
  fontSize: "11px",
  opacity: 0.7,
  lineHeight: "1.5",
  color: "#666"
},

ft_link: {
  color: "var(--cor-destaque)",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "8px"
},

ft_disclaimer: {
  fontSize: "10px",
  color: "#999",
  fontStyle: "italic"
},

ft_credit_tag: {
  fontSize: "13px",
  fontWeight: "800"
},

conquistasWrapper: {
  padding: "10px",
  textAlign: "center"
},

conquistasHeader: {
  marginBottom: "30px"
},

medalGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "15px",
  maxWidth: "1000px",
  margin: "0 auto"
},

medalCard: {
  padding: "15px",
  borderRadius: "20px",
  textAlign: "center",
  position: "relative",
  transition: "all 0.3s ease"
},

medalIconCircle: {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  margin: "0 auto 8px auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
},

conquistaCheck: {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "18px",
  height: "18px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
},

addPetBtn: {
  border: "none",
  padding: "8px 16px",
  borderRadius: "20px",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
  marginTop: "12px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: "Quicksand",
  fontSize: "12px"
},

petHeader: {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "8px"
},

removePetBtn: {
  background: "none",
  border: "none",
  color: "#ff4d4d",
  cursor: "pointer",
  padding: "5px"
},

petAvatarWrapper: {
  position: "relative",
  width: "80px",
  height: "80px",
  margin: "0 auto 12px auto"
},

petAvatarImg: {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid var(--cor-destaque)"
},

petAvatarPlaceholder: {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  backgroundColor: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "3px solid #ddd"
},

cameraIcon: {
  position: "absolute",
  bottom: "0",
  right: "0",
  padding: "5px",
  borderRadius: "50%",
  cursor: "pointer",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  display: "flex"
},

petNameInput: {
  border: "none",
  background: "transparent",
  textAlign: "center",
  fontWeight: "800",
  fontSize: "16px",
  width: "100%",
  outline: "none",
  marginBottom: "12px",
  fontFamily: "Quicksand"
},

petSkills: {
  borderTop: "1px dashed #ddd",
  paddingTop: "12px"
},

eventSection: {
  backgroundColor: "rgba(33, 150, 243, 0.05)",
  padding: "20px",
  borderRadius: "25px",
  marginBottom: "30px",
  border: "2px dashed #2196f3"
},

eventHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px"
},

eventTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#2196f3",
    margin: 0,
    fontFamily: "Quicksand"
},

eventBadge: {
    backgroundColor: "#2196f3",
    color: "white",
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "10px",
    fontWeight: "bold",
    textTransform: "uppercase"
},

sectionDivider: {
    borderBottom: "2px solid rgba(0,0,0,0.05)",
    marginTop: "30px"
},

btnSubirTopo: {
    position: "fixed",
    bottom: "20px",
    left: "20px", // Lado oposto ao chat para não embolar
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    backgroundColor: "var(--cor-destaque)",
    color: "white",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
    transition: "all 0.3s ease",
},
// Adicione ao seu objeto styles no styles.js
loadingOverlay: {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  backdropFilter: "blur(10px)", // Efeito de vidro fosco
  transition: "all 0.5s ease",
},

loadingCard: {
  padding: "40px",
  borderRadius: "30px",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  border: "1px solid rgba(255, 255, 255, 0.8)",
},

magicDot: {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: "var(--cor-destaque)",
  display: "inline-block",
  margin: "0 5px",
}
};

export const stylesIA = {
    chatFloatingBtn: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "30px",
    backgroundColor: "var(--cor-destaque)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    zIndex: 1000,
    transition: "transform 0.3s ease"
},

chatWindow: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "320px",
    height: "450px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1000,
    border: "2px solid #f0d6e6"
},

chatHeader: {
    padding: "15px",
    backgroundColor: "#ffdef7",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    fontWeight: "800",
    color: "#5e4d44",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
},

messageArea: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    backgroundColor: "#fffdfa"
},

msgUser: {
    alignSelf: "flex-end",
    backgroundColor: "#ffa0df",
    padding: "10px 15px",
    borderRadius: "15px 15px 0 15px",
    fontSize: "14px",
    maxWidth: "80%",
    color: "#5e4d44"
},

msgNPC: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    padding: "10px 15px",
    borderRadius: "15px 15px 15px 0",
    fontSize: "14px",
    maxWidth: "80%",
    color: "#333",
    border: "1px solid #e0e0e0"
},

inputArea: {
    padding: "10px",
    borderTop: "1px solid #eee",
    display: "flex",
    gap: "5px"
},

inputField: {
    flex: 1,
    border: "1px solid #ddd",
    padding: "8px 12px",
    borderRadius: "20px",
    fontFamily: "Quicksand",
    outline: "none"
}
};
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Vérifier si on vient d'une redirection de la page 404.html
const redirectPath = sessionStorage.getItem('redirect_path');
if (redirectPath) {
  // Effacer pour ne pas re-rediriger à chaque chargement
  sessionStorage.removeItem('redirect_path');
  // Mettre à jour l'URL sans recharger la page
  window.history.replaceState(null, '', redirectPath);
}

createRoot(document.getElementById("root")!).render(<App />);

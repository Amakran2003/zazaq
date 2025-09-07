// Script pour changer le favicon selon le mode système (clair/sombre)
(function() {
  // Sélectionne le favicon en fonction du mode système
  function setFavicon() {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const favicon = document.getElementById('favicon');
    
    if (favicon) {
      favicon.href = isDarkMode ? '/favicon blanc.png' : '/favicon noir.png';
    } else {
      // Crée un nouvel élément link si aucun favicon n'existe
      const newFavicon = document.createElement('link');
      newFavicon.id = 'favicon';
      newFavicon.rel = 'icon';
      newFavicon.href = isDarkMode ? '/favicon blanc.png' : '/favicon noir.png';
      newFavicon.type = 'image/png';
      document.head.appendChild(newFavicon);
    }
  }

  // Définit le favicon au chargement initial
  setFavicon();

  // Change le favicon lorsque le mode système change
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      setFavicon();
    });
  }
})();

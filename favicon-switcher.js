// Ce script n'est plus nécessaire car nous utilisons un seul favicon
// Conservé pour des raisons de compatibilité avec les anciennes références
(function() {
  // Assure que le favicon est toujours configuré correctement
  function setFavicon() {
    const favicon = document.getElementById('favicon');
    
    if (favicon) {
      favicon.href = '/favicon.jpg';
      favicon.type = 'image/jpeg';
    } else {
      // Crée un nouvel élément link si aucun favicon n'existe
      const newFavicon = document.createElement('link');
      newFavicon.id = 'favicon';
      newFavicon.rel = 'icon';
      newFavicon.href = '/favicon.jpg';
      newFavicon.type = 'image/jpeg';
      document.head.appendChild(newFavicon);
    }
  }

  // Définit le favicon au chargement initial
  setFavicon();
})();

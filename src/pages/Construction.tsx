import React from "react";

const Construction = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
    <div className="bg-background rounded-2xl shadow-xl p-10 text-center max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-accent mb-4">Site en cours de construction</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Notre site sera bientôt lancé ! Merci de votre patience.<br />
        Revenez très vite pour découvrir nos services et nos visites virtuelles 360°.
      </p>
      <div className="flex items-center justify-center mb-4">
        <svg className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </div>
      <p className="text-sm text-muted-foreground">Contact : <a href="mailto:contact@zazaq.fr" className="text-accent underline">contact@zazaq.fr</a></p>
    </div>
  </div>
);

export default Construction;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ajouter une classe au document pour indiquer que l'application est en mode splashscreen
    document.body.classList.add('splash-active');
    
    // Afficher le splash screen pendant 2.5 secondes
    const timer = setTimeout(() => {
      setIsVisible(false);
      
      // Donner du temps à l'animation de sortie avant de déclencher onComplete
      setTimeout(() => {
        document.body.classList.remove('splash-active');
        document.body.classList.add('app-ready');
        onComplete();
      }, 800);
    }, 2500);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('splash-active');
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-600"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-40 h-40 mb-16 relative">
              <motion.img 
                src={logo} 
                alt="Zazaq Logo" 
                className="w-full h-full object-contain splash-logo"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
              {/* Cercle qui tourne */}
              <motion.div 
                className="absolute -inset-4 rounded-full border-2 border-white/60 splash-ring"
                style={{ borderRadius: '50%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
              />
              {/* Cercle externe qui tourne dans l'autre sens */}
              <motion.div 
                className="absolute -inset-8 rounded-full border border-white/30"
                style={{ borderRadius: '50%' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              />
              
              {/* Particules d'accent autour du logo */}
              <motion.div 
                className="absolute w-3 h-3 rounded-full bg-accent/40"
                initial={{ x: -20, y: -20, scale: 0 }}
                animate={{ 
                  x: [-30, -60, -30], 
                  y: [-30, -20, -30], 
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0] 
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
              />
              <motion.div 
                className="absolute w-2 h-2 rounded-full bg-accent/40"
                initial={{ x: 20, y: -20, scale: 0 }}
                animate={{ 
                  x: [40, 60, 40], 
                  y: [-40, -20, -40], 
                  scale: [0, 0.8, 0],
                  opacity: [0, 0.7, 0] 
                }}
                transition={{ duration: 4, delay: 0.5, repeat: Infinity, repeatType: "loop" }}
              />
              <motion.div 
                className="absolute w-2 h-2 rounded-full bg-accent/40"
                initial={{ x: 0, y: 30, scale: 0 }}
                animate={{ 
                  x: [0, 20, 0], 
                  y: [50, 70, 50], 
                  scale: [0, 1, 0],
                  opacity: [0, 0.7, 0] 
                }}
                transition={{ duration: 3.5, delay: 1, repeat: Infinity, repeatType: "loop" }}
              />
            </div>
            
            {/* Texte "Zazaq" retiré comme demandé */}
            
            <motion.p 
              className="text-xl text-white/80 italic mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              Votre vision, <span className="text-white font-bold">en 360°</span>
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-10 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.span 
              className="w-2 h-2 rounded-full bg-accent" 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.span 
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                delay: 0.2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.span 
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                delay: 0.4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

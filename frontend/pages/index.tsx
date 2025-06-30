'use client';

import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
      {/* Fond de particules */}
      <Particles
        className="absolute inset-0 -z-10"
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
              resize: true,
            },
            modes: {
              repulse: { distance: 120, duration: 0.4 },
            },
          },
          particles: {
            color: { value: '#ffffff' },
            links: {
              color: '#888',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: { default: 'bounce' },
              random: true,
              speed: 0.3,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 80,
            },
            opacity: { value: 0.3 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />

      <main className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 py-20">
        <motion.h1
          className="text-5xl font-extrabold mb-4 drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Bienvenue sur CESI-Zen
        </motion.h1>

        <motion.p
          className="max-w-lg mb-12 text-lg text-gray-200/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Gérez votre stress au quotidien : ressources, diagnostic et conseils personnalisés.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
          {[
            { href: '/login', label: 'Se connecter', color: 'indigo' },
            { href: '/register', label: 'S’inscrire', color: 'green' },
            { href: '/diagnostic', label: 'Faire un diagnostic', color: 'blue' },
            { href: '/ressources', label: 'Voir les ressources', color: 'teal' },
          ].map((btn, i) => (
            <motion.div
              key={btn.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
            >
              <Link
                href={btn.href}
                className={`
                  block text-white font-medium 
                  bg-${btn.color}-600 hover:bg-${btn.color}-700 
                  px-6 py-3 rounded-full shadow-lg transition
                  flex justify-center items-center
                `}
              >
                {btn.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

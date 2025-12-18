import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        name: 'pet-app',
        filename: 'remoteEntry.js',
        exposes: {
          './Home': './src/features/public/Home.jsx',
          './PetDetails': './src/features/pets/PetDetails.jsx',
          './FilterPanel': './src/features/public/components/FilterPanel.jsx',
        },
        remotes: {
          authApp: env.VITE_AUTH_REMOTE_URL || 'http://localhost:3001/assets/remoteEntry.js',
        },
        shared: ['react', 'react-dom', 'react-router-dom']
      })
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false
    },
    preview: {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  };
});

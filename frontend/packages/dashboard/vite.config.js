import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        name: 'dashboard-app',
        filename: 'remoteEntry.js',
        exposes: {
          './DashboardPage': './src/features/dashboard/DashboardPage.jsx',
          './AdminDashboardPage': './src/features/dashboard/AdminDashboardPage.jsx',
          './AddPet': './src/features/dashboard/AddPet.jsx',
          './EditPet': './src/features/dashboard/EditPet.jsx',
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

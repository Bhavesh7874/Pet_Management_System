import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'auth-app',
      filename: 'remoteEntry.js',
      exposes: {
        './AuthPage': './src/features/auth/AuthPage.jsx',
        './Login': './src/features/auth/components/Login.jsx',
        './Register': './src/features/auth/components/Register.jsx',
        './AuthContext': './src/features/auth/AuthContext.jsx',
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
})

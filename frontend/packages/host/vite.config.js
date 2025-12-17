import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host-app',
      remotes: {
        authApp: 'http://localhost:3001/assets/remoteEntry.js',
        petApp: 'http://localhost:3002/assets/remoteEntry.js',
        dashboardApp: 'http://localhost:3003/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    }),
    {
      name: 'external-build-watcher',
      configureServer(server) {
        const listener = (file) => {
          if (file.includes('remoteEntry.js')) {
            server.ws.send({ type: 'full-reload' });
          }
        };
        server.watcher.add([
          path.resolve(__dirname, '../../packages/auth/dist/assets/remoteEntry.js'),
          path.resolve(__dirname, '../../packages/pet/dist/assets/remoteEntry.js'),
          path.resolve(__dirname, '../../packages/dashboard/dist/assets/remoteEntry.js')
        ]);
        server.watcher.on('add', listener);
        server.watcher.on('change', listener);
      }
    }
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})

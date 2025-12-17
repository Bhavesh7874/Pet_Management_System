import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext';
import Navbar from '../shared/components/Navbar';
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto page-container">
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

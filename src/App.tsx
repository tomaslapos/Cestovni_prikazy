import { useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/layout/TabNavigation';
import { TripsPage } from './pages/TripsPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { useAuth } from './hooks/useAuth';

type Tab = 'trips' | 'vehicles';

function App() {
  const { user, loading, error, login, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('trips');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} error={error} loading={loading} />;
  }

  return (
    <div className="min-h-screen">
      <Header user={user!} onLogout={logout} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main>
        {activeTab === 'trips' && <TripsPage />}
        {activeTab === 'vehicles' && <VehiclesPage />}
      </main>
    </div>
  );
}

export default App;

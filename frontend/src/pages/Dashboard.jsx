import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function Dashboard({ token, onLogout }) {
  const [status, setStatus] = useState('offline');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function fetchStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/status`);
      const data = await response.json();
      setStatus(data.esp32_online ? 'online' : 'offline');
    } catch (_error) {
      setStatus('offline');
    }
  }

  async function turnOnPC() {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/turn-on`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao enviar comando.');
      }

      setMessage(data.message || 'Comando enviado.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button type="button" className="logout" onClick={onLogout}>
          Sair
        </button>
      </header>

      <section className="status-card">
        <p>ESP32 está:</p>
        <strong className={`status ${status}`}>{status.toUpperCase()}</strong>
      </section>

      <button type="button" className="power-button" onClick={turnOnPC} disabled={loading || status !== 'online'}>
        {loading ? 'ENVIANDO...' : 'LIGAR PC'}
      </button>

      {message ? <p className="feedback">{message}</p> : null}
    </main>
  );
}

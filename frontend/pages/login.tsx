import { FormEvent, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginPage() {
  const { user, login } = useContext(AuthContext)!;
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Si déjà connecté, redirige vers profile
  useEffect(() => {
    if (user) {
      router.replace('/profile');
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push('/profile');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Échec de la connexion');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Connexion</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <label className="block mb-3">
        <span className="text-gray-700">Email</span>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
      </label>

      <label className="block mb-5">
        <span className="text-gray-700">Mot de passe</span>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
      </label>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Se connecter
      </button>
    </form>
  );
}

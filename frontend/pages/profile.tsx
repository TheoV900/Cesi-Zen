// frontend/pages/profile.tsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { FaUser, FaUserShield } from 'react-icons/fa';

export default function Profile() {
  const { user, logout, resetPassword } = useContext(AuthContext)!;
  const router = useRouter();

  // États pour le formulaire de reset
  const [showForm, setShowForm] = useState(false);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-lg space-y-6">
      {/* En-tête rôle */}
      <div className="flex items-center space-x-3">
        {user.role === 'ADMIN' ? (
          <FaUserShield className="text-blue-400 text-2xl" />
        ) : (
          <FaUser className="text-gray-400 text-2xl" />
        )}
        <h2 className="text-2xl font-semibold text-white">
          {user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
        </h2>
      </div>

      {/* Email */}
      <p className="text-gray-200 mb-4">
        <span className="font-medium">Email :</span> {user.email}
      </p>

      {/* Bouton pour afficher/masquer le formulaire */}
      <button
        onClick={() => {
          setShowForm(prev => !prev);
          setError(null);
          setOldPwd('');
          setNewPwd('');
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
      >
        {showForm ? 'Annuler' : 'Réinitialiser mot de passe'}
      </button>

      {/* Formulaire de réinitialisation du mot de passe */}
      {showForm && (
        <form
          onSubmit={async e => {
            e.preventDefault();
            setError(null);
            try {
              await resetPassword(oldPwd, newPwd);
              router.push('/login');
            } catch (err: any) {
              setError(err.response?.data?.message || 'Erreur de mise à jour');
            }
          }}
          className="space-y-4 bg-gray-700 dark:bg-gray-800 p-4 rounded"
        >
          {error && <div className="text-red-500">{error}</div>}

          <label className="block">
            <span className="text-gray-300">Ancien mot de passe</span>
            <input
              type="password"
              value={oldPwd}
              onChange={e => setOldPwd(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-600 dark:bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white"
            />
          </label>

          <label className="block">
            <span className="text-gray-300">Nouveau mot de passe</span>
            <input
              type="password"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-600 dark:bg-gray-700 border border-gray-500 rounded px-3 py-2 text-white"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
          >
            Valider le nouveau mot de passe
          </button>
        </form>
      )}

      {/* Bouton de déconnexion */}
      <button
        onClick={() => {
          logout();
          router.push('/');
        }}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
      >
        Se déconnecter
      </button>
    </div>
  );
}

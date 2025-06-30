// frontend/pages/admin/users.tsx
import { useContext, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import api from '../../lib/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { FaUser, FaUserShield } from 'react-icons/fa';

type User = {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
  active: boolean;
};

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function AdminUsersPage() {
  const { user } = useContext(AuthContext)!;
  const router = useRouter();

  // 1️⃣ Redirection si pas admin
  useEffect(() => {
    if (!user) router.replace('/login');
    else if (user.role !== 'ADMIN') router.replace('/');
  }, [user]);

  // 2️⃣ Récupère la liste
  const { data, error } = useSWR<User[]>('/users', user ? fetcher : null);

  // 3️⃣ États du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [formError, setFormError] = useState<string | null>(null);

  // 4️⃣ Création d’un utilisateur
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.post('/users', { email, password, role });
      setEmail('');
      setPassword('');
      setRole('USER');
      await mutate('/users');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erreur de création');
    }
  };

  // 5️⃣ Toggle active
  const handleToggleActive = async (u: User) => {
    await api.patch(`/users/${u.id}`, { active: !u.active });
    await mutate('/users');
  };

  // 6️⃣ Suppression
  const handleDelete = async (u: User) => {
    if (!confirm(`Supprimer ${u.email} ?`)) return;
    await api.delete(`/users/${u.id}`);
    await mutate('/users');
  };

  if (!data) return <p>Chargement…</p>;
  if (error) return <p className="text-red-600">Erreur de chargement</p>;

  return (
    <div className="space-y-8">

      {/* — Formulaire de création — */}
      <form
        onSubmit={handleCreate}
        className="max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
      >
        <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">
          Créer un utilisateur
        </h2>
        {formError && (
          <div className="mb-3 text-red-500">{formError}</div>
        )}

        <label className="block mb-3">
          <span className="text-gray-700 dark:text-gray-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700 dark:text-gray-300">Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block mb-5">
          <span className="text-gray-700 dark:text-gray-300">Rôle</span>
          <select
            value={role}
            onChange={e => setRole(e.target.value as any)}
            className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border rounded px-3 py-2"
          >
            <option value="USER">Utilisateur</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
        >
          Créer
        </button>
      </form>

      {/* — Tableau des utilisateurs — */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-2xl mb-4 text-gray-900 dark:text-gray-100">
          Liste des utilisateurs
        </h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['ID','Email','Rôle','Actif','Actions'].map(h => (
                <th
                  key={h}
                  className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map(u => (
              <tr
                key={u.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{u.id}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{u.email}</td>
                <td className="px-4 py-2 flex items-center space-x-1">
                  {u.role === 'ADMIN' ? (
                    <FaUserShield className="text-blue-600" />
                  ) : (
                    <FaUser className="text-gray-500" />
                  )}
                  <span className="text-gray-900 dark:text-gray-100">{u.role}</span>
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={u.active}
                    onChange={() => handleToggleActive(u)}
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(u)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

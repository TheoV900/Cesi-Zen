// frontend/pages/admin/resources.tsx
'use client';

import { useContext, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import api from '../../lib/api';

type Resource = {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  archived: boolean;
};

const fetcher = (url: string) => api.get(url).then(r => r.data);

export default function AdminResourcesPage() {
  const { user } = useContext(AuthContext)!;
  const router = useRouter();

  // Redirection si pas ADMIN
  useEffect(() => {
    if (!user) router.replace('/login');
    else if (user.role !== 'ADMIN') router.replace('/');
  }, [user, router]);

  const { data, error } = useSWR<Resource[]>('/resources', fetcher);

  // 1) État pour l’ID en cours d’édition (null = création)
  const [editId, setEditId] = useState<number | null>(null);

  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Création ou mise à jour
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const payload = { title, description, content, imageUrl, archived: false };
    try {
      if (editId) {
        await api.patch(`/resources/${editId}`, payload);
      } else {
        await api.post('/resources', payload);
      }
      // reset
      setEditId(null);
      setTitle('');
      setDescription('');
      setContent('');
      setImageUrl('');
      await mutate('/resources');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erreur');
    }
  };

  const toggleArchived = async (r: Resource) => {
    await api.patch(`/resources/${r.id}`, { archived: !r.archived });
    await mutate('/resources');
  };

  const handleDelete = async (r: Resource) => {
    if (!confirm(`Supprimer la ressource "${r.title}" ?`)) return;
    await api.delete(`/resources/${r.id}`);
    await mutate('/resources');
  };

  if (!data) return <p className="text-center py-12">Chargement…</p>;
  if (error) return <p className="text-center py-12 text-red-500">Erreur chargement</p>;

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Titre principal */}
      <h1 className="text-3xl font-bold text-black dark:text-black mb-6">
        Admin – Gestion des Ressources
      </h1>

      {/* Formulaire de création/édition */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          {editId ? 'Modifier la ressource' : 'Créer une ressource'}
        </h2>
        {formError && <p className="text-red-500">{formError}</p>}

        <label className="block">
          <span className="text-gray-700 dark:text-gray-300">Titre</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-white dark:bg-gray-700 border rounded px-3 py-2 text-gray-900 dark:text-white"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 dark:text-gray-300">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full bg-white dark:bg-gray-700 border rounded px-3 py-2 text-gray-900 dark:text-white"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 dark:text-gray-300">Contenu (HTML)</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full bg-white dark:bg-gray-700 border rounded px-3 py-2 text-gray-900 dark:text-white"
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 dark:text-gray-300">
            URL de l’image (optionnel)
          </span>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full bg-white dark:bg-gray-700 border rounded px-3 py-2 text-gray-900 dark:text-white"
          />
        </label>

        <button
          type="submit"
          className={`${
            editId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
          } text-white px-4 py-2 rounded`}
        >
          {editId ? 'Enregistrer les modifications' : 'Créer'}
        </button>
      </form>

      {/* Tableau des ressources */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Liste des ressources
        </h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['ID', 'Titre', 'Archivées', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 py-2 text-gray-900 dark:text-white">{r.id}</td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">{r.title}</td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={r.archived}
                    onChange={() => toggleArchived(r)}
                  />
                </td>
                <td className="px-4 py-2 space-x-2">
                  {editId === r.id ? (
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                    >
                      Annuler
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditId(r.id);
                        setTitle(r.title);
                        setDescription(r.description);
                        setContent(r.content);
                        setImageUrl(r.imageUrl || '');
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Modifier
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
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

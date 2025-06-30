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

  // 1) Redirection si pas ADMIN
  useEffect(() => {
    if (!user) router.replace('/login');
    else if (user.role !== 'ADMIN') router.replace('/');
  }, [user, router]);

  // 2) Liste des ressources
  const { data, error } = useSWR<Resource[]>('/resources', fetcher);

  // états du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // 3) Création
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await api.post('/resources', {
        title, description, content, imageUrl, archived: false
      });
      setTitle(''); setDescription(''); setContent(''); setImageUrl('');
      await mutate('/resources');
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erreur de création');
    }
  };

  // 4) Toggle archived
  const toggleArchived = async (r: Resource) => {
    await api.patch(`/resources/${r.id}`, { archived: !r.archived });
    await mutate('/resources');
  };

  // 5) Suppression
  const handleDelete = async (r: Resource) => {
    if (!confirm(`Supprimer la ressource "${r.title}" ?`)) return;
    await api.delete(`/resources/${r.id}`);
    await mutate('/resources');
  };

  if (!data) return <p>Chargement…</p>;
  if (error) return <p className="text-red-600">Erreur chargement</p>;

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Admin – Gestion des Ressources</h1>

      {/* Formulaire de création */}
      <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 p-6 rounded shadow space-y-4">
        <h2 className="text-2xl">Créer une ressource</h2>
        {formError && <p className="text-red-500">{formError}</p>}

        <label className="block">
          <span>Titre</span>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span>Description</span>
          <textarea
            value={description} onChange={e => setDescription(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span>Contenu (HTML)</span>
          <textarea
            value={content} onChange={e => setContent(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span>URL de l’image (optionnel)</span>
          <input
            value={imageUrl} onChange={e => setImageUrl(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Créer
        </button>
      </form>

      {/* Tableau des ressources */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Liste des ressources</h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['ID','Titre','Archivées','Actions'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map(r => (
              <tr key={r.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-4 py-2">{r.id}</td>
                <td className="px-4 py-2">{r.title}</td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={r.archived}
                    onChange={() => toggleArchived(r)}
                  />
                </td>
                <td className="px-4 py-2 space-x-2">
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

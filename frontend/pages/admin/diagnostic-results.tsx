'use client';

import { useContext, useState, useEffect } from 'react';
import useSWR, { mutate }                  from 'swr';
import api, { fetcher }                     from '../../lib/api';
import { AuthContext }                      from '../../contexts/AuthContext';
import { useRouter }                        from 'next/router';

interface ResultDto {
  id?: number;
  minScore: number;
  maxScore: number;
  title: string;
  content: string;
}

export default function AdminDiagnosticResultsPage() {
  const { user } = useContext(AuthContext)!;
  const router   = useRouter();

  // Redirection si pas ADMIN
  useEffect(() => {
    if (!user) router.replace('/login');
    else if (user.role !== 'ADMIN') router.replace('/');
  }, [user, router]);

  // SWR fetch des résultats
  const { data, error } = useSWR<ResultDto[]>('/diagnostic-results', fetcher);

  // États formulaire
  const [editing, setEditing]     = useState<ResultDto | null>(null);
  const [minScore, setMinScore]   = useState(0);
  const [maxScore, setMaxScore]   = useState(0);
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Préparation creation/édition
  const startEdit = (r?: ResultDto) => {
    if (r) {
      setEditing(r);
      setMinScore(r.minScore);
      setMaxScore(r.maxScore);
      setTitle(r.title);
      setContent(r.content);
    } else {
      setEditing(null);
      setMinScore(data?.length ? Math.max(...data.map(d=>d.maxScore))+1 : 0);
      setMaxScore(minScore);
      setTitle('');
      setContent('');
    }
    setFormError(null);
  };

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (minScore > maxScore) {
      setFormError('minScore doit être ≤ maxScore');
      return;
    }
    try {
      const payload = { minScore, maxScore, title, content };
      if (editing?.id) {
        await api.patch(`/diagnostic-results/${editing.id}`, payload);
      } else {
        await api.post('/diagnostic-results', payload);
      }
      await mutate('/diagnostic-results');
      startEdit();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erreur de sauvegarde');
    }
  };

  // Suppression
  const handleDelete = async (r: ResultDto) => {
    if (!confirm(`Supprimer le palier « ${r.title} » ?`)) return;
    await api.delete(`/diagnostic-results/${r.id}`);
    await mutate('/diagnostic-results');
  };

  if (!data) return <p className="p-6 text-center">Chargement…</p>;
  if (error) return <p className="p-6 text-center text-red-500">Erreur chargement</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin – Paliers de Diagnostic</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-semibold">
          {editing ? 'Modifier un palier' : 'Créer un palier'}
        </h2>
        {formError && <p className="text-red-500">{formError}</p>}

        <div className="flex space-x-4">
          <label className="block">
            <span>Score min.</span>
            <input
              type="number"
              value={minScore}
              onChange={e => setMinScore(+e.target.value)}
              className="mt-1 block w-24 border rounded px-2 py-1"
              required
            />
          </label>

          <label className="block">
            <span>Score max.</span>
            <input
              type="number"
              value={maxScore}
              onChange={e => setMaxScore(+e.target.value)}
              className="mt-1 block w-24 border rounded px-2 py-1"
              required
            />
          </label>
        </div>

        <label className="block">
          <span>Titre</span>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span>Contenu (HTML)</span>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="mt-1 block w-full h-32 border rounded px-3 py-2"
            required
          />
        </label>

        <div className="flex space-x-2">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            {editing ? 'Enregistrer' : 'Créer'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => startEdit()}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Liste des paliers</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Min', 'Max', 'Titre', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map(r => (
              <tr key={r.id}>
                <td className="px-4 py-2">{r.minScore}</td>
                <td className="px-4 py-2">{r.maxScore}</td>
                <td className="px-4 py-2">{r.title}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => startEdit(r)} className="text-blue-600">✎</button>
                  <button onClick={() => handleDelete(r)} className="text-red-600">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

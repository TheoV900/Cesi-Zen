'use client';

import { useContext, useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import api, { fetcher } from '../../lib/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

interface OptionDto {
  id?: number;
  label: string;
  points: number;
}

interface QuestionDto {
  id?: number;
  text: string;
  order: number;
  options: OptionDto[];
}

export default function AdminDiagnosticQuestionsPage() {
  const { user } = useContext(AuthContext)!;
  const router = useRouter();

  // Sécurité : si pas ADMIN, redirige
  useEffect(() => {
    if (!user) router.replace('/login');
    else if (user.role !== 'ADMIN') router.replace('/');
  }, [user, router]);

  // SWR fetch des questions
  const { data, error } = useSWR<QuestionDto[]>('/diagnostic-questions', fetcher);

  // États pour le formulaire de création/édition
  const [editing, setEditing] = useState<QuestionDto | null>(null);
  const [text, setText] = useState('');
  const [order, setOrder] = useState(1);
  const [options, setOptions] = useState<OptionDto[]>([
    { label: '', points: 0 },
    { label: '', points: 0 },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  // Prépare le formulaire pour édition ou création
  const startEdit = (q?: QuestionDto) => {
    if (q) {
      setEditing(q);
      setText(q.text);
      setOrder(q.order);
      setOptions(q.options.map(opt => ({ ...opt })));
    } else {
      setEditing(null);
      setText('');
      setOrder((data?.length || 0) + 1);
      setOptions([{ label: '', points: 0 }, { label: '', points: 0 }]);
    }
    setFormError(null);
  };

  // Ajoute un champ option
  const addOption = () => {
    setOptions(prev => [...prev, { label: '', points: 0 }]);
  };

  // Supprime une option
  const removeOption = (idx: number) => {
    setOptions(prev => prev.filter((_, i) => i !== idx));
  };

  // Handle create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!text.trim()) { setFormError('Le texte est requis'); return; }
    if (options.length < 2) { setFormError('Au moins 2 options'); return; }
    try {
      const payload = { text, order, options };
      if (editing?.id) {
        await api.patch(`/diagnostic-questions/${editing.id}`, payload);
      } else {
        await api.post('/diagnostic-questions', payload);
      }
      await mutate('/diagnostic-questions');
      startEdit(); // reset form
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erreur de sauvegarde');
    }
  };

  // Supprimer une question
  const handleDelete = async (q: QuestionDto) => {
    if (!confirm(`Supprimer la question “${q.text}” ?`)) return;
    await api.delete(`/diagnostic-questions/${q.id}`);
    await mutate('/diagnostic-questions');
  };

  if (!data) return <p className="p-6 text-center">Chargement…</p>;
  if (error) return <p className="p-6 text-center text-red-500">Erreur de chargement</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin – Questions Diagnostic</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-semibold">
          {editing ? 'Modifier une question' : 'Créer une question'}
        </h2>
        {formError && <p className="text-red-500">{formError}</p>}

        <label className="block">
          <span>Ordre</span>
          <input
            type="number"
            value={order}
            onChange={e => setOrder(+e.target.value)}
            className="mt-1 block w-20 border rounded px-2 py-1"
            required
          />
        </label>

        <label className="block">
          <span>Texte</span>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </label>

        <div>
          <span className="font-medium">Options :</span>
          <div className="space-y-2 mt-2">
            {options.map((opt, i) => (
              <div key={i} className="flex space-x-2 items-center">
                <input
                  type="text"
                  placeholder="Libellé"
                  value={opt.label}
                  onChange={e => {
                    const v = e.target.value;
                    setOptions(prev => prev.map((o,j) => j===i ? {...o,label:v} : o));
                  }}
                  className="flex-1 border rounded px-2 py-1"
                  required
                />
                <input
                  type="number"
                  value={opt.points}
                  onChange={e => {
                    const v = +e.target.value;
                    setOptions(prev => prev.map((o,j) => j===i ? {...o,points:v} : o));
                  }}
                  className="w-24 border rounded px-2 py-1"
                  required
                />
                <button type="button" onClick={() => removeOption(i)} className="text-red-500">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addOption} className="mt-2 text-blue-600">+ Ajouter option</button>
        </div>

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

      {/* Tableau des questions */}
      <div className="overflow-x-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Liste des questions</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Ordre', 'Question', 'Options', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data
              .sort((a,b) => a.order - b.order)
              .map(q => (
              <tr key={q.id}>
                <td className="px-4 py-2">{q.order}</td>
                <td className="px-4 py-2">{q.text}</td>
                <td className="px-4 py-2">
                  {q.options.map(o => `${o.label} (${o.points})`).join(' — ')}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => startEdit(q)} className="text-blue-600">✎</button>
                  <button onClick={() => handleDelete(q)} className="text-red-600">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

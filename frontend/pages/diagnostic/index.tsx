// frontend/pages/diagnostic/index.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api, { fetcher } from '../../lib/api';

interface Option {
  id: number;
  label: string;
  points: number;
}
interface Question {
  id: number;
  text: string;
  order: number;
  options: Option[];
}
interface Result {
  id: number;
  minScore: number;
  maxScore: number;
  title: string;
  content: string;
}

export default function DiagnosticPage() {
  // 1) Charger les questions
  const { data: questions, error: qError, isLoading: qLoading } = useSWR<Question[]>('/diagnostic-questions', fetcher);

  // États du formulaire
  const [answers, setAnswers] = useState<{ questionId: number; optionId: number }[]>([]);
  const [result, setResult] = useState<{ total: number; result: Result } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 2) Gestion de la sélection
  const handleSelect = (qid: number, oid: number) => {
    setAnswers(prev => {
      const other = prev.filter(a => a.questionId !== qid);
      return [...other, { questionId: qid, optionId: oid }];
    });
  };

  // 3) Soumettre le diagnostic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if ((questions?.length || 0) !== answers.length) {
      setSubmitError('Veuillez répondre à toutes les questions.');
      return;
    }
    try {
      setSubmitting(true);
      const { data } = await api.post('/diagnostic/evaluate', { answers });
      setResult(data);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Erreur lors de l’évaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  // 4) Affichage
  if (qLoading) return <p className="p-6 text-center">Chargement…</p>;
  if (qError) return <p className="p-6 text-center text-red-500">Erreur de chargement des questions.</p>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-center">Diagnostic de stress</h1>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && <p className="text-red-500">{submitError}</p>}

          {questions!.map((q) => (
            <fieldset key={q.id} className="border rounded p-4">
              <legend className="font-semibold mb-2">{q.order}. {q.text}</legend>
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <label key={opt.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={opt.id}
                      checked={answers.some(a => a.questionId === q.id && a.optionId === opt.id)}
                      onChange={() => handleSelect(q.id, opt.id)}
                      required
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {submitting ? 'En cours…' : 'Voir mon diagnostic'}
          </button>
        </form>
      ) : (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-center">{result.result.title}</h2>
          <div
            className="prose mx-auto"
            dangerouslySetInnerHTML={{ __html: result.result.content }}
          />
          <p className="text-center">Score total : {result.total}</p>
          <button
            onClick={() => { setResult(null); setAnswers([]); }}
            className="mt-4 block mx-auto bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded"
          >
            Recommencer
          </button>
        </section>
      )}
    </main>
  );
}

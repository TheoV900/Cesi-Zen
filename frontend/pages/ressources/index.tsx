// frontend/pages/ressources/index.tsx
'use client';

import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { fetcher } from '../../lib/api';

export interface Resource {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  archived: boolean;
}

export default function RessourcesPage() {
  // on récupère TOUTES les ressources non archivées
  const { data, error, isLoading } = useSWR<Resource[]>(
    '/resources?archived=false',
    (url) => fetcher(url)
  );

  // 1) en attente de la requête
  if (isLoading) return <p className="text-center py-12">Chargement…</p>;

  // 2) erreur réseau
  if (error)
    return (
      <p className="text-center py-12 text-red-500">
        Erreur : {(error as Error).message}
      </p>
    );

  // 3) une fois `data` défini, on teste la longueur
  if (!data || data.length === 0)
    return <p className="text-center py-12">Aucune ressource disponible.</p>;

  return (
    <main className="container mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary-700 mb-2">
          Ressources CESIZen
        </h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Articles, vidéos et fiches pratiques pour mieux comprendre et gérer
          votre stress.
        </p>
      </header>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <Link
            key={item.id}
            href={`/ressources/${item.id}`}
            className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-56 overflow-hidden rounded-t-2xl">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="p-6 space-y-3">
              <h2 className="text-2xl font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                {item.title}
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                {item.description}
              </p>
              <span className="inline-block mt-4 text-primary-600 font-medium group-hover:underline">
                En savoir plus →
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

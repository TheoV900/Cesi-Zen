'use client';

import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { fetcher } from '../../lib/api';
import type { ResourceDetailType } from '../../lib/types';

export default function ResourceDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading } = useSWR<ResourceDetailType>(
    id ? `/resources/${id}` : null,
    fetcher
  );

  if (isLoading) return <p className="text-center py-12">Chargement…</p>;
  if (error)
    return (
      <p className="text-center py-12 text-red-600">
        Erreur : {(error as Error).message}
      </p>
    );
  if (!data) return <p className="text-center py-12">Aucune donnée</p>;

  // Détection YouTube
  const rawUrl = data.mediaUrl ?? data.imageUrl ?? '';
  const match = rawUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  const youtubeId = match?.[1] ?? null;
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?rel=0&controls=1`
    : null;

  return (
    <main className="container mx-auto px-6 py-12 space-y-12">
      <header className="text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-primary-700">{data.title}</h1>

        {embedUrl ? (
          // Conteneur vidéo légèrement plus long (padding-bottom 60%)
          <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg pb-[60%]">
            <iframe
              src={embedUrl}
              title={data.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : data.imageUrl ? (
          <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg pb-[60%]">
            <Image
              src={data.imageUrl}
              alt={data.title}
              fill
              className="object-cover"
            />
          </div>
        ) : null}
      </header>

      <section className="prose prose-lg mx-auto max-w-3xl text-neutral-800">
        <p>{data.description}</p>
      </section>

      <section
        className="prose prose-lg mx-auto max-w-3xl text-neutral-800"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />

      <div className="text-center">
        <Link
          href="/ressources"
          className="inline-block mt-8 text-primary-600 hover:underline"
        >
          ← Retour aux ressources
        </Link>
      </div>
    </main>
  );
}

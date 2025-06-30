// frontend/pages/infos/index.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function InfosPage() {
  return (
    <main className="container mx-auto px-6 py-12 space-y-12">
      {/* Titre principal */}
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-primary-700">
          À propos de CESIZen
        </h1>
        <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
          CESIZen propose des outils de gestion du stress et des informations clés  
          pour préserver votre santé mentale et émotionnelle.
        </p>
      </header>

      {/* Bloc hero */}
      <section className="bg-primary-50 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-primary-800 mb-4">
            Pourquoi le stress ?
          </h2>
          <p className="text-neutral-800 leading-relaxed mb-4">
            Le stress est une réponse naturelle du corps aux situations perçues  
            comme menaçantes. Lorsqu’il devient excessif ou chronique, il peut  
            engendrer des répercussions importantes sur la santé mentale et  
            physique. CESIZen vise à vous accompagner pour mieux comprendre  
            et gérer votre stress au quotidien.
          </p>
          <p className="text-neutral-800 leading-relaxed">
            Maintenir un équilibre émotionnel et optimiser votre bien-être  
            commence par des diagnostics fiables, des exercices pratiques et  
            un suivi régulier de vos émotions.
          </p>
        </div>
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <Image
            src="/hero-stress.jpg"
            alt="Illustration gestion du stress"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Objectifs */}
      <section className="space-y-6">
        <h3 className="text-3xl font-semibold text-primary-700">
          Nos objectifs
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '/icon-diagnostic.svg', title: 'Diagnostics', desc: 'Propose des outils de diagnostics et d’auto-diagnostic de votre niveau de stress.' },
            { icon: '/icon-breath.svg', title: 'Respiration', desc: 'Fournit des exercices de respiration guidée pour apaiser l’esprit.' },
            { icon: '/icon-activities.svg', title: 'Activités détente', desc: 'Propose des activités personnalisables pour diminuer votre stress.' },
            { icon: '/icon-tracker.svg', title: 'Tracker', desc: 'Met à disposition un tracker des émotions pour suivre votre progression.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow p-6 text-center">
              <Image src={item.icon} alt="" width={64} height={64} className="mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">{item.title}</h4>
              <p className="text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contexte */}
      <section className="bg-neutral-50 rounded-lg shadow p-8 space-y-4">
        <h3 className="text-2xl font-semibold text-primary-700">
          Contexte de la demande
        </h3>
        <p className="text-neutral-800 leading-relaxed">
          Le Ministère de la Santé et de la Prévention est chargé de la politique  
          de santé publique, de la prévention et des soins. Dans le cadre de la mission  
          relative à la santé mentale, il s’appuie sur des outils comme CESIZen  
          pour informer le public, proposer des diagnostics, et promouvoir des  
          actions de prévention du stress et des addictions.
        </p>
        <ul className="list-disc list-inside text-neutral-800 space-y-2">
          <li>Organisation de la prévention et des soins, élaboration des règles de politique de santé.</li>
          <li>Compétence en professions médicales et paramédicales, lutte contre la toxicomanie.</li>
          <li>Élaboration de la loi de financement de la sécurité sociale, suivi de son exécution.</li>
        </ul>
      </section>
    </main>
  );
}

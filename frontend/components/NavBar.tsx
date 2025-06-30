// frontend/components/NavBar.tsx
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext)!;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          CESI-Zen
        </Link>

        <div className="space-x-4 flex items-center">
          {/* Toujours visible */}
          <Link href="/infos" className="text-gray-700 hover:text-indigo-600">
            En savoir plus
          </Link>
          <Link href="/ressources" className="text-gray-700 hover:text-indigo-600">
            Ressources
          </Link>
          <Link href="/diagnostic" className="text-gray-700 hover:text-indigo-600">
            Diagnostic
          </Link>

          {!user && (
            <>
              <Link href="/login" className="text-gray-700 hover:text-indigo-600">
                Connexion
              </Link>
              <Link href="/register" className="text-gray-700 hover:text-indigo-600">
                Inscription
              </Link>
            </>
          )}

          {user && (
            <>
              <Link href="/profile" className="text-gray-700 hover:text-indigo-600">
                Mon profil
              </Link>

              {user.role === 'ADMIN' && (
                <>
                  {/* Back-office utilisateurs */}
                  <Link href="/admin/users" className="text-gray-700 hover:text-indigo-600">
                    Admin Users
                  </Link>
                  {/* Back-office ressources */}
                  <Link href="/admin/resources" className="text-gray-700 hover:text-indigo-600">
                    Ressources (Admin)
                  </Link>
                  {/* Back-office questions diagnostic */}
                  <Link
                    href="/admin/diagnostic-questions"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Questions Diagnostic
                  </Link>
                  {/* Back-office paliers diagnostic */}
                  <Link
                    href="/admin/diagnostic-results"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Paliers Diagnostic
                  </Link>
                </>
              )}

              <button
                onClick={logout}
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
);
}

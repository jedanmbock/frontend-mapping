import Link from 'next/link';
import { Map, BarChart3, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">

      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-gray-800 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
          Projet 5GI
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Connexion
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            Cartographie des <br/>
            <span className="text-blue-600">Bassins de Production</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            Une plateforme interactive pour visualiser les données agricoles, d&apos;élevage et de pêche à travers les divisions administratives du Cameroun.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Map size={20} />
              Accéder à la Carte
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </div>

        {/* Illustration Minimaliste */}
        <div className="flex-1 w-full relative">
          <div className="aspect-square bg-gradient-to-tr from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 rounded-[3rem] p-8 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center gap-4 hover:-translate-y-2 transition-transform">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Map size={32}/></div>
                <span className="font-bold">Cartographie</span>
             </div>
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center gap-4 hover:-translate-y-2 transition-transform mt-8">
                <div className="p-3 bg-green-100 rounded-full text-green-600"><Database size={32}/></div>
                <span className="font-bold">Données Fiables</span>
             </div>
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center gap-4 hover:-translate-y-2 transition-transform">
                <div className="p-3 bg-orange-100 rounded-full text-orange-600"><BarChart3 size={32}/></div>
                <span className="font-bold">Statistiques</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

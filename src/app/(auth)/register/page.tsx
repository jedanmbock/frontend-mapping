import RegisterForm from '@/components/Auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un compte</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Rejoignez la plateforme CamerAgro</p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

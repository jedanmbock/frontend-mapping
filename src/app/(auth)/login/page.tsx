import LoginForm from '@/components/Auth/LoginForm';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            {t('loginTitle')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('loginSubtitle')}
          </p>
        </div>

        <LoginForm />

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('noAccount')} {' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            {t('createAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { backendApi } from '@/services/api';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await backendApi.post('/auth/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });
      setEmail(data.email);
      setStep('OTP');
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur d'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await backendApi.post('/auth/verify-otp', { email, otp });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || "Code invalide");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'OTP') {
    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
            <Mail size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vérification Email</h3>
          <p className="text-sm text-gray-500 mt-1">Code envoyé à {email}</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={onVerifyOtp} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center text-3xl tracking-[0.5em] py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:text-white dark:border-gray-700 font-mono"
            placeholder="000000"
          />
          <Button type="submit" isLoading={isLoading}>Vérifier</Button>
        </form>
        <button onClick={() => setStep('FORM')} className="w-full text-sm text-gray-500 underline">Retour</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <Input label="Prénom" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Nom" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input label="Mot de passe" type="password" error={errors.password?.message} {...register('password')} />
      <Input label="Confirmer" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

      <Button type="submit" isLoading={isLoading} className="mt-2">S&apos;inscrire</Button>
    </form>
  );
}

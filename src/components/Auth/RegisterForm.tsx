'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { backendApi } from '@/services/api';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères"),
  lastName: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
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
      // Redirection directe vers le login après succès
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur d'inscription");
    } finally {
      setIsLoading(false);
    }
  };

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
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Button from '../../components/Button/Button';
import GoogleLogin from '../../components/GoogleLogin/GoogleLogin';
import { redirect } from 'next/navigation';
import Input from '../../components/Input/Input';
import Link from '../../components/Link/Link';
import { useAlertStore } from '../../store/useAlertStore';

export default function LoginPage() {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitError, setSubmitError] = useState('');
  const addAlert = useAlertStore((state) => state.addAlert);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!data.email) newErrors.email = 'Email jest wymagany.';
    else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Nieprawidłowy adres email.';
    if (!data.password) newErrors.password = 'Hasło jest wymagane.';
    else if (data.password.length < 8) newErrors.password = 'Hasło musi mieć co najmniej 8 znaków.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      addAlert('error', 'Nieprawidłowy email lub hasło');
    } else {
      addAlert('success', 'Zalogowano pomyślnie');
      redirect('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Zaloguj się</h2>
        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="example@email.com"
          />
          <Input
            label="Hasło"
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Min. 8 znaków"
          />
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          <Button className="w-full" type="submit">
            Zaloguj
          </Button>
        </form>

        <p className="text-center text-gray-500 font-semibold">lub</p>

        <GoogleLogin />

        <p className="text-center text-sm text-gray-600">
          Nie masz konta? <Link href="/signup">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
}

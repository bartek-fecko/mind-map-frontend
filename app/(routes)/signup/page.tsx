'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button/Button';
import GoogleLogin from '../../components/GoogleLogin/GoogleLogin';
import Input from '../../components/Input/Input';
import Link from '../../components/Link/Link';
import { useAlertStore } from '../../store/useAlertStore';

type FormInputs = {
  name: string;
  email: string;
  password: string;
  image: string;
};

const SignupPage = () => {
  const router = useRouter();
  const addAlert = useAlertStore((state) => state.addAlert);

  const data = useRef<FormInputs>({
    name: '',
    email: '',
    password: '',
    image: '',
  });

  const [errors, setErrors] = useState<Partial<FormInputs>>({});

  const validate = () => {
    const newErrors: Partial<FormInputs> = {};
    if (!data.current.name) newErrors.name = 'Imię jest wymagane.';
    if (!data.current.email) newErrors.email = 'Email jest wymagany.';
    else if (!/\S+@\S+\.\S+/.test(data.current.email)) newErrors.email = 'Nieprawidłowy adres email.';
    if (!data.current.password) newErrors.password = 'Hasło jest wymagane.';
    else if (data.current.password.length < 8) newErrors.password = 'Hasło musi mieć co najmniej 8 znaków.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async () => {
    if (!validate()) return;

    const res = await fetch(process.env.NEXT_PUBLIC_SOCKET_URL + '/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.current.name,
        email: data.current.email,
        password: data.current.password,
        image: '',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      addAlert('error', `Błąd: ${res.statusText}`);
      return;
    }

    addAlert('success', 'Rejestracja zakończona pomyślnie! Możesz się teraz zalogować');
    router.push('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    data.current[e.target.name as keyof FormInputs] = e.target.value;
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Zarejestruj się</h2>
        <form
          className="space-y-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            register();
          }}
        >
          <Input
            label="Imię"
            type="text"
            name="name"
            value={data.current.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Wpisz imię"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={data.current.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="example@email.com"
          />
          <Input
            label="Hasło"
            type="password"
            name="password"
            value={data.current.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Min. 8 znaków"
          />
          <Button className="w-full" type="submit">
            Zarejestruj
          </Button>
        </form>

        <p className="text-center text-gray-500 font-semibold">lub</p>

        <GoogleLogin />

        <p className="text-center text-sm text-gray-600">
          Masz już konto? <Link href="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

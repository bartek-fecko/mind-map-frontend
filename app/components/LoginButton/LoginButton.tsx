'use client';

export default function LoginButton() {
  const handleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const loginWindow = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
      '_blank',
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    const timer = setInterval(() => {
      if (loginWindow?.closed) {
        clearInterval(timer);
        window.location.reload();
      }
    }, 500);

    window.addEventListener('message', (event) => {
      if (event.origin !== process.env.NEXT_PUBLIC_API_URL) return;

      if (event.data === 'success') {
        clearInterval(timer);
        loginWindow?.close();
        window.location.reload();
      }
    });
  };

  return <button onClick={handleLogin}>Zaloguj się Google</button>;
}

import Button from '../components/Button/Button';
import GoogleLogin from '../components/GoogleLogin/GoogleLogin';

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">Zaloguj się</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hasło</label>
            <input
              type="password"
              required
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <Button className="w-full">Zaloguj</Button>
        </form>

        <p className="text-center text-gray-500 font-semibold">or</p>

        <GoogleLogin />

        <p className="text-center text-sm text-gray-600">
          Nie masz konta?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Zarejestruj się
          </a>
        </p>
      </div>
    </div>
  );
}

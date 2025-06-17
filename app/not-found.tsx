import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4">
      <h1 className="text-9xl font-extrabold mb-4 animate-bounce">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-lg mb-6 text-center max-w-md">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold shadow-md hover:bg-gray-200 transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
}

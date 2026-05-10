import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <p className="text-2xl text-dark mt-4 font-semibold">Page Not Found</p>
      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors">
        Go Home
      </Link>
    </div>
  );
}

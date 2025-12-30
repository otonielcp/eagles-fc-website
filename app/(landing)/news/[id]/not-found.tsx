import Link from 'next/link';

export default function NewsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-4">News Article Not Found</h1>
      <p className="text-gray-600 mb-8">The news article you are looking for does not exist or has been removed.</p>
      <Link href="/news">
        <button className="px-6 py-2 bg-[#C5A464] text-white rounded-full hover:bg-[#B39355] transition">
          Back to News
        </button>
      </Link>
    </div>
  );
} 
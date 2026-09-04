import Link from 'next/link';

export default function WeddingPreviewIndex() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Template Preview</h1>
        <p className="text-gray-500 mb-8">Pilih template undangan pernikahan untuk melihat hasil jadinya.</p>
        
        <div className="flex flex-col gap-4">
          <Link href="/preview/wedding/minimalist" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium">
            1. Minimalist Modern
          </Link>
          <Link href="/preview/wedding/elegant" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium">
            2. Classic Elegant
          </Link>
          <Link href="/preview/wedding/rustic" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium">
            3. Rustic Botanical
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🕌 Admin konzole</h1>
        <div className="grid gap-4">
          <Link 
            href="/admin/reports" 
            className="block p-4 bg-white rounded shadow hover:shadow-md transition"
          >
            <div className="font-medium">📋 Správa přání</div>
            <div className="text-sm text-gray-500 mt-1">
              Zobrazit, skrývat a mazat přání
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
'use client';

type Wish = {
  id: string;
  text: string;
  created_at: string;
  is_hidden: boolean;
  language: string;
  reportCount?: number;
};

interface WishListViewProps {
  wishes: Wish[];
  onToggleHide: (id: string) => void;  // ✅ změněno z onHide
  onDelete: (id: string) => void;
  onLogout: () => void;
  isRefreshing: boolean;
}

export default function WishListView({ 
  wishes, 
  onToggleHide,  // ✅ změněno z onHide
  onDelete, 
  onLogout,
  isRefreshing 
}: WishListViewProps) {

  const getHideButtonText = (isHidden: boolean) => {
    return isHidden ? 'Unhide' : 'Hide';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📋 Wishes Management</h1>
          <div className="flex items-center gap-4">
            {isRefreshing && (
              <p className="text-sm text-gray-500 animate-pulse">
                Refreshing...
              </p>
            )}
            <button
              onClick={onLogout}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>

        {wishes.length === 0 ? (
          <p className="text-gray-500">No wishes yet.</p>
        ) : (
          wishes.map((wish) => (
            <div
              key={wish.id}
              className={`bg-white p-4 mb-4 rounded shadow ${
                wish.reportCount && wish.reportCount >= 3 ? 'border-l-4 border-red-600 bg-red-50' :
                wish.reportCount ? 'border-l-4 border-red-500' : ''
              } ${wish.is_hidden ? 'opacity-60' : ''}`}
            >
              <p className="wrap-break-word">{wish.text}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <p className="text-gray-600">
                  📅 {new Date(wish.created_at).toLocaleString()}
                </p>
                <p className="text-gray-600">🌐 {wish.language}</p>
                <p className={wish.reportCount && wish.reportCount >= 3 ? 'text-red-700 font-bold' : 
                             wish.reportCount ? 'text-red-600 font-medium' : 'text-gray-600'}>
                  🚩 Reports: {wish.reportCount || 0}
                </p>
                {wish.is_hidden && (
                  <span className="text-gray-500 italic">(Hidden)</span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onToggleHide(wish.id)}  // ✅ změněno
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  {getHideButtonText(wish.is_hidden)}
                </button>
                
                <button
                  onClick={() => onDelete(wish.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ManualPageProps {
  onClose: () => void;
}

export function ManualPage({ onClose }: ManualPageProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg transition-all"
        >
          <X className="w-4 h-4" />
          Zavřít manuál
        </button>
      </div>
      <iframe
        src={`${import.meta.env.BASE_URL}manual.html`}
        title="Uživatelský manuál"
        className="w-full h-full border-0"
      />
    </div>
  );
}

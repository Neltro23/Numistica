import React from 'react';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <span className="text-4xl">🪙</span>
      </div>
      <h3 className="text-2xl font-serif font-semibold text-slate-200 mb-2">Your Vault is Empty</h3>
      <p className="text-slate-400 max-w-md mb-8">
        Start building your digital numismatic collection. Upload photos of your coins and let our AI expert identify them for you.
      </p>
      <button 
        onClick={onAddClick}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-slate-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
      >
        <PlusCircle size={20} />
        Add Your First Coin
      </button>
    </div>
  );
};

export default EmptyState;

import React from 'react';
import { X, Calendar, MapPin, Layers, DollarSign } from 'lucide-react';
import { Coin } from '../types';

interface CoinDetailModalProps {
  coin: Coin | null;
  onClose: () => void;
}

const CoinDetailModal: React.FC<CoinDetailModalProps> = ({ coin, onClose }) => {
  if (!coin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-all"
        >
          <X size={24} />
        </button>

        {/* Image Side */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-black to-black opacity-50" />
             <img 
               src={coin.image} 
               alt={coin.title} 
               className="max-w-full max-h-[60vh] md:max-h-full object-contain drop-shadow-2xl z-10" 
             />
        </div>

        {/* Info Side */}
        <div className="w-full md:w-1/2 p-6 md:p-10 bg-slate-900 overflow-y-auto">
            <div className="mb-2 text-yellow-500 font-bold tracking-widest uppercase text-xs">
                Numismatic Specimen
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 border-b border-slate-800 pb-6">
                {coin.title}
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin size={12} /> Country
                    </span>
                    <span className="text-slate-200 font-medium text-lg">{coin.country}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar size={12} /> Year
                    </span>
                    <span className="text-slate-200 font-medium text-lg">{coin.year}</span>
                </div>
                {coin.composition && (
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Layers size={12} /> Composition
                        </span>
                        <span className="text-slate-200 font-medium text-lg">{coin.composition}</span>
                    </div>
                )}
                {coin.estimatedValue && (
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                            <DollarSign size={12} /> Est. Value
                        </span>
                        <span className="text-yellow-400 font-medium text-lg">{coin.estimatedValue}</span>
                    </div>
                )}
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-slate-300 font-serif font-semibold mb-3">About this Coin</h3>
                <p className="text-slate-400 leading-relaxed">
                    {coin.description || "No description provided."}
                </p>
            </div>
            
            <div className="mt-8 text-xs text-slate-600 font-mono">
                ID: {coin.id} • Added: {new Date(coin.dateAdded).toLocaleDateString()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetailModal;

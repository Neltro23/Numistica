import React from 'react';
import { Coin } from '../types';
import { Trash2, Calendar, MapPin, Info } from 'lucide-react';

interface CoinCardProps {
  coin: Coin;
  onDelete: (id: string) => void;
  onClick: (coin: Coin) => void;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, onDelete, onClick }) => {
  return (
    <div className="group relative bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-yellow-500/50 transition-all duration-300">
      {/* Image Container */}
      <div 
        className="aspect-square w-full overflow-hidden cursor-pointer relative bg-slate-900"
        onClick={() => onClick(coin)}
      >
        <img 
          src={coin.image} 
          alt={coin.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
        
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-serif font-bold text-white truncate shadow-black drop-shadow-md">
            {coin.title}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-yellow-500" />
            <span className="truncate max-w-[100px]">{coin.country}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-yellow-500" />
            <span>{coin.year}</span>
          </div>
        </div>

        {coin.composition && (
             <div className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                {coin.composition}
             </div>
        )}

        <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
             <button
                onClick={() => onClick(coin)}
                className="text-xs font-medium text-yellow-500 hover:text-yellow-400 flex items-center gap-1 uppercase tracking-wider"
             >
                View Details
             </button>
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    if(confirm('Are you sure you want to remove this coin from your collection?')) {
                        onDelete(coin.id);
                    }
                }}
                className="text-slate-500 hover:text-red-400 transition-colors p-1"
                aria-label="Delete coin"
             >
                <Trash2 size={16} />
             </button>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;

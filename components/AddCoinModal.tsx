import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { Coin, CoinAnalysisResult } from '../types';
import { analyzeCoinImage } from '../services/geminiService';
import { resizeImage } from '../services/imageUtils';

interface AddCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coin: Omit<Coin, 'id' | 'dateAdded'>) => void;
}

const AddCoinModal: React.FC<AddCoinModalProps> = ({ isOpen, onClose, onSave }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState<Partial<CoinAnalysisResult>>({
    title: '',
    country: '',
    year: '',
    description: '',
    composition: '',
    estimatedValue: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImagePreview(null);
      setFormData({ title: '', country: '', year: '', description: '', composition: '', estimatedValue: '' });
      setIsAnalyzing(false);
    }
  }, [isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const resizedImage = await resizeImage(file);
        setImagePreview(resizedImage);
        
        // Auto-trigger analysis
        handleAnalyze(resizedImage);
      } catch (error) {
        console.error("Error processing image", error);
        alert("Could not process image.");
      }
    }
  };

  const handleAnalyze = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCoinImage(imageData);
      setFormData(result);
    } catch (error) {
      console.error(error);
      alert("AI analysis failed. You can enter details manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !formData.title) return;

    onSave({
      title: formData.title,
      country: formData.country || 'Unknown',
      year: formData.year || 'Unknown',
      description: formData.description || '',
      image: imagePreview,
      composition: formData.composition,
      estimatedValue: formData.estimatedValue
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:hidden text-slate-400 hover:text-white z-10"
        >
          <X size={24} />
        </button>

        {/* Left Side: Image Upload */}
        <div className="w-full md:w-1/2 p-6 bg-slate-800/50 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-700 relative">
           
           {imagePreview ? (
             <div className="relative w-full aspect-square max-w-sm mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-slate-600 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-medium gap-2"
                >
                  <Upload size={20} /> Change Photo
                </button>
             </div>
           ) : (
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square max-w-sm mx-auto rounded-xl border-2 border-dashed border-slate-600 hover:border-yellow-500 hover:bg-slate-800 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-yellow-500 group"
             >
                <div className="w-16 h-16 rounded-full bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center mb-4 transition-colors">
                  <ImageIcon size={32} />
                </div>
                <p className="font-medium">Click to upload coin photo</p>
                <p className="text-xs text-slate-500 mt-2">JPG, PNG (Max 5MB)</p>
             </div>
           )}
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*"
             onChange={handleFileChange}
           />
           
           {isAnalyzing && (
             <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-yellow-500 z-20 backdrop-blur-sm">
                <Loader2 size={40} className="animate-spin mb-3" />
                <p className="font-serif text-lg animate-pulse">Consulting the Numismatist...</p>
             </div>
           )}
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-white">Add New Specimen</h2>
            <button onClick={onClose} className="hidden md:block text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            
            {!imagePreview && (
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-blue-200 text-sm mb-4">
                    <Sparkles size={20} className="shrink-0 text-blue-400" />
                    <p>Upload a photo first! Our Gemini AI will automatically identify the coin, date, and country for you.</p>
                </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Coin Title / Denomination</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Lincoln Penny"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  placeholder="e.g. USA"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Year</label>
                <input
                  type="text"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="e.g. 1945"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Composition</label>
                  <input
                    type="text"
                    value={formData.composition || ''}
                    onChange={(e) => setFormData({...formData, composition: e.target.value})}
                    placeholder="e.g. 95% Copper"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  />
               </div>
               <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Est. Value</label>
                  <input
                    type="text"
                    value={formData.estimatedValue || ''}
                    onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
                    placeholder="e.g. $2 - $5"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  />
               </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Description & History</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="AI will populate this with interesting facts..."
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>

            <div className="pt-4 flex gap-3 mt-auto">
               <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-lg border border-slate-600 text-slate-300 font-semibold hover:bg-slate-800 transition-colors"
               >
                 Cancel
               </button>
               <button 
                  type="submit"
                  disabled={!imagePreview || !formData.title}
                  className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-900 font-bold hover:from-yellow-500 hover:to-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
               >
                 Save to Collection
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCoinModal;

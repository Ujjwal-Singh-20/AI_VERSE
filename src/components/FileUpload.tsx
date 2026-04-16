import React, { useCallback, useState } from 'react';
import { UploadCloud, FileType, CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: { name: string; content: string } | null) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept = ".pkl" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{name: string, size: number} | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (file: File) => {
    if (!file) return;
    
    // Check extension
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    if (accept && !accept.split(',').includes(ext)) {
      alert(`Invalid file type. Accepted: ${accept}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = (e.target?.result as string).split(',')[1];
      setSelectedFile({ name: file.name, size: file.size });
      onFileSelect({ name: file.name, content: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full flex flex-col h-full bg-[#0B0F1A] border-l border-white/5 relative items-center justify-center p-8">
      
      {!selectedFile ? (
        <div 
          className={`w-full max-w-md aspect-video rounded-4xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            accept={accept} 
            onChange={handleChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 text-slate-400">
            <UploadCloud size={32} />
          </div>
          
          <h3 className="text-white font-black uppercase tracking-tight font-outfit text-xl mb-2">Upload Artifact</h3>
          <p className="text-slate-500 font-medium text-ui-xs font-mono">Drag & drop or click to browse</p>
          <p className="text-blue-500/70 font-black text-ui-2xs mt-4 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">Accepts {accept}</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="w-full max-w-md bg-emerald-500/10 border border-emerald-500/30 rounded-4xl p-8 flex flex-col items-center justify-center relative"
        >
          <button 
            onClick={() => { setSelectedFile(null); onFileSelect(null); }}
            className="absolute top-6 right-6 p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
          
          <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mb-6 text-white shadow-lg shadow-emerald-500/30">
            <FileType size={32} />
          </div>
          
          <h3 className="text-white font-black uppercase tracking-tight font-outfit text-xl mb-2 text-center break-all">{selectedFile.name}</h3>
          <div className="flex items-center gap-2 text-emerald-400 font-black text-ui-2xs uppercase tracking-widest font-mono">
            <CheckCircle size={14} />
            Ready for Engine Injection ({formatSize(selectedFile.size)})
          </div>
        </motion.div>
      )}
      
    </div>
  );
};

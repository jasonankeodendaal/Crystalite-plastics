import React from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  closeText?: string;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, closeText = "Close Window" }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[var(--border-radius)] shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-[#1a1a1a] text-white p-6 flex justify-between items-center sticky top-0 z-10 border-b-4 border-[var(--primary-yellow)]">
          <h2 className="text-2xl font-black uppercase tracking-tighter">{title}</h2>
          <button 
            onClick={onClose}
            className="text-[var(--primary-yellow)] hover:text-white text-3xl font-black leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-8">
          {children}
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-[#1a1a1a] text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-[#333] rounded-[var(--border-radius)]"
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
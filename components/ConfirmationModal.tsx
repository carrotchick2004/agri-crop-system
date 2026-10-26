import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDestructive = false,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-border-color">
        <div className="p-6">
          <div className={`size-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-50 dark:bg-red-900/30 text-red-600' : 'bg-primary/10 text-primary'}`}>
            <span className="material-symbols-outlined text-2xl">
              {isDestructive ? 'warning' : 'info'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{message}</p>
        </div>
        
        <div className="p-4 bg-background-light dark:bg-background-dark border-t border-border-color flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-text-main font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {cancelLabel || t('cancel')}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg text-white font-bold shadow-sm transition-all ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' 
                : 'bg-primary hover:bg-primary-hover shadow-primary/20'
            }`}
          >
            {confirmLabel || t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
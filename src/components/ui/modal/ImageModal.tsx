import React from "react";
import { Modal } from ".";
import { X } from "lucide-react"; // Pastikan Anda punya lucide-react

interface ImageModalProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt = "Image", isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen} 
      onClose={onClose} 
      // Ukuran diperkecil ke max-w-2xl dan padding disesuaikan
      className="max-w-2xl p-0 overflow-hidden bg-transparent shadow-none border-none"
    >
      <div className="relative group">
        {/* Tombol Close Terapung */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors lg:fixed lg:top-5 lg:right-5"
          title="Close"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Container Gambar */}
        <div className="flex flex-col items-center justify-center w-full overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-2xl">
          <div className="relative w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-1">
            <img
              src={src}
              alt={alt}
              // Max height dibatasi ke 70vh agar tidak memakan seluruh layar
              className="w-full h-auto max-h-[70vh] object-contain rounded-3xl shadow-inner"
            />
          </div>
          
          {/* Caption Area */}
          {alt && alt !== "Image" && (
            <div className="w-full px-5 py-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-500 mb-0.5">
                Image Preview
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {alt}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImageModal;
import React from "react";
import { Modal } from ".";

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
      className="max-w-4xl p-2 overflow-hidden bg-white/10 dark:bg-gray-900/50 backdrop-blur-md"
    >
      <div className="flex flex-col items-center justify-center w-full overflow-hidden rounded-2xl">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[85vh] object-contain transition-transform duration-300 hover:scale-[1.02] cursor-default"
        />
        
        {alt && alt !== "Image" && (
          <div className="w-full p-4 text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {alt}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
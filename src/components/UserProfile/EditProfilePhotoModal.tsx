import { useState, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { X, Trash2, Upload } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/getCroppedImage";

interface EditProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto?: string;
  onUpload: (file: File | null) => Promise<void>;
}

export default function EditProfilePhotoModal({
  isOpen,
  onClose,
  currentPhoto,
  onUpload,
}: EditProfilePhotoModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = async () => {
    setLoading(true);
    await onUpload(null); // null = reset to default
    setImageSrc(null);
    setLoading(false);
    onClose();
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedArea) return;
    setLoading(true);
    const croppedFile = await getCroppedImg(imageSrc, croppedArea);
    await onUpload(croppedFile);
    setLoading(false);
    setImageSrc(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">
            Change Profile Photo
          </h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image Preview & Crop */}
        <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedArea(croppedAreaPixels)
              }
              onZoomChange={setZoom}
            />
          ) : currentPhoto ? (
            <img
              src={currentPhoto}
              alt="Current Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Photo Selected
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-6 gap-2">
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button onClick={() => inputRef.current?.click()} className="flex-1">
            Upload <Upload size={16} className="ml-1" />
          </Button>
          <Button
            onClick={handleRemove}
            variant="destructive"
            className="flex-1"
            disabled={loading}
          >
            Remove <Trash2 size={16} className="ml-1" />
          </Button>
          <Button
            onClick={handleUpload}
            className="flex-1"
            disabled={!imageSrc || loading}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}

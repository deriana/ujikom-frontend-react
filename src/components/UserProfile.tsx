import React, { useState } from "react";
import ImageModal from "./ui/modal/ImageModal";
interface UserProfileProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  src,
  alt = "User",
  size = 44,
  className = "",
}) => {
  const placeholder = "/placeholder_img.jpg"; 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <span
        className={`overflow-hidden rounded-full inline-block cursor-pointer ${className}`}
        style={{ width: size, height: size }}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src || placeholder}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </span>

      <ImageModal
        src={src || placeholder}
        alt={alt}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default UserProfile;

import React from "react";

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

  return (
    <span
      className={`overflow-hidden rounded-full inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={src || placeholder}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </span>
  );
};

export default UserProfile;

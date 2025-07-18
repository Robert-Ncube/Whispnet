import React from "react";

const Avatar = ({
  user,
  image,
  size = "md",
  className = "",
  showEditIcon = false,
  onEditClick,
}) => {
  // Determine size classes
  const sizeClasses = {
    sm: "size-8 text-base",
    md: "size-12 text-xl",
    lg: "size-16 text-2xl",
    xl: "size-24 text-4xl",
    xxl: "size-32 text-5xl",
  };

  // Get initial from user's name or email
  const getInitial = () => {
    if (user?.fullname) return user.fullname.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  // Render image if available
  if (image || user?.profilePic) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={image || user.profilePic}
          alt="Profile"
          className={`rounded-full object-cover ${sizeClasses[size]}`}
        />
        {showEditIcon && (
          <button
            onClick={onEditClick}
            className="absolute bottom-0 right-0 bg-base-content p-1.5 rounded-full hover:scale-105 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-camera text-base-200"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Render placeholder with initial
  return (
    <div className={`relative ${className}`}>
      <div
        className={`
        rounded-full 
        bg-gradient-to-br from-primary to-secondary
        flex items-center justify-center
        text-white font-bold
        ${sizeClasses[size]}
      `}
      >
        {getInitial()}
      </div>
      {showEditIcon && (
        <button
          onClick={onEditClick}
          className="absolute bottom-0 right-0 bg-base-content p-1.5 rounded-full hover:scale-105 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-camera text-base-200"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Avatar;

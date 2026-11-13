import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({
  children,
  heading,
  subheading,
  tagline,
  description,
  imageSrc,
  centerContent = false,
}) => {
  return (
    <div className="h-screen flex font-body overflow-hidden">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img
          src={imageSrc}
          alt="Vectis Football Boots"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <h1 className="text-white text-3xl font-heading font-bold tracking-wider">
              VECTIS
            </h1>
          </div>

          {/* Tagline */}
          <div className="mb-12">
            <h2 className="text-white text-5xl font-heading font-bold leading-tight mb-4">
              {tagline}
            </h2>
            <p className="text-gray-300 text-base font-body leading-relaxed max-w-md">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
         <div className={`w-full max-w-md p-8 ${centerContent ? 'flex flex-col items-center max-h-screen overflow-y-auto' : 'overflow-y-auto h-full'}`}>
          {/* Mobile Logo */}
          <h1 className={`lg:hidden text-2xl font-heading font-bold tracking-wider mb-8 ${centerContent ? 'text-center w-full' : ''}`}>
            VECTIS
          </h1>

          {/* Heading */}
          <h2 className={`text-3xl font-heading font-bold text-gray-900 mb-2 ${centerContent ? 'text-center w-full' : ''}`}>
            {heading}
          </h2>
          
          {/* Subheading */}
          <p className={`font-body mb-6 ${centerContent ? 'text-center w-full text-gray-600' : 'text-gray-600'}`}>
            {subheading}
          </p>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
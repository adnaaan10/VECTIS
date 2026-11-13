import { useState } from "react";
import { ImageOff } from "lucide-react";

const SmartImage = ({ src, alt, className = "", label }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-neutral-200 text-neutral-400 ${className}`}>
        <div className="flex flex-col items-center gap-2">
          <ImageOff className="h-8 w-8" />
          {label && (
            <span className="text-[10px] uppercase tracking-widest">{label}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      loading="lazy"
      className={className}
    />
  );
};

export default SmartImage;
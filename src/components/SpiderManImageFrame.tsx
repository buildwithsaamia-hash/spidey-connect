import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

interface SpiderManImageFrameProps {
  className?: string;
}

const LOCAL_STORAGE_IMG_KEY = 'spidey_connect_client_spiderman_img';

export const SpiderManImageFrame: React.FC<SpiderManImageFrameProps> = ({ className = '' }) => {
  const [imageSrc, setImageSrc] = useState<string>('/spiderman.jpg');
  const [hasError, setHasError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_IMG_KEY);
      if (saved) {
        setImageSrc(saved);
        setHasError(false);
      }
    } catch {
      // Storage access check
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
        setHasError(false);
        try {
          localStorage.setItem(LOCAL_STORAGE_IMG_KEY, result);
        } catch {
          // Ignore quota
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative w-full max-w-[420px] mx-auto ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
        id="spiderman-file-upload"
      />

      {/* Clean 3:4 (900x1200) frame with rounded-xl corners and soft shadow, NO overlay text or brackets */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(11,42,74,0.08)] border border-[#0B2A4A]/10 bg-white">
        {!hasError ? (
          <img
            src={imageSrc}
            alt="Spider-Man"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-center rounded-xl"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Clean minimal fallback if /public/spiderman.jpg is not yet placed on disk */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0B2A4A]/5 text-center cursor-pointer hover:bg-[#0B2A4A]/10 transition-colors rounded-xl"
            title="Click to select image file"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 text-[#0B2A4A]">
              <Upload className="w-5 h-5 text-[#0B2A4A]" />
            </div>
            <p className="text-xs font-semibold text-[#0B2A4A]">Click to select Spider-Man image</p>
            <p className="text-[11px] text-[#0B2A4A]/50 mt-1">or add to /public/spiderman.jpg</p>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleDragEvents, onImageUpload]);


  return (
    <div
      className={`relative w-full h-full min-h-[300px] md:aspect-square flex flex-col justify-center items-center border-2 border-dashed rounded-lg transition-all duration-300 ${
        isDragging ? 'border-indigo-500 bg-gray-700/50' : 'border-gray-600 bg-gray-800/20'
      }`}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
      />
      <label htmlFor="file-upload" className="flex flex-col items-center text-center cursor-pointer p-8">
        <UploadIcon className="w-12 h-12 mb-4 text-gray-500" />
        <p className="text-lg font-semibold text-gray-300">
          <span className="text-indigo-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-gray-500 mt-1">PNG, JPG, or WEBP</p>
      </label>
    </div>
  );
};

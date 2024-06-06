
import React, { useRef } from 'react';

const CameraButton: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openCamera = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Captured file:', file);
      // Handle the captured file (e.g., upload to a server or display in the UI)
    }
  };

  return (
    <div>
      <button
        onClick={openCamera}
        className="p-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Open Camera
      </button>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={inputRef}
        onChange={handleCapture}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CameraButton;

// pages/gallery.tsx
"use client";
import { useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import Sidebar from '../../../components/sidebar';

const Gallery = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedPhotos = Array.from(event.target.files).map(file => URL.createObjectURL(file));
      setPhotos([...photos, ...uploadedPhotos]);
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="flex-1 p-8">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="items-start justify-between md:flex mt-8">
            <div className="max-w-lg">
              <h3 className="text-2xl font-bold">
                Gallery
              </h3>
              <p className="mt-2">
                A collection of photos. Upload multiple photos to add to the gallery.
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center px-4 py-2 text-white font-medium bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-500"
              >
                <FaPlusCircle className="mr-2" />
                Add Photos
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img src={photo} alt={`Gallery Photo ${index + 1}`} className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gallery;

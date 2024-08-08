"use client";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import { HiMenuAlt1 } from 'react-icons/hi';
import Sidebar from '../../../components/sidebar';

const Gallery = () => {
  const [photos, setPhotos] = useState<{ id: string, url: string }[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/pages/signin');
    }
  }, [router]);

  useEffect(() => {
    // Fetch photos from the backend
    axios.get('http://localhost:3000/api/admin/getAllPhotos')
      .then(response => setPhotos(response.data.map((photo: { url: string }) => photo.url)))
      .catch(error => console.error('Error fetching photos:', error));
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const formData = new FormData();
      Array.from(event.target.files).forEach(file => formData.append('image', file));
      
      axios.post('http://localhost:3000/api/admin/addPhoto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        setPhotos([...photos, ...response.data]);
      })
      .catch(error => console.error('Error uploading photos:', error));
    }
  };

  const handlePhotoDelete = (id: string) => {
    axios.delete(`http://localhost:3000/api/admin/deletePhoto/${id}`)
      .then(() => {
        setPhotos(photos.filter(photo => photo.id !== id));
      })
      .catch(error => console.error('Error deleting photo:', error));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="absolute top-4 left-4 md:hidden">
        <button 
          onClick={toggleSidebar} 
          className="text-white bg-blue-600 p-2 rounded-full shadow-lg focus:outline-none"
        >
          <HiMenuAlt1 size={24} />
        </button>
      </div>
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
            {photos.map((photo) => (
              <div key={photo.id} className="relative">
                <img src={photo.url} alt={`Gallery Photo ${photo.id}`} className="w-full h-48 object-cover rounded-lg shadow-md" />
                <button 
                  onClick={() => handlePhotoDelete(photo.id)} 
                  className="absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow-md hover:bg-red-500 hover:text-white transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gallery;

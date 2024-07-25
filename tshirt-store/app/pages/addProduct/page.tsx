"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("ProductName", productName);
    formData.append("Price", price);
    formData.append("Size", size);
    formData.append("Type", type);
    formData.append("image", image);

    try {
      await axios.post("http://localhost:3000/api/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product added successfully!");
      router.push("/admin/products"); // Redirect to the product listing page after successful addition
    } catch (error) {
      console.error("There was an error adding the product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""} bg-gray-100 dark:bg-gray-900 rounded-lg md:p-6`}>
      <div className="container mx-auto ">
      
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Size</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Type</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

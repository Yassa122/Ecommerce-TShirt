"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [sizes, setSizes] = useState([{ size: "Select Size", quantity: "" }]);
  const [image, setImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState("No file chosen");
  const router = useRouter();

  const basicSizes = ["Select Size", "XS", "S", "M", "L", "XL", "XXL"];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setImageName(event.target.files[0].name);
    }
  };

  const handleSizeChange = (index: number, field: string, value: string) => {
    const updatedSizes = sizes.map((sizeObj, i) =>
      i === index ? { ...sizeObj, [field]: value } : sizeObj
    );
    setSizes(updatedSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { size: "Select Size", quantity: "" }]);
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
    formData.append("Type", type);
    formData.append("image", image);

    formData.append("Sizes", JSON.stringify(sizes));

    try {
      await axios.post("http://localhost:3000/api/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product added successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("There was an error adding the product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-4 md:p-6">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 p-4 md:p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Type</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-700"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Sizes and Quantities</label>
              {sizes.map((sizeObj, index) => (
                <div key={index} className="flex flex-row items-center space-x-2 mb-2">
                  <select
                    value={sizeObj.size}
                    onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                    className="w-1/2 p-2 border text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800"
                  >
                    {basicSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={sizeObj.quantity}
                    onChange={(e) => handleSizeChange(index, "quantity", e.target.value)}
                    className="w-1/2 p-2 border text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addSizeField}
                className="text-blue-500"
              >
                + Add Size
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Product Image</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="product-image"
                />
                <label
                  htmlFor="product-image"
                  className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  Choose File
                </label>
                <span className="text-gray-600 dark:text-gray-400">{imageName}</span>
              </div>
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

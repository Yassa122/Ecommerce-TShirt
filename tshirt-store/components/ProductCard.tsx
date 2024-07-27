import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 drop-shadow-lg">
      <div className="w-full h-64 flex items-center justify-center">
        <img src={product.image} alt={product.name} className="object-contain w-full h-auto" />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
        <div className="text-center text-white dark:text-black">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="text-lg mb-4">{product.description}</p>
          <Link href={`/product/${product.id}`} legacyBehavior>
            <a className="text-blue-400 dark:text-blue-600 hover:text-blue-300 dark:hover:text-blue-500 transition">View Product</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

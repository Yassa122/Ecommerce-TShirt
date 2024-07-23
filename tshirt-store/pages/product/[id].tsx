import { useRouter } from 'next/router';

const Product: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Product {id}</h1>
      <p className="text-lg">Detailed description of product {id}.</p>
      <button className="bg-blue-500 text-white px-4 py-2 mt-4">Add to Cart</button>
    </div>
  );
};

export default Product;

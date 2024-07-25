import { useCart } from '../../context/CartContext';

const Cart: React.FC = () => {
  const { cart } = useCart();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-lg">Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="border p-4 my-2">
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;

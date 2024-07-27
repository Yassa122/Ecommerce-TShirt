import Link from 'next/link';

const Footer: React.FC = () => {
  return (
<footer className="bg-zinc-900 dark:bg-gray-800 text-white dark:text-gray-300 py-8 mt-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">T-Shirt Store</h3>
            <p>Discover your style with our exclusive collection of T-shirts. Quality and comfort at its best.</p>
          </div>
          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul>
              <li><Link href="#home" legacyBehavior><a className="hover:underline">Home</a></Link></li>
              <li><Link href="#products" legacyBehavior><a className="hover:underline">Products</a></Link></li>
              <li><Link href="#about" legacyBehavior><a className="hover:underline">About Us</a></Link></li>
              <li><Link href="#contact" legacyBehavior><a className="hover:underline">Contact</a></Link></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p>Email: contact@tshirtstore.com</p>
            <p>Phone: +123 456 7890</p>
            <p>Address: 123 Fashion St, City, Country</p>
            {/* Social Media Links */}
            <div className="mt-4">
              <h4 className="text-lg font-bold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-400 hover:text-blue-600"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-blue-400 hover:text-blue-600"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-blue-400 hover:text-blue-600"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-blue-400 hover:text-blue-600"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p>&copy; 2024 T-Shirt Store. All rights reserved.</p>
        </div>
      </footer>     
  );    
}   
export default Footer;
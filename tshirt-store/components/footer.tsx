import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-customGray text-white dark:text-gray-300 py-8 mt-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-bold mb-4">amaria</h3>
          <p>It girl essentials</p>
        </div>
        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul>
            <li><Link href="#home" legacyBehavior><a className="hover:underline">Home</a></Link></li>
            <li><Link href="#products" legacyBehavior><a className="hover:underline">Products</a></Link></li>
            <li><Link href="#about" legacyBehavior><a className="hover:underline">About Us</a></Link></li>
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p>Email: amariaclothing.info@gmail.com</p>
          {/* Social Media Links */}
          <div className="mt-4">
            <h4 className="text-lg font-bold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/amariaa.eg" className="text-blue-400 hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center border-t border-gray-700 pt-4">
        <p>&copy; 2024 amaria eg. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

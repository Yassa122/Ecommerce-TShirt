// pages/contact.tsx
"use client";
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-zinc-950 dark:bg-gray-100 text-white dark:text-black min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        
        {/* Contact Information */}
        <div className="text-center mb-8">
          <p className="text-lg">Feel free to reach out to us via any of the following methods:</p>
          <div className="mt-4">
            <p className="text-md"><strong>Email:</strong> contact@tshirtstore.com</p>
            <p className="text-md"><strong>Phone:</strong> +123 456 7890</p>
          </div>
        </div>
        
        {/* Instagram Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Follow Us on Instagram</h2>
          <p className="text-lg mb-4">Stay updated with our latest products and promotions. Follow us on Instagram:</p>
          <a 
            href="https://instagram.com/your-instagram-page" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-700 hover:underline"
          >
            @your_instagram_page
          </a>
        </div>
        
        {/* Contact Form */}
        <div className="max-w-2xl md:max-w-md mx-auto bg-zinc-900 dark:bg-gray-200 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-300 dark:text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border border-gray-600 dark:border-gray-300 rounded-lg bg-neutral-700 dark:bg-gray-50"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 dark:text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border border-gray-600 dark:border-gray-300 rounded-lg bg-neutral-700 dark:bg-gray-50"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 dark:text-gray-700">Message</label>
              <textarea
                name="message"
                rows={5}
                className="w-full p-2 border border-gray-600 dark:border-gray-300 rounded-lg bg-neutral-700 dark:bg-gray-50"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition w-full"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;

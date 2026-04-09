const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-2xl">🥬</div>
              <span className="text-white text-3xl font-bold">FreshMart</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted source for fresh, organic groceries delivered right to your doorstep.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <p>Shop Products</p>
              <p>My Orders</p>
              <p>About Us</p>
              <p>Contact</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <p>742 Evergreen Terrace, Springfield</p>
              <p>(555) 123-4567</p>
              <p>hello@freshmart.com</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">f</div>
              <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">𝕏</div>
              <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">📷</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm">
          © 2026 FreshMart. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  // Handle mouse enter on profile area
  const handleMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsDropdownOpen(true);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); // 300ms delay - gives user time to move to dropdown

    setDropdownTimeout(timeout);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-green-500 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl">
              🥬
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">FreshMart</span>
              <p className="text-[10px] sm:text-xs text-gray-500 -mt-1">Fresh • Organic • Fast</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <Link to="/" className="font-medium text-gray-700 hover:text-green-600 transition-colors">Home</Link>
            <Link to="/products" className="font-medium text-gray-700 hover:text-green-600 transition-colors">Shop</Link>
            <Link to="/categories" className="font-medium text-gray-700 hover:text-green-600 transition-colors">Categories</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 sm:p-3 hover:bg-gray-100 rounded-xl sm:rounded-2xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile with Hover Dropdown */}
            {user ? (
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* Profile Trigger */}
                <button className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-100 rounded-2xl transition-all">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-100 rounded-2xl flex items-center justify-center text-xl border border-green-200">
                    👤
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="font-semibold text-sm text-gray-900 leading-none">{user.fullName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link 
                      to="/profile"
                      className="block px-6 py-3 hover:bg-gray-50 text-gray-700 flex items-center gap-3"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                    
                    <button 
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-3xl hover:bg-gray-50 hover:border-green-300 transition-all font-medium"
              >
                <User className="w-5 h-5" />
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-6 py-8 flex flex-col gap-6 text-lg font-medium">
            <Link to="/" className="py-3" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products" className="py-3" onClick={() => setIsMenuOpen(false)}>Shop Products</Link>
            <Link to="/cart" className="py-3" onClick={() => setIsMenuOpen(false)}>
              Cart ({itemCount})
            </Link>
            
            {user && (
              <Link 
                to="/profile" 
                className="py-3" 
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
            )}

            {user ? (
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="py-3 text-red-600 text-left font-medium"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="py-3" 
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
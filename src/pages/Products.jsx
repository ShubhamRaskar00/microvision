import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import api from '../api'; 

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(search && { search }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(sort && { sort })
      }).toString();

      const res = await api.get(`/products?${queryParams}`);
      setProducts(res.data);
    } catch (err) {
      console.log("Backend offline, using dummy data");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchProducts(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, minPrice, maxPrice, sort]);

  return (
    <HelmetProvider>
      <PageTransition>
        <Helmet>
          <title>Buy Industrial LED Displays | MicroVision Products</title>
          <meta name="description" content="Browse high-quality industrial LED display boards, multi-color panels, and hardware accessories. Filter by price, category, and specifications." />
        </Helmet>

        <div className="min-h-screen pt-32 px-6 overflow-hidden text-white pointer-events-auto">
          <h1 className="text-5xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-500">
            SYSTEM_HARDWARE
          </h1>

          {/* FILTER / SEARCH PANEL */}
          <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-12 flex flex-wrap gap-4 items-center justify-between shadow-lg">
            <input type="text" placeholder="Search products..." className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 w-full md:w-auto flex-1" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="flex gap-2">
              <input type="number" placeholder="Min ₹" className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 w-24 text-white focus:border-green-500" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <input type="number" placeholder="Max ₹" className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 w-24 text-white focus:border-green-500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <select className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-orange-500" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* PRODUCTS GRID */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {products.length > 0 ? products.map((product) => (
              <motion.div key={product._id} whileHover={{ y: -10 }} className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md group flex flex-col justify-between">
                
                {/* Clicking image or text takes you to SEO optimized single product page */}
                <Link to={`/product/${product._id}`}>
                  <div className="h-48 overflow-hidden bg-gray-900">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-6 pb-0">
                    <span className="text-xs font-mono text-orange-400 border border-orange-400/30 px-2 py-1 rounded-full">{product.category}</span>
                    <h3 className="text-2xl font-bold mt-4 hover:text-orange-400 transition-colors">{product.name}</h3>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{product.description}</p>
                  </div>
                </Link>

                <div className="p-6 pt-4 flex justify-between items-center mt-auto border-t border-white/5">
                  <span className="text-xl font-black text-green-400">
                    ₹{product.price} <span className="text-xs text-gray-500 font-normal">/{product.unitType === 'sqft' ? 'Sq.Ft' : 'Piece'}</span>
                  </span>
                  
                  {/* Keep the inquire button to take them to the details page to fill the form */}
                  <Link to={`/product/${product._id}?inquire=true`}>
                    <button className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-orange-500 hover:text-white transition-colors">
                      Inquire
                    </button>
                  </Link>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center text-gray-500 font-mono py-20">[ NO_HARDWARE_FOUND ]</div>
            )}
          </div>
        </div>
      </PageTransition>
    </HelmetProvider>
  );
}
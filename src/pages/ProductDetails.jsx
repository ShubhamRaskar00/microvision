import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import api from '../api'; // Import the new api


export default function ProductDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const autoInquire = searchParams.get('inquire') === 'true'; // Checks if user clicked "Inquire" from previous page

  const [product, setProduct] = useState(null);
  const [inquiry, setInquiry] = useState({ name: '', phone: '', email: '', amount: 1 });

  useEffect(() => {
    // Try to fetch from backend
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => {
      });
  }, [id]);

  const submitInquiry = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inquiries', {
        ...inquiry,
        productName: product.name,
        unitType: product.unitType
      });
      toast.success('Inquiry Sent! We will contact you soon.');
      setInquiry({ name: '', phone: '', email: '', amount: 1 }); // reset
    } catch (err) {
      toast.error('Failed to send inquiry.');
    }
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center text-white">Loading Hardware Specs...</div>;

  return (
    <HelmetProvider>
      <PageTransition>
        {/* 🔥 THIS IS WHAT GOOGLE READS FOR SEO 🔥 */}
        <Helmet>
          <title>{product.name} - Buy online in Khopoli | MicroVision</title>
          <meta name="description" content={`Buy ${product.name}. ${product.description} Best price guaranteed.`} />
          <meta name="keywords" content={`${product.name}, ${product.category}, buy LED online India, MicroVision products`} />
          {/* Schema Markup for Google Products (Rich Snippets) */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": product.name,
              "image": product.image,
              "description": product.description,
              "sku": product._id,
              "offers": {
                "@type": "Offer",
                "url": `https://microvision.shop/product/${product._id}`,
                "priceCurrency": "INR",
                "price": product.price,
                "availability": "https://schema.org/InStock"
              }
            })}
          </script>
        </Helmet>

        <div className="min-h-screen pt-32 px-6 overflow-hidden text-white pointer-events-auto">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 relative z-10">
            
            {/* Left Side - Product Image */}
            <div className="bg-black/50 border border-white/10 rounded-3xl overflow-hidden p-4 h-max">
              <img src={product.image} alt={product.name} className="w-full rounded-2xl object-cover aspect-square" />
            </div>

            {/* Right Side - Details & Form */}
            <div className="flex flex-col justify-center">
              <span className="text-sm font-mono text-orange-400 tracking-widest uppercase mb-2">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-black mb-4">{product.name}</h1>
              <p className="text-xl text-green-400 font-bold mb-6">
                ₹{product.price} <span className="text-sm text-gray-500 font-normal">/{product.unitType === 'sqft' ? 'Sq.Ft' : 'Piece'}</span>
              </p>
              
              <p className="text-gray-300 leading-relaxed mb-10">{product.description}</p>

              {/* INDIAMART STYLE INQUIRY FORM */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Request a Quote
                </h3>
                
                <form onSubmit={submitInquiry} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest">{product.unitType === 'sqft' ? 'Total Area (Sq.Ft)' : 'Quantity (Pieces)'}</label>
                    <input type="number" required min="1" value={inquiry.amount} onChange={e => setInquiry({...inquiry, amount: e.target.value})} className="w-full bg-black/80 border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-green-500 outline-none" autoFocus={autoInquire} />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input type="text" required placeholder="John Doe" value={inquiry.name} onChange={e => setInquiry({...inquiry, name: e.target.value})} className="w-full bg-black/80 border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-green-500 outline-none" />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Phone</label>
                      <input type="tel" required placeholder="+91" value={inquiry.phone} onChange={e => setInquiry({...inquiry, phone: e.target.value})} className="w-full bg-black/80 border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-green-500 outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-400 uppercase tracking-widest">Email</label>
                      <input type="email" placeholder="mail@xyz.com" value={inquiry.email} onChange={e => setInquiry({...inquiry, email: e.target.value})} className="w-full bg-black/80 border border-white/10 rounded-lg p-3 text-white mt-1 focus:border-green-500 outline-none" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-black font-black py-4 rounded-xl mt-4 hover:scale-[1.02] transition-transform">
                    SEND INQUIRY TO MICROVISION
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </PageTransition>
    </HelmetProvider>
  );
}
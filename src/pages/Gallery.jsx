import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

export default function Gallery() {
  const projects = [
    { title: "Outdoor Industrial Double-Sided", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1DI766LoZKlqO58_RsPg3wsIUJ71uK7zV8Q&s" },
    { title: "Indoor P2.5 High-Def Display", img: "https://image.made-in-china.com/202f0j00clYbTqFtaCkU/High-Resolution-Wall-Fixed-Full-Color-Indoor-LED-Display-P2-5-for-Exhibition.webp" },
    { title: "Custom E-Commerce Platform", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000" },
    { title: "Borewell Panel Repair", img: "https://submersibleshop.com/cdn/shop/files/borewelldryrunmotorstarterpanel.png" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 text-white overflow-hidden">
      <h1 className="text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        Our Projects
      </h1>
      
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true,
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="w-full max-w-5xl py-10"
      >
        {projects.map((proj, idx) => (
          <SwiperSlide key={idx} className="max-w-[400px] h-[500px] rounded-2xl overflow-hidden relative group">
            <img src={proj.img} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent flex items-end p-6">
              <h3 className="text-2xl font-bold drop-shadow-lg">{proj.title}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
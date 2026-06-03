import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import api from '../api';

export default function Gallery() {
  const [projects, setProjects] = useState([]);

    useEffect(() => {
    api.get('/gallery')
      .then(res => {setProjects(res.data); })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-12 px-6 text-white overflow-hidden pointer-events-auto">
      <h1 className="text-5xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-500 uppercase">
        Our Projects
      </h1>
      
      {projects.length > 0 && (
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{ rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={true}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="w-full max-w-5xl py-10"
        >
          {projects.map((proj) => (
            <SwiperSlide key={proj._id} className="max-w-[400px] h-[500px] rounded-2xl overflow-hidden relative group">
              <img src={proj.img} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold drop-shadow-lg">{proj.title}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
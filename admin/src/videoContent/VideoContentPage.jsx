import React, { useEffect, useRef } from 'react';

const images = [
  'https://source.unsplash.com/300x300/?perth,australia',
  'https://source.unsplash.com/300x300/?fremantle,australia',
  'https://source.unsplash.com/300x300/?west-australia',
  'https://source.unsplash.com/300x300/?perth',
  'https://source.unsplash.com/300x300/?quokka,perth',
  'https://source.unsplash.com/300x300/?margaretriver,australia',
  // Add more image URLs here
];

const MultiItemCarousel = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;

    const handleNext = () => {
      const activeItem = carousel.querySelector('.active');
      const nextItem = activeItem.nextElementSibling || carousel.querySelector('.item');
      activeItem.classList.remove('active');
      nextItem.classList.add('active');
    };

    const handlePrev = () => {
      const activeItem = carousel.querySelector('.active');
      const prevItem = activeItem.previousElementSibling || carousel.querySelector('.item:last-child');
      activeItem.classList.remove('active');
      prevItem.classList.add('active');
    };

    carousel.querySelector('.carousel-control-prev').addEventListener('click', handlePrev);
    carousel.querySelector('.carousel-control-next').addEventListener('click', handleNext);

    return () => {
      carousel.querySelector('.carousel-control-prev').removeEventListener('click', handlePrev);
      carousel.querySelector('.carousel-control-next').removeEventListener('click', handleNext);
    };
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-white text-3xl text-center mt-4 mb-8">Use Tailwind CSS Carousel to Show Multiple Items per Slide</h1>
      <div className="relative">
        <div ref={carouselRef} className="carousel slide multi-item-carousel relative overflow-hidden">
          <div className="carousel-inner flex">
            {images.map((src, index) => (
              <div className={`item w-1/3 p-2 ${index === 0 ? 'active' : ''}`} key={index}>
                <a href="#1">
                  <img src={src} alt={`Slide ${index}`} className="w-full h-auto rounded-lg shadow-lg" />
                </a>
              </div>
            ))}
          </div>
          <a className="carousel-control-prev absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full" href="#theCarousel" role="button">
            <span className="text-black">❮</span>
          </a>
          <a className="carousel-control-next absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full" href="#theCarousel" role="button">
            <span className="text-black">❯</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MultiItemCarousel;

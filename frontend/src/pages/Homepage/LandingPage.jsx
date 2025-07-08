import React, { useState, useEffect, useRef } from 'react';
import { Images } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const LandingPageData = [
    {
        src: `${Images.landing1}`,
        Title: "Work in Style",
        Description: "Sleek handbags made to match your hustle",
        button : "Explore Collection"
    },
    {
        src: `${Images.landing2}`,
        Title: "Carry Confidence",
        Description: "Smart handbags for every move you make",
        button : "Explore Collection"
    },
    {
        src: `${Images.landing3}`,
        Title: "Tech Meets Trend",
        Description: "Bold designs built for everyday tech life",
        button : "Explore Collection"
    },
];

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTextVisible, setIsTextVisible] = useState(true);
  const startX = useRef(null);
  const sliderRef = useRef(null);

 useEffect(() => {
    const interval = setInterval(() => {
      setIsTextVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % LandingPageData.length);
        setIsTextVisible(true);
      }, 300); 
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleTouchStart = (e) => {
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchEnd = (e) => {
    if (startX.current === null) return;

    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = startX.current - endX;

    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }

    startX.current = null;
  };

  const goToNext = () => {
    setIsTextVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % LandingPageData.length);
      setIsTextVisible(true);
    }, 300);
  };

  const goToPrev = () => {
    setIsTextVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? LandingPageData.length - 1 : prev - 1
      );
      setIsTextVisible(true);
    }, 300);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="slider-container h-screen w-full bg-black overflow-hidden relative"
      ref={sliderRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      <div
        className="slider flex transition-transform duration-700 ease-in-out h-full w-full"
        style={{ transform: `translateX(-${currentIndex * 100}vw)` }}
      >
        {LandingPageData.map((image, index) => (
          <div
            className="slide flex-shrink-0 h-screen w-screen bg-center bg-cover relative"
            key={index}
            style={{ backgroundImage: `url(${image.src})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20">
              <div className={`
                transition-all duration-1500 ease-in-out text-center
                ${index === currentIndex
                  ? isTextVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-35'
                  : 'opacity-0 translate-y-35'}
                flex flex-col items-center
              `}>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{image.Title}</h1>
                <p className="text-md md:text-2xl mb-6">{image.Description}</p>
                <NavLink to={"/Collections"}>
                  <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
                    {image.button}
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Dots */}
      <div className="dots absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {LandingPageData.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full border-[1px] border-white flex items-center justify-center cursor-pointer ${index === currentIndex ? 'bg-white' : 'bg-transparent'}`}
            onClick={() => handleDotClick(index)}
          >
            <span className="block w-2 h-2 rounded-full bg-black"></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type ImageGalleryProps = {
  image_urls: string[];
  title: string;
};

export const ImageGallery = ({ image_urls, title }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 === image_urls.length ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? image_urls.length - 1 : prev - 1));
  };

  const handleImageClick = (i: number) => {
    setCurrentIndex(i);
  };

  return (
    <div className="flex flex-col pb-6">
      <div className="relative h-80 w-full">
        <img
          src={image_urls[currentIndex]}
          alt={title}
          className="h-80 w-full object-contain"
        />
        <ChevronLeftIcon
          onClick={handlePrev}
          className="absolute left-1 top-1/2 h-8 w-8 cursor-pointer rounded-full hover:bg-rent-very-light-gray"
        />
        <ChevronRightIcon
          onClick={handleNext}
          className="absolute right-1 top-1/2 h-8 w-8 cursor-pointer rounded-full hover:bg-rent-very-light-gray"
        />
      </div>
      <div className="flex flex-wrap pt-2">
        {image_urls.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={title}
            className={`mb-1 mr-1 h-20 w-20 ${
              currentIndex === i && "border-2 border-rent-dark-green"
            }`}
            onClick={() => handleImageClick(i)}
          />
        ))}
      </div>
    </div>
  );
};

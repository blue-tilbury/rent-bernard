type ImageGalleryProps = {
  image_urls: string[];
};

export const ImageGallery = ({ image_urls }: ImageGalleryProps) => {
  return (
    <div className="flex pb-6">
      <img src={image_urls[0]} alt="room" />
      {/* {image_urls.map((url, i) => (
        <img key={i} src={url} alt="room" />
      ))} */}
    </div>
  );
};

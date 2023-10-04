type ThumbProps = {
  title: string;
  price: number;
  city: string;
  image_urls: string;
  updated_at: string;
};

export const Thumb = (props: ThumbProps) => {
  return (
    <li className="flex rounded-md bg-white">
      <img className="h-44 w-60 rounded-3xl object-cover p-4" src={props.image_urls} />
      <div className="flex flex-col p-8">
        <h2 className="font-medium">{props.title}</h2>
        <p>$ {props.price}</p>
        <p>{props.city}</p>
        <p>{props.updated_at} mins ago</p>
      </div>
    </li>
  );
};

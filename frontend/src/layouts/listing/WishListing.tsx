type WishListingProps = {
  title: string;
  price: number;
  location: string;
  img: string;
  updated_at: string;
};

export const WishListing = (props: WishListingProps) => {
  return (
    <div className="flex rounded-md bg-white">
      <img className="rounded-3xl p-4" src={props.img} />
      <div className="flex flex-col p-8">
        <h2 className="font-medium">{props.title}</h2>
        <p>$ {props.price}</p>
        <p>{props.location}</p>
        <p>{props.updated_at} mins ago</p>
      </div>
    </div>
  );
};

type CategoryProps = {
  index: number;
  title: string;
};

export const Heading = ({ index, title }: CategoryProps) => {
  return (
    <h2 className="mb-2 border-b border-dotted border-rent-gray pb-4 text-xl font-medium">
      <span className="ml-1 mr-3 rounded border-2 bg-rent-bg-gray px-3 py-1">
        {index}
      </span>
      {title}
    </h2>
  );
};

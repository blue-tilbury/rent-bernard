type CategoryProps = {
  index: number;
  title: string;
};

export const Heading = ({ index, title }: CategoryProps) => {
  return (
    <h2 className="mb-2 border-b border-dotted border-rent-gray pb-3 md:pb-4 md:text-xl md:font-medium">
      <span className="ml-1 mr-3 rounded border-2 bg-rent-bg-gray px-2 py-0.5 md:px-3 md:py-1">
        {index}
      </span>
      {title}
    </h2>
  );
};

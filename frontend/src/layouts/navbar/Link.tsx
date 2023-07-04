import { SelectedPage } from "../../types";
import AnchorLink from "react-anchor-link-smooth-scroll";

type Props = {
  page: string;
  setIsToggled: (value: boolean) => void;
};

export const Link = ({ page, setIsToggled }: Props) => {
  const lowerCasePage = page.toLowerCase() as SelectedPage;

  return (
    <AnchorLink
      className="transition duration-500 hover:underline"
      href={`#${lowerCasePage}`}
      onClick={() => setIsToggled(false)}
    >
      {page}
    </AnchorLink>
  );
};

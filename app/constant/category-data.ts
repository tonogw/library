import FictionIcon from "../../public/icons/iconCategory-fiction.svg";
import EducationIcon from "../../public/icons/iconCategory-EducationReference.svg";
import TechnologyIcon from "../../public/icons/iconCategory-ScienceTechnology.svg";
import FinanceIcon from "../../public/icons/iconCategory-FinanceBusiness.svg";
import SelfImprovementIcon from "../../public/icons/iconCategory-SelfImprovement.svg";
import nonFictionIcon from "../../public/icons/IconCategory-NonFiction.svg";
// import {StaticImageData} from ""

type CategoryData = {
  category: string;
  src: String;
  href: string;
  alt: string;
  // hoverBg:string;
};

export const categoryData: CategoryData[] = [
  {
    category: "Fiction",
    src: FictionIcon,
    href: "/",
    alt: "Fiction",
  },
  {
    category: "Non-Fiction",
    src: nonFictionIcon,
    href: "/",
    alt: "Non-Fiction",
  },
  {
    category: "Self-Improvement",
    src: SelfImprovementIcon,
    href: "/",
    alt: "Self Improvement",
  },
  {
    category: "Finance",
    src: FinanceIcon,
    href: "/",
    alt: "Finance",
  },
  {
    category: "Science & Technology",
    src: TechnologyIcon,
    href: "/",
    alt: "Science & Technology",
  },
];

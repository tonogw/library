import FictionIcon from "../../public/icons/iconCategory-fiction.svg";
import EducationIcon from "../../public/icons/iconCategory-EducationReference.svg";
import TechnologyIcon from "../../public/icons/iconCategory-ScienceTechnology.svg";
import FinanceIcon from "../../public/icons/iconCategory-FinanceBusiness.svg";
import SelfImprovementIcon from "../../public/icons/iconCategory-SelfImprovement.svg";
import nonFictionIcon from "../../public/icons/IconCategory-NonFiction.svg";
// import {StaticImageData} from ""

// HOME PAGE CATEGORY as per Figma
type CategoryData = {
  category: string;
  src: string;
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
  {
    category: "Education",
    src: EducationIcon,
    href: "/",
    alt: "Education",
  },
];

// ===============================
// BOOK CATEGORIES FOR ADMIN
// ==============================
const rawBackendCategories = [
  { id: 8, name: "Education" },
  { id: 4, name: "Fiction" },
  { id: 9, name: "Finance" },
  { id: 5, name: "Lifestyle" },
  { id: 10, name: "Non-Fiction" },
  { id: 6, name: "Religious" },
  { id: 11, name: "Science" },
  { id: 12, name: "Science-Fiction" },
  { id: 7, name: "Self-Improvement" },
  { id: 17, name: "string" },
  { id: 13, name: "Test Category API" },
  { id: 1, name: "Updated Category API" },
  { id: 15, name: "Updated Dummy Category" },
];

export const categoriesBackend = [...rawBackendCategories].sort((a, b) =>
  a.name.localeCompare(b.name),
);

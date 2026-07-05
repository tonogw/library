import FictionIcon from "/icons/iconCategory-fiction.svg";
import EducationIcon from "/icons/iconCategory-EducationReference.svg";
import TechnologyIcon from "/icons/iconCategory-ScienceTechnology.svg";
import FinanceIcon from "/icons/iconCategory-FinanceBusiness.svg";
import SelfImprovementIcon from "/icons/iconCategory-SelfImprovement.svg";
import nonFictionIcon from "/icons/iconCategory-NonFiction.svg";
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
    href: "/user/books?category=Fiction",
    alt: "Fiction",
  },
  {
    category: "Non-Fiction",
    src: nonFictionIcon,
    href: "/user/books?category=Non-Fiction",
    alt: "Non-Fiction",
  },
  {
    category: "Self-Improvement",
    src: SelfImprovementIcon,
    href: "/user/books?category=Self-Improvement",
    alt: "Self Improvement",
  },
  {
    category: "Finance",
    src: FinanceIcon,
    href: "/user/books?category=Finance",
    alt: "Finance",
  },
  {
    category: "Science & Technology",
    src: TechnologyIcon,
    href: "/user/books?category=Science & Technology",
    alt: "Science & Technology",
  },
  {
    category: "Education",
    src: EducationIcon,
    href: "/user/books?category=Education",
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

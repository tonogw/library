import Author1 from "/images/author1.png";
import Author2 from "/images/author2-JackGrealish.png";
import Author3 from "/images/author3-jeremy.png";
import Author4 from "/images/author4-female.png";

type AuthorData = {
  id: number;
  src: string; // avatar
  name: string;
  badge: number;
};

export const authorData: AuthorData[] = [
  {
    id: 1,
    src: Author1,
    name: "John Doe",
    badge: 8, // books
  },
  {
    id: 2,
    src: Author2,
    name: "JackGrealish",
    badge: 7, // books
  },
  {
    id: 3,
    src: Author3,
    name: "Jeremy",
    badge: 6, // books
  },
  {
    id: 4,
    src: Author4,
    name: "Jane Doe",
    badge: 5, // books
  },
];

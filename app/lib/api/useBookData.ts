import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "~/lib/api/axios";
import { checkOutstandingLoan, deleteBookById } from "./book-maintenance";

// import {  string } from "zod";

interface UseBookDataParams {
  initialData?: any;
  onSubmit: (data: any) => void; //FormData -> any
}

// const convertFileToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });
// };

// This function is for adminUser only
export function useBookData({ initialData, onSubmit }: UseBookDataParams) {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isbn, setIsbn] = useState("");

  // STATE BARU KHUSUS ADMIN VALIDASI
  const [totalCopies, setTotalCopies] = useState("1");
  const [availableCopies, setAvailableCopies] = useState("1");

  const [isDuplicate, setIsDuplicate] = useState(false);
  const [existingBookInfo, setExistingBookInfo] = useState<any>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setIsbn(initialData.isbn || "");
      setAuthorId(initialData.authorId || "");
      setAuthorName(initialData.authorName || initialData.author?.name || "");
      setCategoryId(initialData.categoryId || "");
      setPublishedYear(initialData.publishedYear || "");
      setDescription(initialData.description || "");
      setPreviewUrl(initialData.coverImage || "");
      setTotalCopies(initialData.totalCopies || "1");
      setAvailableCopies(initialData.availableCopies || "1");

      if (initialData.coverImage) {
        setPreviewUrl(initialData.coverImage);
      } else {
        setPreviewUrl("");
      }
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error("Failed read image file:", error);
      };

      //   setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // DEBOUNCE EFFECT: Cek duplikasi otomatis ke server saat admin selesai mengetik judul
  useEffect(() => {
    if (!title || initialData) {
      // Jangan cek jika input kosong ATAU sedang dalam mode EDIT buku lama
      setIsDuplicate(false);
      setExistingBookInfo(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setCheckingDuplicate(true);
      try {
        // Panggil endpoint pencarian spesifik berdasarkan judul (menghindari overload jutaan data)
        const res = await api.get(
          `/api/books/search?title=${encodeURIComponent(title)}`,
        );
        const foundBooks = res.data || [];

        // Cari yang judulnya sama persis (exact match)
        const exactMatch = foundBooks.find(
          (b: any) =>
            b.title.toLowerCase().trim() === title.toLowerCase().trim(),
        );

        if (exactMatch) {
          setIsDuplicate(true);
          setExistingBookInfo(exactMatch);
          toast.warning(
            `Info Admin: Buku dengan judul "${title}" sudah terdaftar di sistem!`,
          );
        } else {
          setIsDuplicate(false);
          setExistingBookInfo(null);
        }
      } catch (error) {
        console.error("Gagal memeriksa duplikasi data:", error);
      } finally {
        setCheckingDuplicate(false);
      }
    }, 60000000); // Memberi jeda 600ms setelah admin berhenti mengetik

    return () => clearTimeout(delayDebounceFn);
  }, [title, initialData]);

  const handleDeleteBook = async () => {
    if (!initialData?.id) {
      setCoverImage(null);
      setPreviewUrl("");
      return;
    }

    setIsDeleting(true);
    try {
      const isBlocked = await checkOutstandingLoan(initialData.id);
      if (isBlocked) {
        toast.error(
          `There's outstanding loan, book "${title}" cannot be deleted!`,
        );
        setIsDeleting(false);
        return;
      }

      await deleteBookById(initialData.id);
      toast.success("Book data deleted successfully");
      setCoverImage(null);
      setPreviewUrl("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete book data",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isbn || isbn.trim() === "") {
      toast.error("ISBN is required");
      return;
    }

    if (!categoryId) {
      toast.error("Select category first!");
      return;
    }

    // Cegat submit jika admin memaksakan input judul yang sudah duplikat
    if (isDuplicate) {
      toast.error(
        "Tidak dapat menyimpan. Judul buku sudah ada di database perpustakaan!",
      );
      return;
    }

    // if (initialData) {
    //   let secureCoveringString = "https://picsum.photos/200/300";
    //   let finalCoverString = "https://picsum.photos/200/300";

    //   if (previewUrl && !previewUrl.includes("via.placeholder.com")) {
    //     CoveringString = previewUrl;
    //   }

    //   if (coverImage) {
    //     try {
    //       finalCoverString = await convertFileToBase64(coverImage);
    //     } catch (err) {
    //       console.error("Failed to convert image:", err);
    //     }
    //   } else if (
    //     previewUrl &&
    //     !previewUrl.includes("via.placeholder.com") &&
    //     !previewUrl.includes("blob:")
    //   ) {
    // finalCoverString = previewUrl;
    //   }

    //   const jsonPayload = {
    //     title: title,
    //     description: description,
    //     isbn: isbn.trim(),
    //     publishedYear: Number(publishedYear) || 0,
    //     authorId: Number(initialData.authorId) || 0,
    //     authorName: authorName || "Unknown",
    //     categoryId: Number(categoryId),
    //     totalCopies: Number(totalCopies) || 0,
    //     availableCopies: Number(availableCopies) || 0,
    // Karena backend minta teks string, kita kirim string previewUrl
    // atau URL dummy sementara agar tidak ditolak validasi
    // coverImage: previewUrl || "https://picsum.photo/200/300",
    // coverImage: secureCoveringString,
    // coverImage: finalCoverString,
    //   };
    // Kirim data objek JSON murni ke handler pembungkus
    //   onSubmit(jsonPayload);
    // };
    // } else {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("isbn", isbn.trim());
    formData.append("publishedYear", String(Number(publishedYear || "")));
    formData.append("authorId", "");
    formData.append("authorName", authorName || "unknown");
    formData.append("categoryId", String(Number(categoryId)));

    formData.append("totalCopies", String(Number(totalCopies) || 1));
    formData.append("availableCopies", String(Number(availableCopies) || 1));

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }
    // else if (previewUrl) {
    //   formData.append("coverImage", previewUrl);
    // }

    onSubmit(formData);
  };

  return {
    title,
    setTitle,
    isbn,
    setIsbn,
    authorName,
    setAuthorName,
    categoryId,
    setCategoryId,
    publishedYear,
    setPublishedYear,
    description,
    setDescription,
    previewUrl,
    totalCopies,
    setTotalCopies,
    availableCopies,
    setAvailableCopies,
    isDeleting,
    isDuplicate, // Bisa dipakai di UI untuk mewarnai border merah jika error
    existingBookInfo, // Berisi info sirkulasi buku lama untuk diintip admin
    checkingDuplicate,
    handleFileChange,
    handleDeleteBook,
    handleFormSubmit,
  };
}

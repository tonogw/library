import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
// import { InputGroup } from "../ui/input-group";
import { Label } from "radix-ui";
// import { Button } from "../ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ChevronDown, UploadCloud } from "lucide-react";

import { toast } from "sonner";
// import { Toast } from "radix-ui";
import api from "~/lib/api/axios";

interface BookFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  isPending: boolean;
  categories: any[];
}

export function BookData({
  initialData,
  onSubmit,
  isPending,
  categories,
}: BookFormProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pages, setPages] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setAuthor(initialData.author?.name || initialData.author || "");
      setCategoryId(initialData.categoryId || "");
      setPages(String(initialData.publishedYear || ""));
      setDescription(initialData.description || "");
      setPreviewUrl(initialData.coverImage || "");
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteBook = async () => {
    if (!initialData?.id) {
      // if new data and not found in db, clean local state
      setCoverImage(null);
      setPreviewUrl("");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await api.delete(`/api/books/${initialData.id}`);

      if (res.status === 200 || res.status === 204) {
        toast.success("Book data deleted successfully");
        setCoverImage(null);
        setPreviewUrl("");
      }
    } catch (error: any) {
      // Get error message from axios
      const resData = error.res?.data;
      const errorMessage = resData?.message || "";
      const status = error.res?.status;

      if (
        // error.res?.status === 400 ||
        status === 400 ||
        errorMessage.toLowerCase().includes("outstanding") ||
        errorMessage.toLowerCase().includes("loan")
        // error.res?.data?.message?.toLowerCase().includes("outstanding")
      ) {
        toast.error(
          `There's outstanding loan, book "${title}" cannot be deleted!`,
        );
      } else {
        // toast.error(error.res?.data?.message || "Failed to delete book data");
        toast.error(errorMessage || "Failed to delete book data");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("categoryId", categoryId);
    formData.append("publishedYear", pages);
    formData.append("description", description);
    if (coverImage) formData.append("cover", coverImage);
    onSubmit(formData);
  }
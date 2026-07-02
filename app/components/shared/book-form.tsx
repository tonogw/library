import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { InputGroup } from "../ui/input-group";
import { Label } from "radix-ui";
import { Button } from "../ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ChevronDown, UploadCloud } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toast } from "sonner";
// import { Toast } from "radix-ui";
import api from "~/lib/api/axios";

interface BookFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  isPending: boolean;
  categories: any[];
}

export function BookForm({
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
      const res = await api.delete(`/api/admin/books/${initialData.id}`);

      if (res.status === 200 || res.status === 204) {
        toast.success("Book data deleted successfully");
        setCoverImage(null);
        setPreviewUrl("");
      }
    } catch (error: any) {
      if (
        error.res?.status === 400 ||
        error.res?.data?.message?.toLowerCase().includes("outstanding")
      ) {
        toast.error(
          `There's outstanding loan, book "${title}" cannot be deleted!`,
        );
      } else {
        toast.error(error.res?.data?.message || "Failed to delete book data");
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
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col items-start gap-0.5">
        <label
          htmlFor="title"
          className="text-14 flex h-7 items-center font-bold text-[#0A0D12]"
        >
          Title
        </label>
        <Input
          id="title"
          required
          placeholder="Masukkan judul buku..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-14 h-12 w-full rounded-xl border border-[#D5D7DA] bg-white px-4 text-[#0A0D12]"
        />
      </div>

      <div className="flex w-full flex-col items-start gap-0.5">
        <label
          htmlFor="author"
          className="text-14 flex h-7 items-center font-bold text-[#0A0D12]"
        >
          Author
        </label>
        <Input
          id="author"
          required
          placeholder="Masukkan nama penulis..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="text-14 h-12 w-full rounded-xl border border-[#D5D7DA] bg-white px-4 text-[#0A0D12]"
        />
      </div>

      <div className="flex w-full flex-col items-start gap-0.5">
        <label
          htmlFor="category"
          className="text-14 flex h-7 items-center font-bold text-[#0A0D12]"
        >
          Category
        </label>
        <div className="relative w-full">
          <select
            id="category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="text-14 h-12 w-full cursor-pointer appearance-none rounded-xl border border-[#D5D7DA] bg-white px-4 font-quicksand font-medium text-[#0A0D12] focus:ring-1 focus:ring-gray-300 focus:outline-none"
          >
            <option value=" disabled">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <ChevronDown className="h-5 w-5 text-[#0A0D12]" />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-0.5">
        <label
          htmlFor="pages"
          className="text-14 flex h-7 items-center font-bold text-[#0A0D12]"
        >
          Number of Pages
        </label>
        <Input
          id="pages"
          type="number"
          required
          placeholder="Masukkan jumlah halaman..."
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          className="text-14 h-12 w-full rounded-xl border border-[#D5D7DA] bg-white px-4 text-[#0A0D12]"
        />
      </div>

      <div className="flex w-full flex-col items-start gap-0.5">
        <label
          htmlFor="description"
          className="text-14 flex h-7 items-center font-bold text-[#0A0D12]"
        >
          Description
        </label>
        <Textarea
          id="description"
          required
          placeholder="Masukkan deskripsi buku..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-14 min-h-[101px] w-full resize-none rounded-xl border border-[#D5D7DA] bg-white p-4 text-[#0A0D12]"
        />
      </div>

      <div className="flex w-full flex-col items-start gap-0.5">
        <span className="text-14 flex h-7 items-center font-bold text-[#0A0D12]">
          Cover Image
        </span>
        <label className="box-sizing flex h-[244px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D5D7DA] bg-white transition-colors hover:bg-gray-50/50">
          <Input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          {previewUrl ? (
            <div className="box-sizing flex h-full w-full flex-col items-center justify-center gap-4 p-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-16 rounded object-cover"
              />
              <div className="flex gap-2">
                <label htmlFor="book-cover-input" className="cursor-pointer">
                  <InputGroup className="h-10 w-33.5 justify-center gap-1">
                    <img src="/icons/icon-chg-img.svg" alt="change image" />
                    <span>Change Image</span>
                    <Input
                      hidden
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </InputGroup>
                </label>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {/* <InputGroup className="h-10 w-33.5 justify-center gap-1"> */}
                    <Button
                      variant="outline"

                      className="h-10 w-33.5 justify-center gap-1 rounded-lg text-[#EE1D52]"
                    >
                      {/* <InputGroup className="flex h-10 w-33.5 cursor-pointer items-center justify-center gap-2 bg-red-300 px-4 text-[#EE1D52] transition-colors hover:bg-red-50/30">
                      </InputGroup> */}
                      <img src="/icons/icon-trash-red.svg" alt="delete" />
                      <span className="text-14 font-bold">Delete Image</span>
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="flex w-113 flex-col gap-8 rounded-2xl border-0 bg-red-300 p-5">
                    <AlertDialogHeader className="m-0 flex flex-col gap-3 p-0 text-left">
                      <AlertDialogTitle className="text-18 m-0 font-quicksand leading-8 font-bold tracking-tight text-[#0A0D12]">
                        Delete Data
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-16 m-0 font-quicksand leading-7 font-semibold tracking-tight text-[#0A0D12]">
                        Once deleted, you won&apos;t be able to recover this
                        data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="m-0 flex flex-row items-center gap-4 p-0 sm:justify-start">
                      <AlertDialogCancel className="text-16 m-0 h-11 w-49.5 cursor-pointer rounded-full border border-[#D5D7DA] p-2 font-quicksand font-bold text-[#0A0D12] transition-colors hover:bg-gray-50">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteBook}
                        disabled={isDeleting}
                        className="text-16 m-0 h-11 w-49.5 cursor-pointer rounded-full border-0 bg-[#D9206E] p-2 font-quicksand font-bold text-[#FDFDFD] shadow-none transition-colors hover:bg-[#b51457] disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting.." : "confirm"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <label
              htmlFor="cover-file-upload"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2"
            >
              {/* <Input
                id="cover-file-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              /> */}

              {/* <div className="flex flex-col items-center gap-2"> */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D5D7DA] bg-white">
                <img src="/icons/icon-chg-img.svg" alt="change image" />
                {/* <UploadCloud className="h-5 w-5 text-[#0A0D12]" /> */}
              </div>
              <div className="text-14 text-center">
                <span className="font-bold text-[#1C65DA]">
                  Click to upload
                </span>{" "}
                or drag and drop
              </div>
            </label>
          )}
          <p className="text-14 m-0 font-semibold text-[#0A0D12]">
            PNG or JPG (max. 5mb)
          </p>
          {/* </div> */}
        </label>
      </div>

      <Button
        variant="default"
        type="submit"
        disabled={isPending}
        className="lg:w-132.25"
        // text-16 mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[#1C65DA] font-bold text-[#FDFDFD] hover:bg-[#154eb3] disabled:opacity-50
      >
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}

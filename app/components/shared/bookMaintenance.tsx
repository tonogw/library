import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";
import { Input } from "~/components/ui/input";
import { Button } from "../ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ArrowLeft, ChevronDown, UploadCloud } from "lucide-react";
import { toast } from "sonner";

export default function BookMaintenance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  // State Form internal
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pages, setPages] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // 1. Ambil Data Kategori untuk Dropdown Select
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/api/categories");
      return res.data?.data || [];
    },
  });
  const categories = categoriesData || [];

  // 2. Jika Edit Mode: Ambil Detail Buku Asli
  const { data: bookDetails } = useQuery({
    queryKey: ["adminBookDetail", id],
    queryFn: async () => {
      const res = await api.get(`/api/admin/books/${id}`);
      return res.data?.data;
    },
    enabled: isEditMode,
  });

  // Sinkronisasi data ketika masuk Edit Mode
  useEffect(() => {
    if (isEditMode && bookDetails) {
      setTitle(bookDetails.title || "");
      setAuthor(bookDetails.author?.name || bookDetails.author || "");
      setCategoryId(bookDetails.categoryId || "");
      setPages(String(bookDetails.publishedYear || ""));
      setDescription(bookDetails.description || "");
      setPreviewUrl(bookDetails.coverImage || "");
    }
  }, [isEditMode, bookDetails]);

  // 3. Mutasi Aksi Kirim Data (Add / Edit)
  const submitMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (isEditMode) {
        return await api.put(`/api/admin/books/${id}`, formData, {
          // headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        return await api.post("/api/admin/books", formData, {
          // toast.error(error.res?.data?.message),
          // headers: { "Content-Type": "multipart/form-data" },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBooks"] });
      navigate("/admin/books");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("categoryId", categoryId);
    formData.append("publishedYear", pages); // Menyesuaikan field database jumlah halaman Anda
    formData.append("description", description);
    if (coverImage) {
      formData.append("cover", coverImage);
    }

    submitMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen w-full bg-white pb-24 font-quicksand">
      <Navbar />

      {/* CENTER COMPONENT FORM HOLDER: Frame 1618873993 */}
      <main className="mx-auto mt-32 flex max-w-132.25 flex-col gap-6 px-4 md:px-0">
        {/* TOP TITLE HEADER BAR: Frame 1618873992 */}
        <div className="flex h-9 flex-row items-center gap-3">
          <Button
            variant="ghost"
            // type="button"
            onClick={() => navigate("/admin/books")}
            // className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#D5D7DA] transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5 text-[#1E1E1E]" />
          </Button>
          <h1 className="text-24 m-0 font-bold text-[#0A0D12]">
            {isEditMode ? "Edit Book" : "Add Book"}
          </h1>
        </div>

        {/* INPUT FIELD SYSTEM */}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
          {/* FIELD 1: Title */}
          <div className="flex w-full flex-col items-start gap-0.5">
            <label
              htmlFor="title"
              className="text-14 flex h-7 items-center font-bold text-[#0A0D12]"
            >
              Title
            </label>
            <Input
              id="title"
              type="text"
              required
              placeholder="Masukkan judul buku..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-14 h-12 w-full rounded-xl border border-[#D5D7DA] bg-white px-4 text-[#0A0D12] placeholder-gray-400 focus-visible:ring-gray-300"
            />
          </div>

          {/* FIELD 2: Author */}
          <div className="flex w-full flex-col items-start gap-0.5">
            <label
              htmlFor="author"
              className="text-14 flex h-7 items-center font-bold text-[#0A0D12]"
            >
              Author
            </label>
            <Input
              id="author"
              type="text"
              required
              placeholder="Masukkan nama penulis..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="text-14 h-12 w-full rounded-xl border border-[#D5D7DA] bg-white px-4 text-[#0A0D12] placeholder-gray-400 focus-visible:ring-gray-300"
            />
          </div>

          {/* FIELD 3: Category Select (Dropdown) */}
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
                <option value="" disabled className="text-gray-400">
                  Select Category
                </option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                {categories.length === 0 && (
                  <option value="1">Business & Economics</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <ChevronDown className="h-5 w-5 border-none text-[#0A0D12]" />
              </div>
            </div>
          </div>

          {/* FIELD 4: Number of Pages */}
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
              className="text-14 h-12 w-full rounded-xl border border-[#D5D7DA] bg-white px-4 text-[#0A0D12] placeholder-gray-400 focus-visible:ring-gray-300"
            />
          </div>

          {/* FIELD 5: Description (Textarea) */}
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
              className="text-14 min-h-25.25 w-full resize-none rounded-xl border border-[#D5D7DA] bg-white p-4 leading-relaxed text-[#0A0D12] placeholder-gray-400 focus-visible:ring-gray-300"
            />
          </div>

          {/* FIELD 6: Cover Image Dashed Upload Area */}
          <div className="flex w-full flex-col items-start gap-0.5">
            <span className="text-14 flex h-7 items-center font-bold text-[#0A0D12]">
              Cover Image
            </span>

            <label className="box-sizing flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D5D7DA] bg-white transition-colors hover:bg-gray-50/50">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {previewUrl ? (
                <div className="flex h-full w-full items-center justify-center gap-4 p-4">
                  <img
                    src={previewUrl}
                    alt="Preview Cover"
                    className="h-24 w-16 rounded object-cover shadow-xs"
                  />
                  <span className="text-14 font-bold text-[#1C65DA]">
                    Ubah Gambar
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D5D7DA] bg-white p-2">
                    <UploadCloud className="h-5 w-5 text-[#0A0D12]" />
                  </div>
                  <div className="text-14 text-center tracking-tight">
                    <span className="font-bold text-[#1C65DA]">
                      Click to upload
                    </span>
                    <span className="font-semibold text-[#0A0D12]">
                      {" "}
                      or drag and drop
                    </span>
                  </div>
                  <p className="text-14 m-0 font-semibold text-[#0A0D12]">
                    PNG or JPG (max. 5mb)
                  </p>
                </div>
              )}
            </label>
          </div>

          {/* MASTER SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="text-16 mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[#1C65DA] font-bold text-[#FDFDFD] transition-colors hover:bg-[#154eb3] disabled:opacity-50"
          >
            {submitMutation.isPending ? "Saving..." : "Save"}
          </button>
        </form>
      </main>
    </div>
  );
}

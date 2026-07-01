import { useState, useEffect } from 'react';
import { Input } from '~/components/ui/input';
import { Button } from '../ui/button';
import { Textarea } from '~/components/ui/textarea';
import { ChevronDown, UploadCloud } from 'lucide-react';

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
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pages, setPages] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAuthor(initialData.author?.name || initialData.author || '');
      setCategoryId(initialData.categoryId || '');
      setPages(String(initialData.publishedYear || ''));
      setDescription(initialData.description || '');
      setPreviewUrl(initialData.coverImage || '');
    }
  }, [initialData]);

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
    formData.append('title', title);
    formData.append('author', author);
    formData.append('categoryId', categoryId);
    formData.append('publishedYear', pages);
    formData.append('description', description);
    if (coverImage) formData.append('cover', coverImage);
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
        <label className="box-sizing flex h-[144px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D5D7DA] bg-white transition-colors hover:bg-gray-50/50">
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
                alt="Preview"
                className="h-24 w-16 rounded object-cover"
              />
              <span className="text-14 font-bold text-[#1C65DA]">
                Ubah Gambar
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D5D7DA] bg-white">
                <UploadCloud className="h-5 w-5 text-[#0A0D12]" />
              </div>
              <div className="text-14 text-center">
                <span className="font-bold text-[#1C65DA]">
                  Click to upload
                </span>{' '}
                or drag and drop
              </div>
              <p className="text-14 m-0 font-semibold text-[#0A0D12]">
                PNG or JPG (max. 5mb)
              </p>
            </div>
          )}
        </label>
      </div>

      <Button
        variant="default"
        type="submit"
        disabled={isPending}
        className="text-16 mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-[#1C65DA] font-bold text-[#FDFDFD] hover:bg-[#154eb3] disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}

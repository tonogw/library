import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "~/lib/api/axios";
import Navbar from "~/components/layout/navbar";
import { BookForm } from "~/components/shared/book-form"; // Mengimpor dari shared folder
import { ArrowLeft } from "lucide-react";

export default function BookMaintenance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/api/categories"); //.data?.data || [],
      return res.data?.data?.categories || res.data?.data || res.data || [];
    },
  });
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const { data: bookDetails } = useQuery({
    queryKey: ["adminBookDetail", id],
    queryFn: async () => {
      const res = await api.get(`/api/books/${id}`); //.data?.data,
      return res.data?.data || res.data;
    },
    enabled: !!id, // isEditMode,
  });

  const submitMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (isEditMode) return await api.put(`/api/admin/books/${id}`, formData);
      return await api.post("/api/admin/books", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBooks"] });
      navigate("/admin/books");
    },
  });

  return (
    <div className="min-h-screen w-full bg-white pb-24 font-quicksand">
      <Navbar />
      <main className="mx-auto mt-32 flex max-w-[529px] flex-col gap-6 px-4 md:px-0">
        <div className="flex h-9 flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/books")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#D5D7DA] hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5 text-[#1E1E1E]" />
          </button>
          <h1 className="text-24 m-0 font-bold text-[#0A0D12]">
            {isEditMode ? "Edit Book" : "Add Book"}
          </h1>
        </div>

        {/* Memanggil UI Form dari folder bersama */}
        <BookForm
          initialData={bookDetails}
          categories={categories} //|| []}
          isPending={submitMutation.isPending}
          onSubmit={(data) => submitMutation.mutate(data)}
        />
      </main>
    </div>
  );
}

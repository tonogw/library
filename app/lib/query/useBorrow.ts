import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "~/lib/api/axios";

export function useInstantBorrow(bookId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/api/borrows", {
        bookId: Number(bookId),
        durationDays: 3,
      });
      return res.data;
    },
    // Optimistic UI Update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["bookDetail", bookId] });
      const previousBookData = queryClient.getQueryData(["bookDetail", bookId]);

      queryClient.setQueryData(["bookDetail", bookId], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            availableCopies: Math.max(0, old.data.availableCopies - 1),
          },
        };
      });

      return { previousBookData };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousBookData) {
        queryClient.setQueryData(
          ["bookDetail", bookId],
          context.previousBookData,
        );
      }
      toast.error("Failed to borrow book.");
    },
    onSuccess: (resData) => {
      toast.success(resData?.message || "Book borrowed successfully!");
      queryClient.invalidateQueries({ queryKey: ["myLoansList"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookDetail", bookId] });
    },
  });
}

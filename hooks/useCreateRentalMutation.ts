import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { RentalPayload, RentalResponse } from "@/lib/api";

interface UseCreateRentalMutation {
  createNoteFn: (id: number, payload: RentalPayload) => Promise<RentalResponse>;
}

type CreateRentalMutationVariables = {
  id: number;
  payload: RentalPayload;
};

export const useCreateRentalMutation = ({ createNoteFn }: UseCreateRentalMutation) => {
  const queryClient = useQueryClient();

  const createRentalMutation = useMutation<
    RentalResponse,
    Error | AxiosError,
    CreateRentalMutationVariables
  >({
    mutationFn: ({ id, payload }) => createNoteFn(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error: Error | AxiosError) => {
      toast.error(
        error?.message || "An error occurred while creating the rental.",
      );
      console.error("Error creating rental:", error);
    },
  });

  const handleCreateRental = (id: number, payload: RentalPayload) => {
    createRentalMutation.mutate({ id, payload });
  };

  return { handleCreateRental, isLoading: createRentalMutation.isPending, isError: createRentalMutation.isError, data: createRentalMutation.data, error: createRentalMutation.error, isSuccess: createRentalMutation.isSuccess };
};
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateConsultationRequestStatus } from '@/features/secretary/api';
import type { UpdateConsultationRequestStatusPayload } from '@/features/secretary/api';

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateConsultationRequestStatusPayload & { id: string }) =>
      updateConsultationRequestStatus(id, payload),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['secretary', 'consultation-requests'] }),
  });
}

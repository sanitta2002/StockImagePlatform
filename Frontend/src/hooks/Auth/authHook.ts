import { useState } from 'react';
import { authService } from '../../services/authService';

export const useLogout = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (
    _: undefined,
    callbacks?: { onSuccess?: () => void; onError?: () => void }
  ) => {
    setIsPending(true);
    try {
      await authService.logout();
      callbacks?.onSuccess?.();
    } catch {
      callbacks?.onError?.();
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};
// NOTE: will be replaced with useMutation from @tanstack/react-query once package is installed

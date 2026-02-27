'use client';

import { useMutation } from '@tanstack/react-query';
import { affiliateForgotPasswordUseCase } from '../../di';

export function useAffiliateForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      affiliateForgotPasswordUseCase.execute(data),
  });
}

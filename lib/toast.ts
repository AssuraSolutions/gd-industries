import { toast as sonnerToast } from 'sonner'

const DEFAULT_DURATION = 3500

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: DEFAULT_DURATION,
    })
  },
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 4500,
    })
  },
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: DEFAULT_DURATION,
    })
  },
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
    })
  },
  loading: (message: string) => {
    return sonnerToast.loading(message, {
      duration: Infinity,
    })
  },
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    })
  },
  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId)
  },
}

import { toast as sonnerToast } from 'sonner'

export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 3000,
      style: {
        background: '#10b981',
        color: '#ffffff',
        border: '1px solid #059669',
      },
    })
  },
  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 4000,
      style: {
        background: '#ef4444',
        color: '#ffffff',
        border: '1px solid #dc2626',
      },
    })
  },
  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 3000,
      style: {
        background: '#3b82f6',
        color: '#ffffff',
        border: '1px solid #2563eb',
      },
    })
  },
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 3000,
      style: {
        background: '#f59e0b',
        color: '#ffffff',
        border: '1px solid #d97706',
      },
    })
  },
  loading: (message: string) => {
    return sonnerToast.loading(message, {
      style: {
        background: '#6366f1',
        color: '#ffffff',
        border: '1px solid #4f46e5',
      },
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

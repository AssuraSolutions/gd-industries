'use client'

import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      expand={true}
      richColors
      closeButton
      visibleToasts={4}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:bg-background/95 group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur supports-[backdrop-filter]:group-[.toaster]:bg-background/80',
          title: 'text-sm font-semibold tracking-tight',
          description: 'mt-1 text-sm text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:text-xs',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:text-xs',
          closeButton:
            'group-[.toast]:border-border group-[.toast]:bg-background group-[.toast]:text-muted-foreground group-[.toast]:hover:text-foreground',
          success:
            'group-[.toast]:border-emerald-500/30 group-[.toast]:bg-emerald-500/10 group-[.toast]:text-emerald-700',
          error:
            'group-[.toast]:border-rose-500/30 group-[.toast]:bg-rose-500/10 group-[.toast]:text-rose-700',
          warning:
            'group-[.toast]:border-amber-500/30 group-[.toast]:bg-amber-500/10 group-[.toast]:text-amber-700',
          info:
            'group-[.toast]:border-sky-500/30 group-[.toast]:bg-sky-500/10 group-[.toast]:text-sky-700',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }

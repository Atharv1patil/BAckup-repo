"use client"

import * as React from "react"

const TOAST_LIMIT = 3
const TOAST_GAP = 16

type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  cancel?: React.ReactNode
  duration?: number
  persistent?: boolean
  type?: "default" | "destructive"
}

let count = 0

const genId = () => `toast-${count++}`

type ToastActionElement = React.ReactElement<
  React.AnchorHTMLAttributes<HTMLAnchorElement> | React.ButtonHTMLAttributes<HTMLButtonElement>
>

type ToasterProps = {
  children: React.ReactNode
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "top-full"
    | "bottom-full"
  invert?: boolean
  closeButton?: boolean
  toastOptions?: Omit<Toast, "id">
}

type ToastContextProps = {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (toastId: string) => void
  remove: (toastId: string) => void
  update: (toastId: string, props: Omit<Toast, "id">) => void
}

const ToastContext = React.createContext<ToastContextProps>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
  remove: () => {},
  update: () => {},
})

function useToast() {
  return React.useContext(ToastContext)
}

export { ToastContext, useToast }

export type { ToastActionElement }


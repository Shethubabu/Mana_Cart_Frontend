/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_RAZORPAY_KEY_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface RazorpayPrefill {
  name?: string
  email?: string
  contact?: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description?: string
  image?: string
  prefill?: RazorpayPrefill
  notes?: Record<string, string>
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
  handler?: (response: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }) => void
}

interface RazorpayInstance {
  open: () => void
}

interface Window {
  Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
}

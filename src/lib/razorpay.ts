const RAZORPAY_SDK_URL = "https://checkout.razorpay.com/v1/checkout.js"

let razorpayScriptPromise: Promise<void> | null = null

export const loadRazorpaySdk = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay SDK can only load in the browser."))
  }

  if (window.Razorpay) {
    return Promise.resolve()
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise
  }

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SDK_URL}"]`
    )

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true })
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Razorpay SDK.")),
        { once: true }
      )
      return
    }

    const script = document.createElement("script")
    script.src = RAZORPAY_SDK_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK."))
    document.body.appendChild(script)
  }).catch((error) => {
    razorpayScriptPromise = null
    throw error
  })

  return razorpayScriptPromise
}

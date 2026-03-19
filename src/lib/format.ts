import type { Product } from "./types"

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value)
}

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value)

export const formatCompactDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value))

export const getProductImage = (product?: Partial<Product> | null) =>
  product?.images?.[0]?.url ||
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80"

export const getCategoryName = (product?: Partial<Product> | null) => {
  const category = product?.category as Product["category"] | string | undefined

  if (typeof category === "string" && category.trim()) {
    return category
  }

  if (
    category &&
    typeof category === "object" &&
    "name" in category &&
    typeof category.name === "string" &&
    category.name.trim()
  ) {
    return category.name
  }

  return "Uncategorized"
}

export const getDiscountedPrice = (product: Partial<Product>) => {
  const discount = product.discountPercentage || 0

  if (!product.price || discount <= 0) {
    return null
  }

  return Math.round(product.price / (1 - discount / 100))
}

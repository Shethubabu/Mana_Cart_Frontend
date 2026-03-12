export interface Category {
  id: number
  name: string
}

export interface ProductImage {
  id?: number
  url: string
}

export interface Review {
  id?: number
  rating: number
  comment: string
  reviewerName: string
  reviewerEmail?: string
  createdAt?: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage?: number | null
  rating?: number | null
  stock: number
  brand?: string | null
  featured?: boolean
  images: ProductImage[]
  reviews?: Review[]
  category?: Category
  createdAt?: string
}

export interface HomeData {
  featuredProducts: Product[]
  latestProducts: Product[]
  topRatedProducts: Product[]
  categories: Category[]
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

export interface CartItem {
  id: number
  quantity: number
  productId: number
  product: Product
}

export interface OrderItem {
  id: number
  quantity: number
  price: number
  productId: number
  product: Product
}

export interface Order {
  id: number
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

export interface User {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}

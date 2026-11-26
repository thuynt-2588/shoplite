// Product types

export type ProductId = number;

export interface Product {
  id: ProductId;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  images: string[];
  brand?: string;
  sku?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  reviews?: Review[];
}

// Product list types
export type ProductSummary = Pick<
  Product,
  "id" | "title" | "price" | "discountPercentage" | "thumbnail" | "category" | "rating" | "stock"
>;

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Cart types
export interface CartItem extends CartProductInput {
  quantity: number;
}

export type Cart = CartItem[];

export type CartProductInput = Pick<ProductSummary, "id" | "title" | "price" | "thumbnail" | "stock">;

// Sorting and fetch state
export type SortDir = "asc" | "desc";
export type SortDirection = SortDir;

export type LoadStatus = "loading" | "ready" | "error";

export type FetchState<T> = {
  status: "idle" | "loading" | "error" | "success";
  data?: T;
  error?: string;
};

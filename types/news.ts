export interface News {
  _id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsFormData {
  title: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishDate?: Date;
} 
export interface PortfolioLogo {
  _id: string;
  name: string;
  image: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioLogoFormData {
  name: string;
  image: string;
  category: string;
  isActive: boolean;
  order: number;
} 
export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  startingPrice: number;
  priceUnit: 'hr' | 'fixed' | 'diagnostic';
  popularTasks: string[];
  professionalCount: number;
  featured?: boolean;
}

export interface SubService {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  estimatedLaborHours: string;
  typicalCostRange: string;
}

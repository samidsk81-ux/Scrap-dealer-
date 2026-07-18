export interface ScrapItem {
  id: string;
  name: string;
  unit: 'kg' | 'unit';
  rate: number; // Price in INR per unit
  iconName: string;
  category: 'Metal' | 'Appliances' | 'E-Waste' | 'Machinery';
  description: string;
}

export interface CalculatedItem {
  scrapItemId: string;
  quantity: number; // kg or unit count
  estimatedValue: number;
}

export interface BookingRequest {
  id: string; // Dynamic booking reference e.g. SDB-2026-XXXX
  name: string;
  phone: string;
  address: string;
  area: string;
  date: string;
  timeSlot: string;
  items: {
    scrapItemId: string;
    name: string;
    quantity: number;
    rate: number;
    unit: 'kg' | 'unit';
    estimatedValue: number;
  }[];
  totalValue: number;
  status: 'Pending' | 'Confirmed' | 'Pickup Assigned' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    expenses: Expense[];
    password: string;  
    budget?: Budget;   
  }
  

export interface Expense {
    id: string;
    description: string;
    amount: number;
    date: string;  // ISO 8601 string formaat
    currency: string;
    paymentMethod: PaymentMethod;
    isIncoming: boolean;
    category: string;
    tags: string[];
    isPaid: boolean;
}

export interface PaymentMethod {
    method: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'PayPal';
    cardDetails?: CardDetails;
    bankAccountNumber?: string;
}

export interface CardDetails {
    cardNumber: string;  
    expiryDate: string; 
}

export interface Budget {
    monthlyLimit: number;
    notificationThreshold: number; 
    isActive: boolean;
}

export interface PaymentDetail {
    id: string;
    riderId: string;
    riderName: string;
    amount: number;
    date: string;
    settlementStatus: 'PENDING' | 'PAID' | 'CANCELLED';
    deliveryCount?: number;
    commissionRate?: number;
    bonusAmount?: number;
    deductions?: number;
    notes?: string;
    referenceNumber?: string;
    
  }
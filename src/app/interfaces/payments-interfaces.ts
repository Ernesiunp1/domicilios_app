
export interface RiderPayment {
        rider_id: number;
        rider_name: string;
        rider_phone: string;
        total_deliveries: number;
        total_amount: number;
        pending_amount: number;
      }
      
export interface PaymentDetail {
        payment_id: number;
        delivery_id: number;
        date: string;
        total_amount: number;
        rider_amount: number;
        settlement_status: string;
        payment_type: string;
      }





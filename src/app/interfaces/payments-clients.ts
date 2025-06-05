
export interface ClientPaymentDetail {
  id?: string | number;
  clientId?: string | number;
  client_id?: number;
  clientName?: string;
  client_name?: string;
  client_phone?: string;
  amount?: number;
  total_amount?: number;
  pending_amount?: number;
  date?: string;
  status?: 'PENDING' | 'PAID' | 'CANCELLED';
  deliveryCount?: number;
  total_deliveries?: number;
  isSelected?: boolean;
  saldo_neto?: number;
  client_settlement_status?: string;
  payment_ids_list?: number[];
  }
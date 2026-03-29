

export interface DeliveryData {
  client_id: number;
  rider_id: number;
  receptor_name: string;
  delivery_address: string;
  delivery_total_amount: number;
  created_at: string; // ISO date string
  id: number;
  package_name: string;
  receptor_number: number;
  state: string;
  delivery_comment: string;
  delivery_date: string; // ISO date string
  rider: Rider;
  payments: Payment[];
  client: Client;
}

export interface Rider {
  name: string;
  phone: string;
  is_active: boolean;
  plate: string;
  id: number;
}

export interface Payment {
  delivery_id: number;
  settlement_status: string;
  payment_status: string;
  total_amount: number;
  coop_amount: number;
  created_at: string; // ISO date string
  client_settlement_status: string;
  id: number;
  payment_type: string;
  payment_reference: string | null;
  rider_amount: number;
  comments: string;
  updated_at: string; // ISO date string
}

export interface Client {
  address: string;
  id: number;
  bank: string;
  is_active: boolean;
  phone: string;
  client_name: string;
  account_number: string;
  account_type: string;
}

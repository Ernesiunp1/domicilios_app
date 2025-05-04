export enum DeliveryStanding {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'Office',
  PAID = 'PAID',
  COURIER = 'COURIER'
}

export enum PaymentType {
  CASH = 'Cash',
  TRANSFER = 'Transfer'
}

export interface Delivery {
  items: Item[];
  total: number;
  page:  number;
  size:  number;
  pages: number;
}

export interface Item {
  id:                    number;
  package_name:          string;
  receptor_number:       number;
  state:                 string;
  delivery_total_amount: number;
  delivery_date:         Date | null;
  client_id:             number;
  rider_id:              number;
  receptor_name:         string;
  delivery_address:      string;
  created_at:            Date;
  rider:                 Rider;
  payments:              Payment[];
  client:                Client;
}

export interface Client {
  phone:       string;
  client_name: string;
  is_active:   boolean;
  id:          number;
  address:     string;
}

export interface Payment {
  id:                number;
  payment_type:      string;
  payment_reference: null;
  rider_amount:      number;
  comments:          null;
  updated_at:        Date;
  settlement_status: string;
  delivery_id:       number;
  payment_status:    string;
  total_amount:      number;
  coop_amount:       number;
  created_at:        Date;
}

export interface Rider {
  plate:     string;
  id:        number;
  name:      string;
  phone:     string;
  is_active: boolean;
}


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


export enum SettlementStatus {

        PENDING = "PENDING",
        CLEARED = "CLEARED",
        SETTLED = "SETTLED",
        TRANSFER_TO_OFFICE = "TRANSFER_TO_OFFICE",
        TRANFERRED_TO_CLIENT =  "TRANSFERRED_TO_CLIENT"

}

export enum ClientSettlementStatus {
        PENDING = "PENDING",
        SETTLED = "SETTLED",
}

export enum PaymentStatus {
    COURIER = "COURIER",
    OFFICE = "OFFICE",
    OFFICE_RECIEVED_TRANSFER = "OFFICE_RECIEVED_TRANSFER",
    CLIENT_RECIEVED_TRANSFER = "CLIENT_RECEIVED_TRANSFER",
    CLIENT = "CLIENT",
}
      





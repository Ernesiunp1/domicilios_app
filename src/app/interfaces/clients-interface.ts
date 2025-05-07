
export enum TypeAccount {
  AHORRO = 'AHORRO',
  CORRIENTE = 'CORRIENTE',
}


export interface ClientsInterface {
  id: number;
  client_name: string;
  phone: string;
  address: string;
  is_active: boolean;
  bank: string,
  account: string ,
  type_account: TypeAccount,
}



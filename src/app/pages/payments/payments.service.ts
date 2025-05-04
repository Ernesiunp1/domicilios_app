import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map, Observable, firstValueFrom } from 'rxjs';
import { PaymentDetail, RiderPayment } from 'src/app/interfaces/payments-interfaces';
import { ClientPaymentDetail } from 'src/app/interfaces/payments-clients';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private apiUrl = 'http://localhost:8000';
 
   constructor(private http: HttpClient) { }
 
 
   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  loadsDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payments/dashboard`).pipe(
      map((response: any) => {

        console.log('Response from dashboard:', response);
        
        
        return {
          pendingRiderPayments: response.pendingRiderPayments || 0,
          pendingRiderAmount: response.pendingRiderAmount || 0,
          pendingClientPayments: response.pendingClientPayments || 0,
          pendingClientAmount: response.pendingClientAmount || 0,
          totalTransactions: response.totalTransactions || 0,
          totalAmount: response.totalAmount || 0
        };

      }));
  }


  async getRidesDataPayments(filterStatus?: string, dateRange?: string): Promise<RiderPayment[]> {

    let url = 'http://localhost:8000/payments/riders-payments';
    const params: any = {};

    if (filterStatus && filterStatus !== 'ALL') {
      params.settlement_status = filterStatus;
    }

    if (dateRange) {
      const dates = dateRange.split(',');
      if (dates.length === 2) {
        params.start_date = dates[0];
        params.end_date = dates[1];
      }
    }

    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      for (const key in params) {
        queryParams.set(key, params[key]);
      }
      url += `?${queryParams.toString()}`;
    }

    return await firstValueFrom(this.http.get<RiderPayment[]>(url));

  }




/////////////////////////////////////////////////////////


   // Método para obtener pagos de domiciliarios
   async getRiderPayments(riderId: string, filterStatus?: string): Promise<PaymentDetail[]> {
    try {
      let url = `http://localhost:8000/payments/riders-payments/${riderId}`;
      if (filterStatus && filterStatus !== 'ALL') {
        url += `?settlement_status=${filterStatus}`;
      }
      
      const response = await this.http.get<PaymentDetail[]>(url).toPromise();
      return response ?? [];
    } catch (error) {
      console.error('Error al obtener pagos de domiciliarios:', error);
      throw error;
    }
  }

  // Método para obtener pagos de clientes
  async getClientPayments(filterStatus?: string): Promise<ClientPaymentDetail[]> {
    try {
      let url = `http://localhost:8000/payments/clients-payments`;
      if (filterStatus && filterStatus !== 'ALL') {
        url += `?status=${filterStatus}`;
      }
      
      const response = await this.http.get<ClientPaymentDetail[]>(url).toPromise();
      return response ?? [];
    } catch (error) {
      console.error('Error al obtener pagos de clientes:', error);
      throw error;
    }
  }
  
  // Método para procesar pagos de clientes seleccionados
  async processClientPayments(paymentIds: string[]): Promise<any> {
    try {
      const url = `http://localhost:8000/payments/process-client-payments`;
      const response = await this.http.post(url, { paymentIds }).toPromise();
      return response;
    } catch (error) {
      console.error('Error al procesar pagos de clientes:', error);
      throw error;
    }
  }
  
  // Método para procesar pagos de domiciliarios seleccionados
  async processRiderPayments(paymentIds: string[]): Promise<any> {
    try {
      const url = `http://localhost:8000/payments/process-rider-payments`;
      const response = await this.http.post(url, { paymentIds }).toPromise();
      return response;
    } catch (error) {
      console.error('Error al procesar pagos de domiciliarios:', error);
      throw error;
    }
  }






}

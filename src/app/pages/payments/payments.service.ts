import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map, Observable, firstValueFrom } from 'rxjs';
import { ClientSettlementStatus, PaymentDetail, RiderPayment, SettlementStatus } from 'src/app/interfaces/payments-interfaces';
import { ClientPaymentDetail } from 'src/app/interfaces/payments-clients';
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // CONSULTA LOS DATOS PARA RELLENAR LAS TARJETAS DEL DASHBOARD
  loadsDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payments/dashboard`).pipe(
      map((response: any) => {
        console.log('Response from SERVICIO:', response);

        return {
          // pagos de domiciliarios
          pendingDomisToPayToRiderCount: response.to_pay_rider_count || 0, // cantidad de domicilios pendientes para pagar al domiciliario
          pendingToPaytoRiderTotal: response.to_pay_rider_total || 0, //  monto total a pagar al docimiliario por domicilios entregados
          pendindForRiderfromOffice: response.pending_to_rider_from_office || 0,
          pendindForRiderfromClient: response.pending_to_rider_from_client || 0,
          pendingRiderPayments: response.pendingRiderPayments || 0, // cantidad de pagos pendientes del domiciliario a la empresa
          pendingRiderAmount: response.pendingRiderAmount || 0, // monto total de los pagos pendientes por el domiciliario

          //  pagos de clientes
          pendingClientPayments: response.pendingClientPayments || 0, // cantidad pagos pendientes por el cliente a la empresa
          pendingClientAmount: response.pendingClientAmount || 0, // monto total de pagos pendientes po el cliente a la empresa

          pendingOfficeToClient: response.pendingOfficeToClient || 0, // cantidad de pagos pendientes por la oficina al cliente
          pendingOfficeToClientAmount:
            response.pendingOfficeToClientAmount || 0, // monto de los pagos pendientes de la officina al cliente
          //pagos en general
          totalTransactions: response.totalTransactions || 0,
          totalAmount: response.totalAmount || 0,
        };
      })
    );
  }

  async getRidesDataPayments(
    filterStatus?: string | string[],
    dateRange?: string
  ): Promise<RiderPayment[]> {
    let url = `${this.apiUrl}/payments/riders-payments`;
    const queryParams = new URLSearchParams();

    if (Array.isArray(filterStatus)) {
      for (const status of filterStatus) {
        if (status) queryParams.append('settlement_status', status);
      }
    } else if (typeof filterStatus === 'string') {
      queryParams.set('settlement_status', filterStatus);
    }

    if (dateRange) {
      const dates = dateRange.split(',');
      if (dates.length === 2) {
        queryParams.set('start_date', dates[0]);
        queryParams.set('end_date', dates[1]);
      }
    }

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const respuesta_de_pagos = await firstValueFrom(
      this.http.get<RiderPayment[]>(url)
    );
    console.log('respuesta de getRidesDataPayments', respuesta_de_pagos);

    return respuesta_de_pagos;
  }

  /////////////////////////////////////////////////////////

  // Método para obtener pagos de domiciliarios
  async getRiderPayments(
    riderId: string,
    filterStatus?: string | string[]
  ): Promise<PaymentDetail[]> {
    try {
      let url = `${this.apiUrl}/payments/riders-payments/${riderId}`;
      const queryParams = new URLSearchParams();

      if (Array.isArray(filterStatus)) {
        for (const status of filterStatus) {
          if (status) queryParams.append('settlement_status', status);
        }
      } else if (typeof filterStatus === 'string') {
        queryParams.set('settlement_status', filterStatus);
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await this.http.get<PaymentDetail[]>(url).toPromise();
      console.log('PAGOS DE DOMICILIARIOS', response);

      return response ?? [];
    } catch (error) {
      console.error('Error al obtener pagos de domiciliarios:', error);
      throw error;
    }
  }

  // Método para obtener pagos de clientes
  async getClientPayments(
    filterStatus?: string
  ): Promise<ClientPaymentDetail[]> {
    try {
      let url = `${this.apiUrl}/payments/clients-payments`;
      if (filterStatus && filterStatus !== 'ALL') {
        url += `?status=${filterStatus}`;
      }

      const response = await this.http
        .get<ClientPaymentDetail[]>(url)
        .toPromise();
      return response ?? [];
    } catch (error) {
      console.error('Error al obtener pagos de clientes:', error);
      throw error;
    }
  }

  // Método para procesar pagos de clientes seleccionados
  async processClientPayments(
    clients_ids: any,
    paymentIds: number[]
  ): Promise<any> {
    let client_settlement_status = 'SETTLED';

    if (clients_ids.length == 1) {
      clients_ids = clients_ids[0];
    }

    console.log(
      'IDs de pagos a procesar:',
      clients_ids,
      'paymentIds:',
      paymentIds
    );

    try {
      const url = `${this.apiUrl}/payments/client_settled/${clients_ids}?client_settlement_status=${client_settlement_status}`;

      const response = await this.http
        .put(url, { payments_id: paymentIds })
        .toPromise();

      return response;
    } catch (error) {
      console.error('Error al procesar pagos de clientes:', error);
      throw error;
    }
  }

  // Método para procesar pagos de domiciliarios seleccionados
  async processRiderPayments(paymentIds: string[]): Promise<any> {
    try {
      const url = `${this.apiUrl}/payments/process-rider-payments`;
      const response = await this.http.post(url, { paymentIds }).toPromise();
      return response;
    } catch (error) {
      console.error('Error al procesar pagos de domiciliarios:', error);
      throw error;
    }
  }

  updatePaymentStatus(payment_id: number, payload: any) {
    console.log('payload desde updateservice', payload);

    return this.http.patch(
      `${this.apiUrl}/payments/${payment_id}`,
      payload
    );
  }
}

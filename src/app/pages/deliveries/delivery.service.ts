import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, forkJoin, of } from 'rxjs';

import { Delivery, DeliveryStanding, Item} from '../../interfaces/deliveries';
import { RidersInterface } from "../../interfaces/riders-interface";
import { ClientsInterface } from "../../interfaces/clients-interface";

@Injectable({
  providedIn: 'root'
})


export class DeliveryService {
 
 
  private apiUrl = 'http://localhost:8000';
  
  private deliveriesCache: Delivery[] = [];

  constructor(private http: HttpClient) { }

  // getAllDeliveries(): Observable<Delivery[]> {
  //   // Obtenemos todos los domicilios de todos los estados
  //   return forkJoin([
  //     this.http.get<Delivery[]>(`${this.apiUrl}/deliveries/get_deliveries_by_status?delivery_status=PENDING`).pipe(
  //       map(deliveries => deliveries || [])
  //     ),
  //     this.http.get<Delivery[]>(`${this.apiUrl}/deliveries/get_deliveries_by_status?delivery_status=ASSIGNED`).pipe(
  //       map(deliveries => deliveries || [])
  //     ),
  //     this.http.get<Delivery[]>(`${this.apiUrl}/deliveries/get_deliveries_by_status?delivery_status=IN_PROGRESS`).pipe(
  //       map(deliveries => deliveries || [])
  //     ),
  //     this.http.get<Delivery[]>(`${this.apiUrl}/deliveries/get_deliveries_by_status?delivery_status=DELIVERED`).pipe(
  //       map(deliveries => deliveries || [])
  //     ),
  //     this.http.get<Delivery[]>(`${this.apiUrl}/deliveries/get_deliveries_by_status?delivery_status=CANCELLED`).pipe(
  //       map(deliveries => deliveries || [])
  //     )
  //   ]).pipe(
  //     map(allDeliveries => {
  //       console.log('allDeliveries', allDeliveries);
        
  //       // Flatten the array of arrays into a single array
  //       const flattened = allDeliveries.reduce((acc, val) => acc.concat(val), []);
        
  //       // Sort by created_at date (newest first)
  //       const sorted = flattened.sort((a, b) => {
  //         return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  //       });
        
  //       this.deliveriesCache = sorted;
  //       return sorted;
  //     })
  //   );
  // }

  // getDeliveriesByStatus(status: DeliveryStanding): Observable<Delivery[]> {
  //   return this.http.get<Delivery[]>(`${this.apiUrl}/deliveries/get_deliveries_by_status?delivery_status=${status}`).pipe(
  //     map(deliveries => {
  //       if (deliveries) {
  //         return deliveries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  //       }
  //       return [];
  //     })
  //   );
  // }

  // // Método para obtener domicilios con paginación y filtrado (implementado en el front)
  // getDeliveriesPaginated(page: number = 1, pageSize: number = 20, status?: DeliveryStanding): Observable<{
  //   items: Delivery[];
  //   total: number;
  //   page: number;
  //   pageSize: number;
  //   totalPages: number;
  // }> {
  //   // Si hay un estado específico, obtenemos solo esos domicilios
  //   if (status) {
  //     return this.getDeliveriesByStatus(status).pipe(
  //       map(deliveries => {
  //         const start = (page - 1) * pageSize;
  //         const end = start + pageSize;
  //         const paginatedItems = deliveries.slice(start, end);
  //         const totalPages = Math.ceil(deliveries.length / pageSize);
          
  //         return {
  //           items: paginatedItems,
  //           total: deliveries.length,
  //           page,
  //           pageSize,
  //           totalPages
  //         };
  //       })
  //     );
  //   }
    
  //   // Si no hay estado o es "TODOS", obtenemos todos los domicilios
  //   return this.getAllDeliveries().pipe(
  //     map(deliveries => {
  //       const start = (page - 1) * pageSize;
  //       const end = start + pageSize;
  //       const paginatedItems = deliveries.slice(start, end);
  //       const totalPages = Math.ceil(deliveries.length / pageSize);
        
  //       return {
  //         items: paginatedItems,
  //         total: deliveries.length,
  //         page,
  //         pageSize,
  //         totalPages
  //       };
  //     })
  //   );
  // }

  // getDeliveryStates(): Observable<string[]> {
  //   // Como no hay endpoint para esto, devolvemos los valores del enum
  //   return of(Object.values(DeliveryStanding));
  // }
  


  getAllD(page: number = 1, size: number = 20, state?: DeliveryStanding | null) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (state) {
      params = params.set('state', state);
    }
    
    return this.http.get<{
      items: Item[], 
      total: number, 
      page: number, 
      size: number, 
      pages: number
    }>(`${this.apiUrl}/deliveries`, { params });
  }


  addRiderToDelivery(riderId: number, deliveryId: number): Observable<Delivery> {
    return this.http.put<Delivery>(
      `${this.apiUrl}/deliveries/add_rider?rider_id=${riderId}&delivery_id=${deliveryId}`, 
      {}
    );
  }
  

  updateDelivery(deliveryId: number, deliveryData: any): Observable<Delivery> {
    return this.http.put<Delivery>(
      `${this.apiUrl}/deliveries/update?delivery_id=${deliveryId}`, deliveryData
    );
  }
 

  createNewDelivery(deliveryData: any): Observable<Delivery> {
    
    if (deliveryData.rider_id === '') {
      deliveryData.rider_id = null; // Asignar null si el rider_id está vacío
      
    }
    
    return this.http.post<Delivery>(
      `${this.apiUrl}/deliveries/new_delivery?client=${deliveryData.client_id}&total_amount=${deliveryData.delivery_total_amount}&rider=${deliveryData.rider_id}`, deliveryData)
  }
  

  getIdsRiders(): Observable<RidersInterface[]> {
    return this.http.get<RidersInterface[]>(`${this.apiUrl}/rider/get_riders`).pipe(
      map((response: any) => {        
        return response;
      })
    );
  }


  getRiderNameByDeliveryId(delivery_id: number): Observable<string> {
    return this.http.get<any>(`${this.apiUrl}/rider/get_by_delivery_id?delivery_id=${delivery_id}`).pipe(
      map((response: any) => {
        const rider = response;
        return rider;
      })
    );
  }


  deliveriesFiltered(
    time_period: string | null, 
    start_date: string | null, 
    end_date: string | null, 
    state: DeliveryStanding | null
  ): Observable<any> {
    
    const baseUrl = 'http://localhost:8000/deliveries/filtered';
    let params = new HttpParams()
      .set('page', '1')
      .set('size', '20');
    
    if (time_period) {
      params = params.set('time_period', time_period);
    }
    
    if (state) {
      params = params.set('state', state);
    }
    
    if (time_period === 'custom') {
      if (start_date) {
        params = params.set('start_date', start_date);
      }
      if (end_date) {
        params = params.set('end_date', end_date);
      }
    }
    
    return this.http.get<any>(baseUrl, { params }).pipe(
      map(response => response)
    );
  }


}
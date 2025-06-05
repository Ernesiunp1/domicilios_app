import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DeliveriesResponse } from './home.page'
import { Delivery } from 'src/app/interfaces/deliveries';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }



    getDeliveriesToday():Observable<DeliveriesResponse> {
      return this.http.get<DeliveriesResponse>(`${this.apiUrl}/deliveries/filtered?time_period=today&page=1&size=20`)
    };
    getActiveRiders(): Observable<any> {
      return this.http.get(`${this.apiUrl}/rider/?page=1&size=100&is_active=true`)
    };

    getPendingPayments(){
      return 'hola'
    };
    getUpcomingDeliveries():Observable<any>{
      return this.http.get(`${this.apiUrl}/deliveries/filtered?time_period=today&page=1&size=20`)
    };





}

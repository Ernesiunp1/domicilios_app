import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RidersService {

 private apiUrl = 'http://localhost:8000';
 
   constructor(private http: HttpClient) { }
 
 
   private getAuthHeaders(): HttpHeaders {
     const token = localStorage.getItem('auth_token');
     return new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
   }



    getRiders():Observable<any> {
      return this.http.get <any> (`${this.apiUrl}/rider/`)
    }


   
}

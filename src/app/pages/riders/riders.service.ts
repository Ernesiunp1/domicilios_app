import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RidersService {

 private apiUrl = environment.apiUrl;
 
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

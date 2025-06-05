// src/app/services/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientsInterface } from '../../interfaces/clients-interface';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllClients(): Observable<ClientsInterface[]> {
    return this.http.get<ClientsInterface[]>(`${this.apiUrl}/client/get_all`);
  }

  getClientByName(client_name: any){
    return this.http.get<ClientsInterface[]>(`${this.apiUrl}/client/by_name?name=${client_name}`);
  }


  clearClient(client_id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/client/delete?client_id=${client_id}` );
  }


  createClient(clientData:ClientsInterface ) {
    console.log("cliente desde el servicio" , clientData);
    
    return this.http.post(`${this.apiUrl}/client/create_client`, clientData);
  }

  updateClient(id: number, data: any): Observable<any> {    
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/client/update?client_id=${id}`, data, { headers });
  }
 
}
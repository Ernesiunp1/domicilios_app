import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { tap } from 'rxjs/operators';

import { BehaviorSubject, Observable, map } from 'rxjs';

import { ClientsInterface } from "../interfaces/clients-interface";
import { environment } from '../../environments/environment'; 


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null; 
  private apiUrl = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'))

  public isAuthenticated$: Observable<boolean> = this.tokenSubject.pipe(
    map(token => !!token)
  
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage,
    
  ) {
    // Elimina this.storage.create(); de aquí
  }
 


  login(username: string, password: string): Observable<any> {
    // FastAPI espera los datos en formato form-data para OAuth2
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<any>(`${this.apiUrl}/token`, formData).pipe(
      tap(response => {
        if (response && response.access_token) {
          this.storeToken(response.access_token);
        }
      })
    );
  }

  storeToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  logout(): any {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }




////////////////////////////////////////////// separacion de funciones
  createClient(clientData: ClientsInterface) {  
    console.log("cliente desde el auth service", clientData);
     
    return this.http.post(`${this.apiUrl}/client/create_client`, clientData);
  }


  createRider(riderData: { name: string; phone: string; plate: string }) {
    return this.http.post(`${this.apiUrl}/rider/newbiker`, riderData);
  }

   // Registro
   register(userData: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/user/register`, userData);
  }
  

  isAuthenticated(): boolean {
    const token = this.tokenSubject.value;
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (e) {
      return true; // Si el token está mal formado, lo consideramos vencido
    }
  }

  
}
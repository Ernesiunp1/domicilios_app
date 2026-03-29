// rider-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { IonButton, IonHeader, IonToolbar, IonButtons, IonBackButton, IonSpinner, IonTitle,
 IonLabel, IonRow, IonCol, IonContent, IonText, IonItem,  IonBadge,  IonIcon, IonList,
IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, 
IonItemSliding, IonItemOption, IonItemOptions, 
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-rider-details',
  templateUrl: './rider-details.component.html',
  styleUrls: ['./rider-details.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, IonHeader, IonButton, CommonModule, IonToolbar, IonButtons, IonBackButton, 
             IonItem,  IonBadge,  IonList, IonTitle, IonSpinner, IonText, IonLabel, IonRow, IonCol, IonIcon, IonContent, 
            IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, IonItemSliding, IonItemOption,
            IonItemOptions]
})
export class RiderDetailsComponent implements OnInit {
  riderId: number;
  riderDetails: any = null;
  isLoading = true;
  error: string | null = null;
  apiUrl = environment.apiUrl

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.riderId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    console.log('PaymentsDomiComponent - ngOnInit iniciado');
    console.log('Environment:', environment);
    // console.log('PaymentService:', this.paymentService);
    this.fetchRiderDetails();
  }

  fetchRiderDetails() {
    this.isLoading = true;
    this.http.get(`${this.apiUrl}/rider/${this.riderId}`)  
    
      .subscribe({
        next: (response: any) => {
          this.riderDetails = response;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching rider details:', error);
          this.error = 'No se pudo cargar la información del domiciliario';
          this.isLoading = false;
        }
      });
  }

  // Helper to format date
  formatDate(date: string) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  getStateColor(state: string) {
    switch (state) {
      case 'PENDING': return 'warning';
      case 'IN_PROGRESS': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'medium';
    }
  }

  getPaymentStatusColor(status: string) {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'PAID': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'medium';
    }
  }
}
// payment-summary.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonItem, 
  IonLabel, IonDatetime, IonButton, IonIcon, IonSpinner, IonChip,
  IonSegment, IonSegmentButton, IonList, IonRefresher, IonRefresherContent,
  IonProgressBar, IonBadge
} from '@ionic/angular/standalone';
import { 
  cashOutline, cardOutline, statsChartOutline, peopleOutline,
  calendarOutline, refreshOutline, downloadOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment";

interface PaymentSummary {
  period: {
    start_date: string;
    end_date: string;
  };
  totals: {
    count: number;
    total_amount: number;
    rider_amount: number;
    coop_amount: number;
  };
  by_status: { [key: string]: { count: number; amount: number } };
  by_type: { [key: string]: { count: number; amount: number } };
}

interface DashboardSummary {
  to_pay_rider_total: number;
  to_pay_rider_count: number;
  pending_to_rider_from_office: number;
  pending_to_rider_from_client: number;
  pendingRiderPayments: number;
  pendingRiderAmount: number;
  pendingClientPayments: number;
  pendingClientAmount: number;
  pendingOfficeToClient: number;
  pendingOfficeToClientAmount: number;
  totalTransactions: number;
  totalAmount: number;
}

@Component({
  selector: 'app-payment-sumary',
  templateUrl: './payment-sumary.component.html',
  styleUrls: ['./payment-sumary.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow,
    IonCol, IonItem, IonLabel, IonDatetime, IonButton, IonIcon, IonSpinner,
    IonChip, IonSegment, IonSegmentButton, IonList, IonRefresher, 
    IonRefresherContent, IonProgressBar, IonBadge
  ]
})
export class PaymentSumaryComponent  implements OnInit {

  paymentSummary: PaymentSummary | null = null;
  dashboardSummary: DashboardSummary | null = null;
  isLoading = true;
  selectedSegment = 'overview';
  
  // Filtros de fecha
  startDate: string = '';
  endDate: string = '';
  
  // Configuración de colores para estados
  statusColors: { [key: string]: string } = {
    'PENDING': 'warning',
    'COURIER': 'primary',
    'CLIENT': 'secondary',
    'OFFICE': 'success',
    'RECEIVED': 'success',
    'CLIENT_RECIEVED_TRANSFER': 'medium',
    'OFFICE_RECIEVED_TRANSFER': 'medium'
  };

  // Configuración de colores para tipos
  typeColors: { [key: string]: string } = {
    'CASH': 'success',
    'TRANSFER': 'primary',
    'CARD': 'secondary'
  };

  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {
    addIcons({ 
      cashOutline, cardOutline, statsChartOutline, peopleOutline,
      calendarOutline, refreshOutline, downloadOutline 
    });
    
    // Establecer fechas por defecto (mes actual)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.startDate = firstDay.toISOString();
    this.endDate = lastDay.toISOString();
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    try {
      await Promise.all([
        this.loadPaymentSummary(),
        this.loadDashboardSummary()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadPaymentSummary() {
    const params = new URLSearchParams();
    if (this.startDate) params.append('start_date', this.startDate);
    if (this.endDate) params.append('end_date', this.endDate);
    
    const url = `${this.apiUrl}/payments/summary?${params.toString()}`;
    
    try {
      this.paymentSummary = await this.http.get<PaymentSummary>(url).toPromise() || null;
    } catch (error) {
      console.error('Error loading payment summary:', error);
    }
  }

  private async loadDashboardSummary() {
    try {
      this.dashboardSummary = await this.http.get<DashboardSummary>(`${this.apiUrl}/payments/dashboard`).toPromise() || null;
    } catch (error) {
      console.error('Error loading dashboard summary:', error);
    }
  }

  onDateChange() {
    this.loadPaymentSummary();
  }

  async refreshData(event?: any) {
    await this.loadData();
    if (event) {
      event.target.complete();
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'PENDING': 'Pendiente',
      'COURIER': 'Domiciliario',
      'CLIENT': 'Cliente',
      'OFFICE': 'Oficina',
      'RECEIVED': 'Recibido',
      'CLIENT_RECIEVED_TRANSFER': 'Cliente Recibió',
      'OFFICE_RECIEVED_TRANSFER': 'Oficina Recibió'
    };
    return labels[status] || status;
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'CASH': 'Efectivo',
      'TRANSFER': 'Transferencia',
      'CARD': 'Tarjeta'
    };
    return labels[type] || type;
  }

  exportData() {
    // Implementar exportación de datos
    console.log('Exportar datos del resumen');
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  calculatePercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }

}

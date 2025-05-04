// payments-domi.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';


import { Observable } from 'rxjs';
import { SettlementModalComponent } from '../settlement-modal/settlement-modal.component';
import { PaymentsService } from 'src/app/pages/payments/payments.service';

interface RiderPayment {
  rider_id: number;
  rider_name: string;
  rider_phone: string;
  total_deliveries: number;
  total_amount: number;
  pending_amount: number;
}

interface PaymentDetail {
  payment_id: number;
  delivery_id: number;
  date: string;
  total_amount: number;
  rider_amount: number;
  settlement_status: string;
  payment_type: string;
}

@Component({
  selector: 'app-payments-domi',
  templateUrl: './payment-domi.component.html',
  styleUrls: ['./payment-domi.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, SettlementModalComponent],
  providers: [DatePipe],  
  
})

export class PaymentsDomiComponent implements OnInit {
  ridersData: RiderPayment[] | undefined = [];
  selectedRider: RiderPayment | null = null;
  // paymentDetails: any[] | undefined = [];
  paymentDetails: (PaymentDetail & { isSelected?: boolean })[] | any[] = [];
  // paymentDetails: PaymentDetail[] = []

  loading = false;
  detailsLoading = false;
  filterStatus: string = 'PENDING';
  dateRange: string | undefined = undefined;
  
  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private datePipe: DatePipe,
    private paymentService: PaymentsService,
  ) {}
  
  ngOnInit() {
    this.fetchRidersData();
  }
  
  // // Cargar datos de los domiciliarios
  // async fetchRidersData() {
  //   const loading = await this.loadingCtrl.create({
  //     message: 'Cargando domiciliarios...',
  //     spinner: 'circles'
  //   });
  //   await loading.present();
    
  //   try {
  //     let url = 'http://localhost:8000/payments/riders-payments';
  //     const params: any = {};
      
  //     if (this.filterStatus && this.filterStatus !== 'ALL') {
  //       params.settlement_status = this.filterStatus;
  //     }
      
  //     if (this.dateRange) {
  //       const dates = this.dateRange.split(',');
  //       if (dates.length === 2) {
  //         params.start_date = dates[0];
  //         params.end_date = dates[1];
  //       }
  //     }
      
  //     // Agregar parámetros a la URL
  //     if (Object.keys(params).length > 0) {
  //       const queryParams = new URLSearchParams();
  //       for (const key in params) {
  //         queryParams.set(key, params[key]);
  //       }
  //       url += `?${queryParams.toString()}`;
  //     }
      
  //     this.ridersData = await this.http.get<RiderPayment[]>(url).toPromise();
      
  //     // Limpiar selección si ya no existe
  //     if (this.selectedRider) {
  //       const stillExists = this.ridersData!.some(r => r.rider_id === this.selectedRider?.rider_id);
  //       if (!stillExists) {
  //         this.selectedRider = null;
  //         this.paymentDetails = [];
  //       } else {
  //         // Actualizar datos del rider seleccionado
  //         this.selectedRider = this.ridersData!.find(r => r.rider_id === this.selectedRider?.rider_id) || null;
  //         await this.fetchRiderDetails(this.selectedRider!.rider_id);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error al cargar datos de domiciliarios:', error);
  //     this.presentToast('No se pudieron cargar los datos de domiciliarios', 'danger');
  //   } finally {
  //     loading.dismiss();
  //   }
  // }


  async fetchRidersData() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando domiciliarios...',
      spinner: 'circles'
    });
    await loading.present();
  
    try {
      this.ridersData = await this.paymentService.getRidesDataPayments(this.filterStatus, this.dateRange);
  
      if (this.selectedRider) {
        const stillExists = this.ridersData!.some(r => r.rider_id === this.selectedRider?.rider_id);
        if (!stillExists) {
          this.selectedRider = null;
          this.paymentDetails = [];
        } else {
          this.selectedRider = this.ridersData!.find(r => r.rider_id === this.selectedRider?.rider_id) || null;
          await this.fetchRiderDetails(this.selectedRider!.rider_id);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos de domiciliarios:', error);
      this.presentToast('No se pudieron cargar los datos de domiciliarios', 'danger');
    } finally {
      loading.dismiss();
    }
  }
  
  // Cargar detalles de pagos de un domiciliario específico
  async fetchRiderDetails(riderId: number) {
    this.detailsLoading = true;
    
    try {
      let url = `http://localhost:8000/payments/riders-payments/${riderId}`;
      if (this.filterStatus && this.filterStatus !== 'ALL') {
        url += `?settlement_status=${this.filterStatus}`;
      }
      
      const response = await this.http.get<any[]>(url).toPromise();
      
      // Usar el operador ?? para asignar un array vacío si es undefined
      this.paymentDetails = (response ?? []).map(payment => ({
        ...payment,
        isSelected: false
      }));
    } catch (error) {
      console.error('Error al obtener detalles de pago:', error);
      this.paymentDetails = [];
    }
  }
  


  // Manejador para seleccionar un domiciliario
  async handleSelectRider(rider: RiderPayment) {
    this.selectedRider = rider;
    await this.fetchRiderDetails(rider.rider_id);
  }
  
  // Manejador para liquidar un solo pago (desde el swipe)
  async handleSettlePayment(payment: PaymentDetail & { isSelected?: boolean }) {
    await this.openSettlementModal([payment.payment_id]);
  }
  
  // Abrir modal de liquidación
  async openSettlementModal(paymentIds?: number[]) {
    if (!this.selectedRider) {
      this.presentToast('No se ha seleccionado un domiciliario', 'warning');
      return;
    }
    
    // Si no se proporcionan IDs, usar los seleccionados
    if (!paymentIds) {
      paymentIds = this.paymentDetails
        .filter(p => p.isSelected && p.settlement_status === 'PENDING')
        .map(p => p.payment_id);
    }
    
    if (paymentIds.length === 0) {
      this.presentToast('No hay pagos seleccionados para liquidar', 'warning');
      return;
    }
    
    // Calcular monto total a liquidar
    const totalAmount = this.paymentDetails
      .filter(p => paymentIds?.includes(p.payment_id))
      .reduce((sum, p) => sum + p.rider_amount, 0);
    
    const modal = await this.modalCtrl.create({
      component: SettlementModalComponent,
      componentProps: {
        riderName: this.selectedRider.rider_name,
        paymentIds: paymentIds,
        totalAmount: totalAmount,
        paymentCount: paymentIds.length
      }
    });
    
    await modal.present();
    
    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      await this.settlePayments(paymentIds, data.comments);
    }
  }
  
  // Liquidar pagos seleccionados
  async settlePayments(paymentIds: number[], comments: string) {
    if (!this.selectedRider) return;
    
    const loading = await this.loadingCtrl.create({
      message: 'Procesando liquidación...'
    });
    await loading.present();
    
    try {
      console.log("ESTE ES EL PAYMENTENVIADO ", paymentIds, comments);
            let URL_USADA = "http://localhost:8000/payments/riders-payments/1/settle"
            let headers ={ payment_ids: paymentIds, comments: comments }
            console.log(headers);
             
      await this.http.post(`http://localhost:8000/payments/riders-payments/${this.selectedRider.rider_id}/settle`, headers).toPromise();
      
      this.presentToast('Pagos liquidados correctamente', 'success');
      
      // Recargar datos
      await this.fetchRidersData();
      if (this.selectedRider) {
        await this.fetchRiderDetails(this.selectedRider.rider_id);
      }
    } catch (error) {
      console.error('Error al liquidar pagos:', error);
      this.presentToast('No se pudieron liquidar los pagos', 'danger');
    } finally {
      loading.dismiss();
    }
  }
  
  // Verificar si hay pagos pendientes
  hasPendingPayments(): boolean {
    return this.paymentDetails.some(p => p.settlement_status === 'PENDING');
  }
  
  // Verificar si hay pagos seleccionados
  hasSelectedPayments(): boolean {
    return this.paymentDetails.some(p => p.isSelected);
  }
  
  // Cambio en el segmento de filtro
  segmentChanged(event: any) {
    this.filterStatus = event.detail.value;
    this.fetchRidersData();
  }
  
  // Cambio en el rango de fechas
  dateRangeChanged(event: any) {
    if (event.detail.value) {
      this.dateRange = event.detail.value;
      this.fetchRidersData();
    }
  }
  
  // Pull-to-refresh
  async doRefresh(event: any) {
    await this.fetchRidersData();
    event.target.complete();
  }
  
  // Mostrar toast
  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}



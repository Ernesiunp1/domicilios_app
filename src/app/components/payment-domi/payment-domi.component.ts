import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { DatePipe } from '@angular/common';
// import { ModalController, ToastController, LoadingController } from '@ionic/angular';

import { SettlementModalComponent } from '../settlement-modal/settlement-modal.component';
import { PaymentsService } from 'src/app/pages/payments/payments.service';

import { environment } from "src/environments/environment";

import { IonButton, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonSegment, IonLabel, IonRow, IonCol, IonDatetimeButton, IonModal, IonDatetime, IonContent,
  IonSegmentButton, IonItem, IonListHeader, IonBadge, IonNote, IonAvatar, IonIcon, IonList,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonGrid, 
  IonItemSliding, IonItemOption, IonItemOptions, IonFab, IonFabButton, IonRefresher, 
  IonRefresherContent, IonCheckbox, ModalController, 
  ToastController, 
  LoadingController 
} from "@ionic/angular/standalone"; 



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
  imports: [// Angular Common
    CommonModule, NgFor, NgIf, FormsModule,    
    // Ionic Components
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonButton,
    IonSegment, IonSegmentButton, IonLabel, IonRow, IonCol, 
    IonDatetimeButton, IonModal, IonDatetime, IonItem,
    IonContent, IonList, IonListHeader, IonBadge, IonNote, 
    IonAvatar, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, 
    IonCardTitle, IonCardContent, IonGrid, IonItemSliding, 
    IonItemOption, IonItemOptions, IonFab, IonFabButton, 
    IonRefresher, IonRefresherContent, IonCheckbox],

  providers: [DatePipe, ModalController, ToastController, LoadingController],  
  
})

export class PaymentsDomiComponent implements OnInit {

  apiUrl = environment.apiUrl;

  ridersData: RiderPayment[] | undefined = [];
  selectedRider: RiderPayment | null = null;
  // paymentDetails: any[] | undefined = [];
  paymentDetails: (PaymentDetail & { isSelected?: boolean })[] | any[] = [];
  // paymentDetails: PaymentDetail[] = []
  totalToRider: number = 0
  totalToEnterprise: number = 0
  totalTransaccion: number = 0 

  loading = false;
  detailsLoading = false;
  filterStatus: string[] = ['PENDING', 'TRANSFER_TO_OFFICE', 'TRANFERRED_TO_CLIENT' ];
  // filterStatus: string = 'PENDING'
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

    // this.fetchRidersData(); 
  }

  ionViewWillEnter() {
    this.fetchRidersData();
  }
  
  

  async fetchRidersData() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando domiciliarios...',
      spinner: 'circles'
    });
    await loading.present();
  
    try {
      console.log("Entrando a fetchRidersData");
      
      // Actualiza los estados para incluir todos excepto SETTLED
      this.ridersData = await this.paymentService.getRidesDataPayments(
        ['PENDING', 'TRANSFER_TO_OFFICE', 'TRANFERRED_TO_CLIENT'], 
        this.dateRange
      );
      console.log("esta es la data de los riders", this.ridersData);
      
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

//   async fetchRidersData() {
//     console.log('fetchRidersData - INICIO');
//   const loading = await this.loadingCtrl.create({
//     message: 'Cargando domiciliarios...',
//     spinner: 'circles'
//   });
//   await loading.present();

//   try {
//     // console.log("fetchRidersData - filterStatus:", this.filterStatus);
//     // console.log("fetchRidersData - dateRange:", this.dateRange);
//     // console.log("Entrando a fetchRidersData");
    
//     // Determinar qué estados usar basado en filterStatus
//     let statusesToUse: string[];
    
//     if (this.filterStatus === 'ALL') {
//       statusesToUse = ['PENDING', 'TRANSFER_TO_OFFICE', 'TRANFERRED_TO_CLIENT'];
//     } else {
//       statusesToUse = [this.filterStatus];
//     }

//     console.log("fetchRidersData - statusesToUse:", statusesToUse);
//     console.log("fetchRidersData - Llamando paymentService.getRidesDataPayments...");
    
    
//     this.ridersData = await this.paymentService.getRidesDataPayments(
//       statusesToUse, 
//       this.dateRange
//     );
    
//     console.log("esta es la data de los riders", this.ridersData);
//     console.log("fetchRidersData - ridersData recibida:", this.ridersData);
    
//     if (this.selectedRider) {
//       const stillExists = this.ridersData!.some(r => r.rider_id === this.selectedRider?.rider_id);
//       if (!stillExists) {
//         this.selectedRider = null;
//         this.paymentDetails = [];
//       } else {
//         this.selectedRider = this.ridersData!.find(r => r.rider_id === this.selectedRider?.rider_id) || null;
//         await this.fetchRiderDetails(this.selectedRider!.rider_id);
//       }
//     }
//   } catch (error) {
//     console.error('Error al cargar datos de domiciliarios:', error);
//     this.presentToast('No se pudieron cargar los datos de domiciliarios', 'danger');
//   } finally {
//     console.log('fetchRidersData - FINAL');
//     loading.dismiss();
//   }
// }



  // Cargar detalles de pagos de un domiciliario específico
  
  
  async fetchRiderDetails(riderId: number) {
    this.detailsLoading = true;
  
    try {
      let url = `${this.apiUrl}/payments/riders-payments/${riderId}`;
      const queryParams = new URLSearchParams();
  
      if (Array.isArray(this.filterStatus)) {
        for (const status of this.filterStatus) {
          if (status) queryParams.append('settlement_status', status);
        }
      } else if (typeof this.filterStatus === 'string' && this.filterStatus !== 'ALL') {
        queryParams.set('settlement_status', this.filterStatus);
      }
  
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
  
      const response = await this.http.get<any[]>(url).toPromise();
      console.log("RESPUESTA DE DETALLE", response);
      this.consiliacionMontos(response)
      this.paymentDetails = (response ?? [])
      .filter(payment => payment.settlement_status !== 'SETTLED')
      .map(payment => ({
        ...payment,
        isSelected: false
      }));
    } catch (error) {
      console.error('Error al obtener detalles de pago:', error);
      this.paymentDetails = [];
    } finally {
      this.detailsLoading = false;
    }
  }

//   async fetchRiderDetails(riderId: number) {
//   this.detailsLoading = true;

//   try {
//     let url = `${this.apiUrl}/payments/riders-payments/${riderId}`;
//     const queryParams = new URLSearchParams();

//     // Usar la misma lógica que en fetchRidersData
//     if (this.filterStatus === 'ALL') {
//       const statuses = ['PENDING', 'TRANSFER_TO_OFFICE', 'TRANFERRED_TO_CLIENT'];
//       statuses.forEach(status => queryParams.append('settlement_status', status));
//     } else {
//       queryParams.set('settlement_status', this.filterStatus);
//     }

//     if (queryParams.toString()) {
//       url += `?${queryParams.toString()}`;
//     }

//     const response = await this.http.get<any[]>(url).toPromise();
//     console.log("RESPUESTA DE DETALLE", response);
//     this.consiliacionMontos(response);
    
//     this.paymentDetails = (response ?? [])
//       .filter(payment => payment.settlement_status !== 'SETTLED')
//       .map(payment => ({
//         ...payment,
//         isSelected: false
//       }));
//   } catch (error) {
//     console.error('Error al obtener detalles de pago:', error);
//     this.paymentDetails = [];
//   } finally {
//     this.detailsLoading = false;
//   }
// }
  
  


async consiliacionMontos(deliveries: any ){
    console.log('ESTA ES LA LISTA DE CONSILIACION', deliveries);
      let totalToRider = 0
      let totalToRecive = 0

      for (const delivery of deliveries) {        
        if (delivery.settlement_status == 'PENDING') {    
          
          totalToRecive += delivery.pending_amount                 
        
        } 
      }

      for (const delivery of deliveries) {
        
        if (delivery.settlement_status != 'PENDING'){           
          totalToRider += delivery.rider_amount
        }


        
      }
    
      this.totalToEnterprise = totalToRecive
      this.totalToRider = totalToRider

      this.totalTransaccion = this.totalToEnterprise - this.totalToRider
    
    
    
  }


  // Manejador para seleccionar un domiciliario
  async handleSelectRider(rider: RiderPayment) {
    this.selectedRider = rider;
    await this.fetchRiderDetails(rider.rider_id);
  }
  
  
  async handleSettlePayment(payment: PaymentDetail & { isSelected?: boolean }) {
    console.log("MANEJADOR PARA LIQUIDAR UN SOLO PAGO");
    
    if (payment.settlement_status === 'SETTLED') {
      this.presentToast('Este pago ya está liquidado', 'warning');
      return;
    }
    
    await this.openSettlementModal([payment.payment_id]);
  }



  async openSettlementModal(paymentIds?: number[]) {
    console.log("MODAL DE LIQUIDACION");
    
    if (!this.selectedRider) {
      this.presentToast('No se ha seleccionado un domiciliario', 'warning');
      return;
    }
    
    // Si no se proporcionan IDs, usar los seleccionados (ahora no filtra por PENDING)
    if (!paymentIds) {
      paymentIds = this.paymentDetails
        .filter(p => p.isSelected && p.settlement_status !== 'SETTLED')
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
            let URL_USADA = `${this.apiUrl}/payments/riders-payments/1/settle`
            let headers ={ payment_ids: paymentIds, comments: comments }
            console.log(headers);
             
      await this.http.post(`${this.apiUrl}/payments/riders-payments/${this.selectedRider.rider_id}/settle`, headers).toPromise();
      
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
  // segmentChanged(event: any) {
  //   this.filterStatus = event.detail.value;
  //   this.fetchRidersData();
  // }
  
  // segmentChanged(event: any) {
  //   this.filterStatus = event.detail.value;
    
  //   // Si es ALL, deberíamos enviar todos los estados excepto SETTLED
  //   // if (this.filterStatus === 'ALL') {
  //   //   this.filterStatus = ['PENDING', 'TRANSFER_TO_OFFICE', 'TRANFERRED_TO_CLIENT'];
  //   // }
    
  //   this.fetchRidersData();
  // }

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
// //////////////////////////////////////////////////////////////////////


// Métodos auxiliares para mostrar la información de estado correctamente
    getBadgeColor(status: string): string {
      switch(status) {
        case 'PENDING': return 'warning';
        case 'SETTLED': return 'success';
        case 'TRANSFER_TO_OFFICE': return 'primary';
        case 'TRANFERRED_TO_CLIENT': return 'tertiary';
        default: return 'medium';
      }
    }

    getStatusLabel(status: string): string {
      switch(status) {
        case 'PENDING': return 'Pendiente';
        case 'SETTLED': return 'Liquidado';
        case 'TRANSFER_TO_OFFICE': return 'Transferido a Oficina';
        case 'TRANFERRED_TO_CLIENT': return 'Transferido a Cliente';
        default: return status;
      }
    }



}



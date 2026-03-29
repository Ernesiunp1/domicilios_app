import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentsService } from '../../pages/payments/payments.service';
import { ClientPaymentDetail } from '../../interfaces/payments-clients';
import { AlertController, ToastController, IonHeader, IonToolbar, IonButtons, IonBackButton,
IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, 
IonButton, IonSelect, IonSelectOption, IonSpinner, IonGrid, IonRow, IonCol, IonBadge, IonCheckbox
 } from '@ionic/angular/standalone';
// import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-payments-client',
  templateUrl: './payment-client.component.html',
  styleUrls: ['./payment-client.component.scss'],
  standalone: true,
  imports: [FormsModule , CommonModule, FormsModule, IonHeader, IonToolbar, IonButtons, IonBackButton,
IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonCheckbox,
IonButton, IonSelect, IonSelectOption, IonSpinner, IonGrid, IonRow, IonCol, IonBadge, ReactiveFormsModule,
]
})
export class PaymentsClientComponent implements OnInit {
  clientPaymentDetails: ClientPaymentDetail[] = [];
  filterStatus: string = 'ALL';
  isLoading: boolean = false;
  error: string | null = null;
  
  // Opciones para el filtro de estado
  statusOptions = [
    { value: 'ALL', label: 'Todos' },
    { value: 'PENDING', label: 'Pendientes' },
    { value: 'PAID', label: 'Pagados' },
    { value: 'CANCELLED', label: 'Cancelados' }
  ];

  hasSelectedPayments: boolean = false;


  constructor(private paymentsDomiService: PaymentsService,
              private cdr: ChangeDetectorRef,
              private alertctrl : AlertController,
              private toastctrl: ToastController
  ) {}

  ngOnInit() {
    this.loadClientPayments();
  }

  alertPresent(msg: string) {
    this.alertctrl.create({
      header: 'Atención',
      message: msg,      
      buttons: ['OK']
    }).then(alert => alert.present());
  }


  async toastPresent(msg: string, color: string = 'success') {
    const toast = await this.toastctrl.create({
      color: color,
      message: msg,
      duration: 3000
    });
    toast.present();
  }



  async loadClientPayments() { 
    try {
      console.log("cargando pagos de clientes");
      
      this.isLoading = true;
      this.error = null;
      this.clientPaymentDetails = await this.paymentsDomiService.getClientPayments(this.filterStatus);
      // Agregar propiedad isSelected para el checkbox
      console.log("PAGOS RECIBIDOS" ,this.clientPaymentDetails);
      
      
      
      this.clientPaymentDetails = this.clientPaymentDetails.map(payment => ({        
        id: payment.client_id,
        clientId: payment.client_id!.toString(),
        clientName: payment.client_name,
        amount: payment.saldo_neto,
        pendingAmount: payment.pending_amount,
        date: new Date().toISOString(), // Si no tienes fecha en los datos
        status: payment.pending_amount! > 0 ? 'PENDING' : 'PAID',
        deliveryCount: payment.total_deliveries,
        client_settlement_status: payment.client_settlement_status,
        payment_ids_list: payment.payment_ids_list,
        isSelected: false
      }));     

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al cargar pagos de clientes:', error);
      this.error = 'No se pudieron cargar los pagos. Intente nuevamente.';
      this.clientPaymentDetails = [];
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  onFilterChange() {
    this.loadClientPayments();
  }



  // toggleSelection(payment: ClientPaymentDetail & { isSelected?: boolean }) {
  //   payment.isSelected = !payment.isSelected;
  // }

  // selectAll(event: any) {
  //   const isChecked = event.detail.checked;
  //   this.clientPaymentDetails = this.clientPaymentDetails.map(payment => ({
  //     ...payment,
  //     isSelected: isChecked
  //   }));
  // }





  // getSelectedPayments(): (ClientPaymentDetail & { isSelected?: boolean })[] {
  //   return this.clientPaymentDetails.filter(payment => {      
  //     payment.isSelected});
  // }

  // async processSelectedPayments(clientPaymentDetails: ClientPaymentDetail[]) {
  //   console.log("Detalle de pago desde .TS",clientPaymentDetails);
    
  //   const selectedPayments = this.getSelectedPayments();
  //   if (selectedPayments.length === 0) {
  //     // Mostrar mensaje de que no hay pagos seleccionados
  //     return;
  //   }

  //   try {


  //         this.isLoading = true;          
  //         // Aquí puedes implementar la lógica para procesar los pagos seleccionados
  //         const paymentIds: any = selectedPayments
  //         .filter(payment => payment.id !== undefined)
  //         .map(payment => payment.id!.toString());

  //         await this.paymentsDomiService.processClientPayments(paymentIds);
  //         // Recargar los pagos después de procesar
  //         this.loadClientPayments();
    
    
  //   } catch (error) {
  //     console.error('Error al procesar pagos:', error);
  //     this.error = 'No se pudieron procesar los pagos. Intente nuevamente.';
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  // selector para el estado de seleccion de algun pago
  
  // updateHasSelectedPayments() {
  //   // this.hasSelectedPayments = this.clientPaymentDetails.some(p => p.isSelected);

  //   this.hasSelectedPayments = this.clientPaymentDetails
  //   .filter(p => p.client_settlement_status === 'PENDING')
  //   .some(p => p.isSelected);
  
  // console.log('Has selected payments:', this.hasSelectedPayments); // 
  // }

  
  // método para enviar los pagos seleccionados
  async sendSelectedPayments() {
    const selectedPayments = this.clientPaymentDetails.filter(p => p.isSelected);
    
    console.log('Pagos seleccionados...:', selectedPayments);
    
    const clientIds = selectedPayments.map(p => p.clientId || '').filter(id => id);
    console.log('IDs de clientes seleccionados:', clientIds);
    
    const allPaymentIds = selectedPayments
    .map(p => p.payment_ids_list || [])    
    .reduce((acc, list) => acc.concat(list), []);

    // console.log('Todos los IDs de pago:', allPaymentIds);

    
    await this.paymentsDomiService.processClientPayments(clientIds, allPaymentIds).then(
      res =>{
        console.log("Respuesta del servidor:", res);
        this.toastPresent('Pagos procesados exitosamente');

        this.loadClientPayments();

      }
    ).catch( error => {
      console.error("Error al procesar pagos:", error);
      this.error = 'No se pudieron procesar los pagos. Intente nuevamente.';
      this.toastPresent('Error al procesar pagos', 'danger');
      this.alertPresent(this.error)
    })
    
    
    // Aquí puedes hacer lo que necesites: enviarlos a un backend, abrir un modal, etc.
  }

  trackByPaymentId(index: number, payment: any): any {
        
  return payment.id; // o cualquier propiedad única del pago
  }


  // ////////////////////////////////////////////////////////////////////////

  // Método que se ejecuta cuando cambia la selección de un checkbox
onPaymentSelectionChange(payment: any, event: any) {
  // Actualizar el estado de selección
  payment.isSelected = event.detail.checked;
  
  // Mostrar información detallada en consola
  console.log('=== CAMBIO DE SELECCIÓN ===');
  console.log('Estado del checkbox:', event.detail.checked);
  console.log('Pago seleccionado/deseleccionado:', {
    id: payment.id,
    clientId: payment.clientId,
    clientName: payment.clientName,
    amount: payment.amount,
    date: payment.date,
    status: payment.client_settlement_status,
    isSelected: payment.isSelected,
    payment_ids_list: payment.payment_ids_list
  });
  
  // Si fue seleccionado, mostrar toda la información del pago
  if (event.detail.checked) {
    console.log('✅ PAGO SELECCIONADO - Información completa:');
    console.table([payment]); // Muestra la información en formato tabla
    
    // Si quieres ver propiedades específicas:
    console.log('Detalles del domicilio/pago:', {
      'ID del Pago': payment.id,
      'Cliente': payment.clientName,
      'ID del Cliente': payment.clientId,
      'Monto': payment.amount,
      'Fecha': payment.date,
      'Lista de IDs de pago': payment.payment_ids_list,
      'Estado': payment.client_settlement_status,
      'Todas las propiedades': payment
    });
  } else {
    console.log('❌ PAGO DESELECCIONADO:', payment.id, '-', payment.clientName);
  }
  
  // Actualizar el estado general
  this.updateHasSelectedPayments();
}

updateHasSelectedPayments() {
  this.hasSelectedPayments = this.clientPaymentDetails
    .filter(p => p.client_settlement_status === 'PENDING')
    .some(p => p.isSelected);
  
  console.log('¿Hay pagos seleccionados?:', this.hasSelectedPayments);
  
  // Mostrar todos los pagos actualmente seleccionados
  const selectedPayments = this.clientPaymentDetails.filter(p => p.isSelected);
  console.log('TOTAL DE PAGOS SELECCIONADOS:', selectedPayments.length);
  
  if (selectedPayments.length > 0) {
    console.log('LISTA DE PAGOS SELECCIONADOS:');
    selectedPayments.forEach((payment, index) => {
      console.log(`${index + 1}. ID: ${payment.id} - Cliente: ${payment.clientName} - Monto: ${payment.amount}`);
    });
    
    // También en formato tabla para mejor visualización
    console.table(selectedPayments.map(p => ({
      ID: p.id,
      Cliente: p.clientName,
      Monto: p.amount,
      Fecha: p.date,
      'IDs de Pago': p.payment_ids_list?.join(', ') || 'N/A'
    })));
  }
  
  console.log('==========================================');
}



}
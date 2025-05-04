import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PaymentsService } from '../../pages/payments/payments.service';
import { ClientPaymentDetail } from '../../interfaces/payments-clients';

@Component({
  selector: 'app-payments-client',
  templateUrl: './payment-client.component.html',
  styleUrls: ['./payment-client.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
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

  constructor(private paymentsDomiService: PaymentsService,
              private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadClientPayments();
  }

  async loadClientPayments() {
    try {
      console.log("cargando pagos de clientes");
      
      this.isLoading = true;
      this.error = null;
      this.clientPaymentDetails = await this.paymentsDomiService.getClientPayments(this.filterStatus);
      // Agregar propiedad isSelected para el checkbox
     
      
      this.clientPaymentDetails = this.clientPaymentDetails.map(payment => ({
        id: payment.client_id,
        clientId: payment.client_id!.toString(),
        clientName: payment.client_name,
        amount: payment.total_amount,
        pendingAmount: payment.pending_amount,
        date: new Date().toISOString(), // Si no tienes fecha en los datos
        status: payment.pending_amount! > 0 ? 'PENDING' : 'PAID',
        deliveryCount: payment.total_deliveries,
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

  toggleSelection(payment: ClientPaymentDetail & { isSelected?: boolean }) {
    payment.isSelected = !payment.isSelected;
  }

  selectAll(event: any) {
    const isChecked = event.detail.checked;
    this.clientPaymentDetails = this.clientPaymentDetails.map(payment => ({
      ...payment,
      isSelected: isChecked
    }));
  }

  getSelectedPayments(): (ClientPaymentDetail & { isSelected?: boolean })[] {
    return this.clientPaymentDetails.filter(payment => payment.isSelected);
  }

  async processSelectedPayments() {
    const selectedPayments = this.getSelectedPayments();
    if (selectedPayments.length === 0) {
      // Mostrar mensaje de que no hay pagos seleccionados
      return;
    }

    try {
      this.isLoading = true;
      // Aquí puedes implementar la lógica para procesar los pagos seleccionados
      const paymentIds = selectedPayments
      .filter(payment => payment.id !== undefined)
      .map(payment => payment.id!.toString());

      await this.paymentsDomiService.processClientPayments(paymentIds);
      // Recargar los pagos después de procesar
      this.loadClientPayments();
    } catch (error) {
      console.error('Error al procesar pagos:', error);
      this.error = 'No se pudieron procesar los pagos. Intente nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }
}
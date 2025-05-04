import { Component, OnInit, ChangeDetectorRef, EventEmitter, output, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Delivery, Item, DeliveryStanding, PaymentStatus, PaymentType } from '../../interfaces/deliveries';
import { DeliveryService } from '../../pages/deliveries/delivery.service'
import { RidersInterface } from 'src/app/interfaces/riders-interface';



@Component({
  selector: 'app-deliveries-component',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})

export class DeliveriesComponent implements OnInit {

   @Output() onSubmitUpdateRider: EventEmitter<any> = new EventEmitter<any>();
   @Output() onSubmitUpdateState: EventEmitter<any> = new EventEmitter<any>();

   @Input() set refreshTable(value: boolean) {
    if (value) {
      this.loadDeliveries();
    }
  }

  @Input() set DeliveriesSemanal(value: any) {
    if (value && value.items && value.items.length > 0) {
      console.log('Recibiendo entregas filtradas completas:', value);
      this.deliveries = value.items;
      this.totalDeliveries = value.total;
      this.totalPages = value.pages || Math.ceil(value.total / this.pageSize);
      this.currentPage = value.page || 1;
      this.pageSize = value.size || 20;
      this.processDeliveriesSemanal();
    } else if (value) {
      console.log('Recibiendo objeto de respuesta, pero sin items:', value);
    }
  }
  
  deliveries: Item[] = [];
  riders: RidersInterface[] = [];
  totalDeliveries: number = 0;
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;
  agregarRider: boolean = false;
  deliveryIdToRider: number = 0
  
  // Para el filtro de estado
  states: DeliveryStanding[] = [];
  selectedState: DeliveryStanding | null = null;
  
  // Para mostrar el spinner de carga
  isLoading: boolean = false;
  
  // Enums disponibles en el componente
  deliveryStates = DeliveryStanding;
  paymentStatuses = PaymentStatus;
  paymentTypes = PaymentType;

  constructor(private deliveryService: DeliveryService, 
              private cdr: ChangeDetectorRef,
                
  ) { }

  ngOnInit() {
    this.loadDeliveryStates();
    this.loadDeliveries();
    this.getRiders();
  }

  loadDeliveryStates() {
    // Cargar los estados directamente del enum
    this.states = Object.values(DeliveryStanding);
  }

  loadDeliveries() {
    this.isLoading = true;
    
    // Usamos el método getAllD pero enviando los parámetros de paginación y filtro
    this.deliveryService.getAllD(
      this.currentPage, 
      this.pageSize, 
      this.selectedState
    ).subscribe({
      next: (res) => {
        console.log('res deliveries', res);
        this.deliveries = res.items;
        this.totalDeliveries = res.total;
        this.totalPages = res.pages || Math.ceil(this.totalDeliveries / this.pageSize);
        this.isLoading = false;
      },
      error: (err) => {
        console.log('Error fetching all deliveries:', err);
        this.isLoading = false;
      }
    });
  }

  onStateChange() {
    this.currentPage = 1; // Resetear a la primera página cuando cambia el filtro
    this.loadDeliveries(); // Recargar los datos con el nuevo filtro
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadDeliveries(); // Cargar la siguiente página
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDeliveries(); // Cargar la página anterior
    }
  }

  getStateColor(state: string): string {
    switch(state) {
      case DeliveryStanding.PENDING: return 'warning';
      case DeliveryStanding.ASSIGNED: return 'primary';
      case DeliveryStanding.IN_PROGRESS: return 'tertiary';
      case DeliveryStanding.DELIVERED: return 'success';
      case DeliveryStanding.CANCELLED: return 'danger';
      default: return 'medium';
    }
  }
  
  getPaymentStatusColor(status?: string): string {
    if (!status) return 'medium';
    
    switch(status) {
      case PaymentStatus.PENDING: return 'warning';
      case PaymentStatus.PAID: return 'success';
      case PaymentStatus.COURIER: return 'tertiary';
      default: return 'medium';
    }
  }
  
  formatDate(dateString: Date | null): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  AgregarRider(delivery_id: number) {
    // Lógica para agregar un rider
    this.agregarRider = true
    this.deliveryIdToRider = delivery_id;
    console.log('Agregar rider');
    console.log('Riders:', this.agregarRider);
    
  }


  getRiders() {
    this.deliveryService.getIdsRiders().subscribe({
      next: (resp) => {
        console.log("resp riders", resp);
        
        this.riders = resp;        
        this.cdr.detectChanges(); 

      },
      error: (err) => {
        console.error("error", err);
      }
    });
  }

  onRiderSelected($event: any, id: any){
    let rider_id = $event.target.value;    
    let delivery_id = id;
    console.log('ID del delivery:', id);
    console.log('ID del rider seleccionado:', $event.target.value);
    this.onSubmitUpdateRider.emit({ rider_id, delivery_id });
    this.deliveryIdToRider = 0;
  }

  changeState( delivery: Item, newState: DeliveryStanding) {
    console.log('Estado anterior:', delivery.state);
    console.log('Nuevo estado:', newState);
    console.log('ID de la entrega:', delivery.id);

    this.onSubmitUpdateState.emit({delivery, newState});
    
  // actualizarTabla(this.updateState: any){
  //   if (!this.updateState){
  //     this.loadDeliveries()
  //   }
  // }
  }


  processDeliveriesSemanal() {
    // Aquí puedes hacer cualquier procesamiento adicional con los datos filtrados
    // Por ejemplo, calcular estadísticas, actualizar gráficos, etc.
    this.totalDeliveries = this.deliveries.length;
    
    
    
    
    // Lógica adicional específica para las entregas semanales
    // this.DeliveySemana();
  }

  // DeliveySemana(){
  //   console.log('componente Entregas semanales :', this.DeliveriesSemanal);
    
  // }

  
  


}
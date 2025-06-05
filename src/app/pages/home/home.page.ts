import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonHeader, IonToolbar
  , IonButtons, IonButton, IonIcon, IonLabel, IonTitle, IonMenuButton, IonGrid, IonCardContent,
  IonNote, IonList, IonBackButton
} from '@ionic/angular/standalone';

import { Router, RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';

// 🚀 IMPORTANTE: Crea tu servicio `DashboardService` y ajusta la ruta de importación según tu estructura de carpetas.
// import { DashboardService, Delivery } from '../services/dashboard.service';

import { HomeService, } from "../home/home.service"; // Asegúrate de que este servicio exista y esté correctamente implementadod


import { PaymentsService } from "../payments/payments.service"; // Asegúrate de que este archivo exista y contenga las interfaces necesarias 
import { NewDomiComponent } from 'src/app/components/new-domi/new-domi.component';
import { AlertController, ToastController } from "@ionic/angular";
import { DeliveryService } from '../deliveries/delivery.service';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment'; // Asegúrate de que este archivo exista y contenga las variables de entorno necesarias

export interface DeliveriesResponse {
  items: any[]; // Podés reemplazar `any` por el tipo específico si sabés qué contiene
  total: number;
  page: number;
  size: number;
  pages: number;
  filter: {
    time_period: string;
    start_date: string | null;
    end_date: string | null;
  };
}


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ IonContent, IonItem, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonHeader, IonToolbar
    , IonButtons, IonButton, IonIcon, IonLabel, IonTitle, IonMenuButton, IonGrid, IonCardContent,
  AsyncPipe,   IonList, IonNote, NgForOf, NgIf, NewDomiComponent, IonBackButton]
})

export class HomePage implements OnInit {

  apiUrl = environment.apiUrl

  originalState: boolean = true; 
  
  deliveriesToday$!: any;
  activeRiders$!: any;
  pendingPayments$!: any;
  upcomingDeliveries$!: any;

  riders: number = 0

  pendingRiderPayments: number = 0;
  pendingRiderAmount: number = 0;
  
  totalTransactions: number = 0;
  totalAmount: number = 0;

  pendingDomisToPayToRiderCount: number = 0;
  pendingToPaytoRiderTotal: number = 0;  
  pendindForRiderfromOffice:number = 0; 
  pendindForRiderfromClient:number = 0;
  
  pendingOfficeToClient: number =  0;       // cantidad de pagos pendientes por la oficina al cliente       
  pendingOfficeToClientAmount: number = 0;  // monto de los pagos pendientes de la officina al cliente
  pendingClientPayments: number = 0;
  pendingClientAmount: number = 0;


  deliveriesList: any[]= [];


  constructor(
    private homeService: HomeService,
    private paymentService: PaymentsService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private deliveryService: DeliveryService,
    private http: HttpClient
    
  ) {}

  /**
   * Se ejecuta al inicializar el componente y enlaza los observables
   * expuestos por el servicio con las propiedades locales.
   */
  ngOnInit(): void {
    this.loadDashboardData();
    this.paymentService.loadsDashboardData()
  }

  /**
   * Vincula cada card con su observable correspondiente.
   */
  private loadDashboardData(): void {
    this.deliveriesToday$ = this.getDeliveriesToday();
    this.activeRiders$ = this.getActivateRiders();
    this.pendingPayments$ = this.getPaymentsData();
    this.upcomingDeliveries$ = this.getDataDeliveriesToday();
    
  }





  getDeliveriesToday(): Observable<number> {
  return this.homeService.getDeliveriesToday().pipe(
    map((data: DeliveriesResponse) => data.total)
  );
  }

  getActivateRiders(){
    return this.homeService.getActiveRiders().subscribe({
      next: (data: any) => {
        console.log("Riders",data.total);
        let total = data.total || 0; 
        this.riders = total; 

        return this.riders; 
      },
      error: (error) => {
        console.error('Error al obtener los riders activos:', error);
        return 0; // Retorna 0 en caso de error
      }
    })
  }


  getPaymentsData(){
    
  this.paymentService.loadsDashboardData().subscribe({
      next: (response: any) => {

        console.log("respuesta EN TS: ", response);
        

        this.pendingDomisToPayToRiderCount = response.pendingDomisToPayToRiderCount,
        this.pendingToPaytoRiderTotal = response.pendingToPaytoRiderTotal,
        this.pendindForRiderfromOffice = response.pending_to_rider_from_office,
        this.pendindForRiderfromClient = response.pending_to_rider_from_client,
        this.pendingRiderPayments = response.pendingRiderPayments || 0;
        this.pendingRiderAmount = response.pendingRiderAmount || 0;
        this.pendingClientPayments = response.pendingClientPayments || 0;
        this.pendingClientAmount = response.pendingClientAmount || 0;
        this.totalTransactions = response.totalTransactions || 0;
        this.pendingOfficeToClient = response.pendingOfficeToClient || 0,    
        this.pendingOfficeToClientAmount= response.pendingOfficeToClientAmount || 0, 
        this.totalAmount = response.totalAmount || 0;
      },  
      error: (error) => {
        console.error('Error cargando datos del dashboard:', error);
        // Cargar datos de ejemplo en caso de error
        
      }
    })


  }


  getDataDeliveriesToday(){

      return this.homeService.getDeliveriesToday().pipe(
      map(data => data.items)
    );   


  }



  async alertMessage(message: string ){
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message: `${message}`,
      buttons: ['OK']})

      alert.present();
  }

  async presentToast(message:string, color = 'success') {
    const toast = await this.toastCtrl.create({
      color: color,
      message: message,
      duration: 3000
    });
    toast.present();
  }


  resetOriginalState(){
    this.originalState = true;
    this.loadDashboardData();
    this.getPaymentsData();
    this.getActivateRiders();
    this.getDataDeliveriesToday();
    this.deliveriesList = [];
    this.router.navigate(['/home']);
  }



   handlerFormSubmit(formData: any){
    console.log("formData", formData);
    this.deliveryService.createNewDelivery(formData).subscribe({
      next: (resp: any) =>{
        console.log("respuesta", resp);
        
        this.alertMessage("Domicilio creado correctamente")
        this.presentToast("Domicilio creado correctamente")
        this.originalState = true;

        this.generateLabel(formData, resp.id );
      },
      error: (err) => {
        console.error("error", err);
        this.alertMessage(`Error: ${err.error.message}`)
        this.presentToast(`Error: ${err.error.message}`, 'danger')
        this.originalState = true;
      }
    })
       
    
    this.originalState = true;

  }

  generateLabel(domicilio: any, deliveryId: number) {
    console.log("generando etiqueta para el domicilio", domicilio);
    
    domicilio.id = deliveryId; 

    this.http.post(`${this.apiUrl}/deliveries/generate-label/`, domicilio, {
      responseType: 'blob' // importante: para manejar PDF
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `etiqueta-${domicilio.id}.pdf`;
      a.click();

      // o para imprimir directamente:
      // const pdfWindow = window.open();
      // pdfWindow?.document.write(
      //   `<iframe width='100%' height='100%' src='${url}'></iframe>`
      // );
    });
  }

  goTo(address: string): void{
    this.router.navigate([`/${address}`]);
  }

  goToDeliveries(){}




  // ---------- Métodos de acciones rápidas ----------

  /** Navega al mapa con todas las entregas. */
  viewMap(): void {
    this.router.navigate(['/map']);
  }

  /** Navega al formulario para crear un nuevo domicilio. */
  createDelivery(): void {
    this.originalState = false;
  }

  /** Navega a la página de asignación de riders. */
  assignRider(): void {
    this.router.navigate(['/deliveries']);
  }
}

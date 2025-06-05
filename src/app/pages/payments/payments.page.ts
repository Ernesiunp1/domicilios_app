import { Component, OnInit } from '@angular/core';
import { NavController,  } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { IonHeader, IonCardHeader, IonToolbar, IonBackButton, IonButtons,  IonCard ,
  IonTitle, IonCardContent,  IonCardTitle, IonContent,  IonIcon, IonItem


} from "@ionic/angular/standalone";
import { PaymentsService } from './payments.service';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
  standalone: true,
  imports: [IonHeader, IonCardHeader, IonToolbar, IonBackButton, IonButtons,  IonCard, IonCard,
     IonTitle, IonCardContent, IonCardTitle, IonContent, IonIcon, RouterLink, ]
})
export class PaymentsPage implements OnInit {
  // Datos para las tarjetas (temporalmente con valores de ejemplo)
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


  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    private paymentsService: PaymentsService,
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  ionViewWillEnter() {
    this.loadDashboardData();
  }

  loadDashboardData() {

    return this.paymentsService.loadsDashboardData().subscribe({
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
        this.loadDummyData();
      }
    })

  
  }

  loadDummyData() {
    // Datos de ejemplo para visualización
    this.pendingRiderPayments = 8;
    this.pendingRiderAmount = 240000;
    this.pendingClientPayments = 5;
    this.pendingClientAmount = 180000;
    this.totalTransactions = 28;
    this.totalAmount = 520000;
  }

  navigateTo(route: string) {
    this.navCtrl.navigateForward(`/payments/${route}`);
  }









}
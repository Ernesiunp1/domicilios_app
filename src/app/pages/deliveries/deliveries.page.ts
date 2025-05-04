import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRow ,IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons, IonButton, IonBackButton, IonCol, IonGrid } from '@ionic/angular/standalone';
import { DeliveriesComponent } from 'src/app/components/delivery/delivery.component';
import { NewDomiComponent } from "../../components/new-domi/new-domi.component";
import { DeliveryService } from './delivery.service';
import { AlertController, ToastController } from "@ionic/angular";
import { navigate } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from 'src/app/components/shared/shared.service';
import { Delivery, DeliveryStanding } from 'src/app/interfaces/deliveries';



@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.page.html',
  styleUrls: ['./deliveries.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonBackButton, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, 
     IonMenuButton, IonButtons, NewDomiComponent, DeliveriesComponent]
})



export class DeliveriesPage implements OnInit {
  originalState: boolean = true;

  refreshTableTrigger: boolean = false;
  deliveriesFilt: any = {};

  constructor(
    private deliveryService: DeliveryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    
  ) { }

  ngOnInit() {
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



  crearDomicilio(){
    this.originalState = false;
    this.refreshTableTrigger= false;
    console.log("crear domi");
    
  }

  statusDefault(){
    this.originalState = true;
    
  }

  handlerFormSubmit(formData: any){
    console.log("formData", formData);
    this.deliveryService.createNewDelivery(formData).subscribe({
      next: (resp) =>{
        console.log("respuesta", resp);
        
        this.alertMessage("Domicilio creado correctamente")
        this.presentToast("Domicilio creado correctamente")
        this.originalState = true;
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


  updateRider(event: any){
    console.log("evento submit con el ID del rider", event);
    
    this.deliveryService.addRiderToDelivery(event.rider_id, event.delivery_id).subscribe({
      next: (resp) => {
        console.log("respuesta", resp);
        this.alertMessage("Rider asignado correctamente")
        this.presentToast("Rider asignado correctamente")  
        
        this.refreshTableTrigger = !this.refreshTableTrigger;
        
      
      }, 
      error: (err) => {
        console.error("error", err);
        this.alertMessage(`Error: ${err.error.message}`)
        this.presentToast(`Error: ${err.error.message}`, 'danger')
      }
    })
    
  }

  actualizarEstado(){

  }

  fechaFormateada(){
    const fecha = new Date();
    
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    const milisegundos = fecha.getMilliseconds().toString().padStart(3, '0') + '000';
    
    return `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}.${milisegundos}`;

  }



  UpdatingStateDelivery($event: any){
    console.log("evento submit ###", $event.delivery.id);
    console.log($event.newState);
    let delivery_date = this.fechaFormateada()
    let delivery_id = $event.delivery.id; 
    
    let payload = {};

    if ($event.newState === 'DELIVERED'){
          payload = {
            state: $event.newState,
            delivery_date
          }

    } else {
          payload = {
            state: $event.newState
          }
    }
        

    
    
    
    this.deliveryService.updateDelivery(delivery_id, payload).subscribe({
      next: (resp) => {
        console.log("respuesta", resp);
        this.alertMessage("Estado actualizado correctamente")
        this.presentToast("Estado actualizado correctamente")  
        
        this.refreshTableTrigger = !this.refreshTableTrigger;        
      
      }, 
      error: (err) => {
        console.error("error", err);
        this.alertMessage(`Error: ${err.error.message}`)
        this.presentToast(`Error: ${err.error.message}`, 'danger')
      }
    })
    
  }


  deliveriesFiltered( time_period: string | null, state: any | null,
                      start_date: string | null, end_date: string | null ){
      return this.deliveryService.deliveriesFiltered(time_period, start_date, end_date, state).subscribe({
        next: (resp) => {
          console.log("respuesta", resp);
  
           this.deliveriesFilt = resp;
              
        },
        error: (err) => {
          console.error("error", err);
          this.alertMessage(`Error: ${err.error.message}`)
          this.presentToast(`Error: ${err.error.message}`, 'danger')
        }
      })
  
  
  }


}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonList, ToastController, AlertController ,IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons, IonCard, IonLabel, IonItem, IonButton, IonCardHeader, IonCardContent, IonCardTitle, IonRow, IonCol, IonGrid } from '@ionic/angular/standalone';
import { RidersService } from './riders.service';
import { Router, RouterLink } from '@angular/router';
import { al } from '@angular/router/router_module.d-6zbCxc1T';
// import { RiderDetailsComponent } from 'src/app/components/rider-details/rider-details.component';

@Component({
  selector: 'app-riders',
  templateUrl: './riders.page.html',
  styleUrls: ['./riders.page.scss'],
  standalone: true,
  imports: [IonGrid, IonCol, IonRow, IonList, IonCardTitle, IonCardContent, IonCardHeader, IonButton, IonItem, IonLabel, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, 
    FormsModule, IonMenuButton, IonButtons, IonCard, IonLabel, IonItem, IonButton, IonCardHeader, 
    IonCardContent, RouterLink],
})
export class RidersPage implements OnInit {

  riders: any[] = [];

  constructor(
    private ridersService: RidersService,
    private router: Router,
    private toastController: ToastController,
    private alertctrl: AlertController
  ) { }


  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      color: color,
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async presentAlert(Message: string) {
    const alert = await this.alertctrl.create({
      header: 'Mensaje:',
      message: Message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ngOnInit() {
    this.getRiders();
  }


  getRiders(){
    return this.ridersService.getRiders().subscribe({

      next: (response) => {
        console.log('Riders:', response.riders);
        this.riders = response.riders;
        console.log('arrogle de Riders:', this.riders);
        
        
      },
      error: (error) => {
        
        console.error('Error fetching riders:', error.error.detail);
          if (error.error.detail == "NO HAY USUARIOS DISPONIBLES"){
            this.presentAlert('No hay riders disponibles');
            this.riders = [];
          }
      },
    })
  }

  deleteRider(riderId: string){
    this.ridersService.deletedRider(riderId).subscribe({
      next: (response) => {
      this.presentToast('Rider borrado exitosamente', 'success');
      this.presentAlert('Rider borrado exitosamente');

      console.log('Rider deleted successfully:', response);
      this.getRiders(); // Refresh the list after deletion
      
      },
      error: (error) => {
      this.presentAlert('Error deleting rider');
      this.presentToast('Error deleting rider', 'danger');
      console.error('Error deleting rider:', error);
      },
    });

  }

}

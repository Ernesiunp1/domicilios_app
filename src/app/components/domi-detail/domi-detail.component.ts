import { Component, OnInit } from '@angular/core';
import { DeliveryStateService } from "./delivery-state.service";
import { IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCardContent,  IonNote,
         IonContent, IonBackButton, IonToolbar, IonButtons, IonHeader, IonTitle } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage-angular';

@Component({
  selector: 'app-domi-detail',
  templateUrl: './domi-detail.component.html',
  styleUrls: ['./domi-detail.component.scss'],
  imports: [IonButtons, IonToolbar, IonBackButton, IonContent, CommonModule, IonicStorageModule, IonNote, IonCardHeader, IonCardTitle, IonCard, IonCardSubtitle, IonCardHeader, 
    IonCardContent,  IonHeader, IonTitle  ]
})
export class DomiDetailComponent  implements OnInit {
  deliveryData: any;

  constructor(private deliveryStateService: DeliveryStateService) { }


  ngOnInit() {

    this.deliveryStateService.currentDelivery.subscribe(delivery => {
      console.log("domi en detalle-domi" ,delivery);
      
      if (delivery) {
        this.deliveryData = delivery;
      } else {
        // Manejar el caso donde no hay datos (por ejemplo, si se accede directamente a la URL)
        // Podrías redirigir a la lista o mostrar un mensaje
      }
    });
  }


  

}

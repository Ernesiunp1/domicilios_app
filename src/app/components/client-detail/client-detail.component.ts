import { Component, OnInit , Input,} from '@angular/core';
import { IonLabel , IonContent, IonCard, IonCardHeader, IonItem, IonList, IonCardSubtitle, 
  IonCardTitle, IonCardContent, IonChip, IonItemGroup } from "@ionic/angular/standalone";

import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss'],
  imports: [IonItemGroup, IonChip, IonCardContent, IonCardTitle, IonCardSubtitle, IonLabel , 
    IonList, IonItem, IonContent, IonCard, IonCardHeader, IonChip, UpperCasePipe, IonItemGroup]
})
export class ClientDetailComponent  implements OnInit {
  @Input() cliente: any;

  constructor() { }

  ngOnInit() {
    console.log('Cliente recibido:', this.cliente);
  }


  goToDelivery(delivery: any){
    console.log("Go to delivery", delivery);
    
  }

}

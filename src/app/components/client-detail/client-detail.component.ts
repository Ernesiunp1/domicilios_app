import { Component, OnInit , Input,} from '@angular/core';
import { IonLabel , IonButtons, IonHeader, IonContent, IonTitle, IonToolbar, IonCard, IonCardHeader,
  IonMenuButton, IonItem, IonList, IonButton, IonBackButton, IonCardSubtitle, IonCardTitle, 
  IonCardContent, IonChip, IonItemGroup, IonItemDivider } from "@ionic/angular/standalone";

  import { CommonModule, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss'],
  imports: [IonItemDivider, IonItemGroup, IonChip, IonCardContent, IonCardTitle, IonCardSubtitle, IonBackButton, IonButton,  IonLabel , IonList, IonItem, 
    IonMenuButton, IonTitle, IonContent, IonHeader, IonButtons, IonButtons, IonTitle, 
    IonToolbar, IonCard, IonCardHeader, IonChip, UpperCasePipe, IonItemGroup
  ]
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

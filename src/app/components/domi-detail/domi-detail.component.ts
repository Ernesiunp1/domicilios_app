import { Component, OnInit } from '@angular/core';
import { DeliveryStateService } from "./delivery-state.service";
import { IonCard, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCardContent,  IonNote,
         IonContent, IonBackButton, IonToolbar, IonButtons, IonHeader, IonTitle, IonButton, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { IonicStorageModule } from '@ionic/storage-angular';
import { environment } from "src/environments/environment";
import { HttpClient } from '@angular/common/http';
import { DeliveryData } from "src/app/interfaces/deliveryData-interface";


@Component({
  selector: 'app-domi-detail',
  templateUrl: './domi-detail.component.html',
  styleUrls: ['./domi-detail.component.scss'],
  imports: [IonCol, IonRow, IonGrid, IonButton, IonButtons, IonToolbar, IonBackButton, IonContent, CommonModule, IonicStorageModule, IonNote, IonCardHeader, IonCardTitle, IonCard, IonCardSubtitle, IonCardHeader, 
    IonCardContent,  IonHeader, IonTitle  ]
})
export class DomiDetailComponent  implements OnInit {
  deliveryData: any;
  apiUrl = environment.apiUrl

  constructor(private deliveryStateService: DeliveryStateService,
             private http: HttpClient
  ) { }


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

    onClick(deliveryData: DeliveryData){
      console.log( "la data del delivery", deliveryData);

      let location = deliveryData.delivery_address.split("(")[1]
      location.replace(")", "")
      
      let domicilio = {
        id : deliveryData.id,
        package_name: deliveryData.package_name,
        delivery_address: deliveryData.delivery_address,
        delivery_location: location,
        receptor_name: deliveryData.receptor_name,
        receptor_number: deliveryData.receptor_number,
        fecha_creacion: deliveryData.delivery_date,
        delivery_comment: deliveryData.delivery_comment,
        delivery_total_amount: deliveryData.delivery_total_amount,
        rider_name: deliveryData.rider.name,
        client_name: deliveryData.client.client_name
     
      }

      this.generateLabel(domicilio, deliveryData.id)

      
    }


    generateLabel(domicilio: any, deliveryId: number) {
    console.log("generando etiqueta para el domicilio", domicilio);
    
    domicilio.id = deliveryId; // Asegurarse de que el ID esté presente en el objeto domicilio
    
    // this.http.post(`${this.apiUrl}/deliveries/generate-label/`, domicilio, {
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
  

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class DeliveryStateService {
  private selectedDeliverySource = new BehaviorSubject<any>(null);
  
  currentDelivery = this.selectedDeliverySource.asObservable();
  
  // Método para actualizar el domicilio seleccionado
  setSelectedDelivery(delivery: any) {
    this.selectedDeliverySource.next(delivery);
  }
  
}

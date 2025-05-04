import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {  ModalController } from '@ionic/angular/standalone'


interface ClientUpdateModel {
  id : number | null;
  client_name: string | null;
  phone: string | null;
  address: string | null;
}

@Component({
  selector: 'app-edit-client-form',
  templateUrl: './edit-client-form.component.html',
  styleUrls: ['./edit-client-form.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})

export class EditClientFormComponent  implements OnInit {

  @Output() updatingClient: any = new EventEmitter()

  @Input() client: any; // Cliente actual que se va a actualizar
  
  
  clientData: ClientUpdateModel = {
    id: null,
    client_name: null,
    phone: null,
    address: null
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // Cargar los datos del cliente actual si existen
    if (this.client) {
      console.log('Cliente a editar:', this.client);
      
      this.clientData = {
        id: this.client.id || null,
        client_name: this.client.client_name || null,
        phone: this.client.phone || null,
        address: this.client.address || null
      };
    }
  }

  updateClient() {
    // Crear un objeto solo con las propiedades no nulas
    const updateData: any = {};
    
    if (this.clientData.id !== null) {
      updateData.id = this.clientData.id;
    }
    
    if (this.clientData.client_name !== null) {
      updateData.client_name = this.clientData.client_name.toLowerCase();
    }
    
    if (this.clientData.phone !== null) {
      updateData.phone = this.clientData.phone;
    }
    
    if (this.clientData.address !== null) {
      updateData.address = this.clientData.address.toLowerCase();
    }
    
    console.log('Datos a actualizar:', updateData);
    
    // Verifica si estamos en un modal antes de intentar cerrarlo
    if (this.modalCtrl) {
      this.modalCtrl.dismiss(updateData).catch(err => {
        console.log('No hay modal activo para cerrar', err);
        // Si no podemos cerrar el modal, solo emitimos el evento
        this.updatingClient.emit(updateData);
      });
    } else {
      // Si no estamos en un modal, solo emitimos el evento
      this.updatingClient.emit(updateData);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss().catch(err => {
      console.log('No hay modal activo para cerrar', err);
    });
  }




  
}
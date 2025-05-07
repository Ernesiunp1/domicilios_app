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
  bank: string | null;
  account_number: string | null;
  account_type: string | null;
}

@Component({
  selector: 'app-edit-client-form',
  templateUrl: './edit-client-form.component.html',
  styleUrls: ['./edit-client-form.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule]
})

export class EditClientFormComponent  implements OnInit {

  ahorro:string = "AHORRO"
  corriente: string = "CORRIENTE"

  @Output() updatingClient: any = new EventEmitter()

  @Input() client: any; // Cliente actual que se va a actualizar
  
  
  clientData: ClientUpdateModel = {
    id: null,
    client_name: null,
    phone: null,
    address: null,
    bank: null,
    account_number: null,
    account_type: null
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // Cargar los datos del cliente actual si existen
    if (this.client) {
      // console.log('Cliente a editar:', this.client);
      
      this.clientData = {
        id: this.client.id || null,
        client_name: this.client.client_name || null,
        phone: this.client.phone || null,
        address: this.client.address || null,
        bank: this.client.bank || null,
        account_number: this.client.account_number || null,
        account_type: this.client.account_type || null
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

    if (this.clientData.bank !== null) {
      updateData.bank = this.clientData.bank.toLowerCase();
      
    }
    if ( this.clientData.account_number !== null) {
      updateData.account_number = this.clientData.account_number
    }
    if (this.clientData.account_type !== null) {
      updateData.account_type = this.clientData.account_type
    }
    
    // console.log('Datos a actualizar:', updateData);
    
    // Verifica si estamos en un modal antes de intentar cerrarlo
    if (this.modalCtrl) {
      this.modalCtrl.dismiss(updateData).catch(err => {
        // console.log('No hay modal activo para cerrar', err);
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
      // console.log('No hay modal activo para cerrar', err);
    });
  }




  
}
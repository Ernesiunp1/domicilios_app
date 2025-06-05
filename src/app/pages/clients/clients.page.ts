import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController ,IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, 
  IonButton, IonIcon, IonBackButton, ToastController, IonCard } from '@ionic/angular/standalone';
//import { MenuComponent } from 'src/app/components/menu/menu.component';
import { ClientsListComponent } from "../../components/clients-list/clients-list.component";
import { ClientService } from './client.service';
import { ClientFormComponent } from 'src/app/components/client-form/client-form.component';
import { ClientDetailComponent } from 'src/app/components/client-detail/client-detail.component';
import { EditClientFormComponent } from "../../components/edit-client-form/edit-client-form.component";
import { ModalController  } from "@ionic/angular";
import { ClientsInterface } from 'src/app/interfaces/clients-interface';



@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  standalone: true,
  imports: [IonCard, IonBackButton, IonIcon, IonButton, IonButtons, IonContent, 
    IonHeader, IonTitle, EditClientFormComponent,
    IonToolbar, CommonModule, FormsModule,  ClientDetailComponent,
    IonButtons, IonMenuButton, ClientsListComponent, ClientFormComponent]
})


export class ClientsPage implements OnInit {
  @ViewChild(ClientsListComponent) clientsListComponent!: ClientsListComponent;

  clientList: boolean = true;     // Lista de clientes
  clientDetail: boolean = false;  // Detalle de cliente
  editClient: boolean = false;  
  createClient: boolean = false   // Editar cliente
  
  
  clientup = {}; // Cliente seleccionado
  clienteSeleccionado: any = null;


  constructor(
    private clientService: ClientService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }


  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color
    });
    toast.present();
  }

  async presentAlert(message: string, header: string = 'Alerta') {
    const alert = await this.alertCtrl.create({
      
      header: header,      
      message: message,
      buttons: ['OK'],
      
    });
  
    await alert.present();
  }

  ngOnInit() {
  }

  statusDefault(){
    this.clientList = true;
    this.createClient = false             
    this.clientDetail = false;    
    this.editClient = false;  
  }


  // btnAgregarCliente
  agregarCliente(){
    this.createClient = true    
    this.clientList = false;        
    this.clientDetail = false;    
    this.editClient = false;  
    
    
    console.log('agregar cliente');
  }



  OnEliminarCliente(client_id: number) {
    let texto = ''
    this.clientService.clearClient(client_id).subscribe({
      next: (response) => {

        console.log('Cliente eliminado con éxito', response);
        this.clientsListComponent.updateClientStatus(response);
      },
      error: (error) => {
        if(error.status === 401){
          texto = 'Debe Hacer login nuevamente, sesion expirada'
        }else{
          texto = 'Error al eliminar el cliente, por favor intenta nuevamente'
        }

        this.alertCtrl.create({
          header: 'Error',
          message: `${texto}`,
          buttons: ['OK']
        }).then(alert => {
          alert.present();
        })
        console.error('Error al eliminar el cliente', error);
      }
    })
    
  }


  getClienteByName(client_name: string){
    this.clientService.getClientByName(client_name).subscribe({
      next: (cliente) => {
        this.clienteSeleccionado = cliente;
        
        
      this.clientDetail = true;  
      this.createClient = false;    
      this.clientList = false;      
      this.editClient = false;  
                
      },
      error: (error) => {
        console.error('Error al buscar el cliente', error);
      }

    })
  }


  // formulario para crear cliente   
  OnCreateClient(clientData: ClientsInterface){

    console.log("cliente desde el page" , clientData);
    
    return this.clientService.createClient(clientData).subscribe({
      next: () => {
        console.log('Cliente registrado con éxito');
        this.presentToast('Cliente registrado con éxito');
        this.presentAlert('Cliente creado con éxito')
              
      
      },

      error: (err) => {
        this.presentAlert(`Error al registrar cliente. ${err.error.detail}.`);    
        this.presentToast(`Error al registrar cliente. ${err.error.detail}.`, 'danger');    
        console.error('Error al registrar cliente:', err)
      }
    })
  }


  cancelRegisterClient(){   
    this.statusDefault()    
  }

  // goToClientDetail(client: any){
  //   this.clienteSeleccionado = client;
  //   this.clientList = false;
  //   this.clientDetail = true;
  //   console.log('go to client detail', client);
  // }

  
  async openUpdateModal(client: any) {
    const modal = await this.modalCtrl.create({
      component: EditClientFormComponent,
      componentProps: {
        client: client
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    
    if (data) {
      this.onEditClient(client)
    }
  }
  
  
  
  onEditClient(client: any){
    console.log('Edit client from output:', client);    
    this.clientList = false;
    this.editClient = true;
    // let id = client.id;
    let data = {
      id: client.id,
      client_name: client.client_name,
      phone: client.phone,
      address: client.address,
      bank: client.bank,
      account_type: client.account_type,
      account_number: client.account_number
      
    } 

    // console.log( "esta es la data" ,data);
    

    this.clientup = data

  }


  updateClientData(clientData: any) {
    // console.log('Datos recibidos para actualizar:', clientData);
    
    // this.clientService.updateClient(clientData).subscribe(...);

    this.clientService.updateClient(clientData.id, clientData).subscribe({
      next: (response) => {
        // console.log('Cliente actualizado con éxito', response);
        this.presentAlert('Cliente actualizado con éxito', 'Exito');
        this.presentToast('Cliente actualizado con éxito');
        this.clientList = true;        
      },
      
      error: (error) => {
        console.log('Error al actualizar el cliente', error);
        this.presentAlert(`Error: ${error.error.detail}`, 'Error');
        this.presentToast('Error al actualizar el cliente', 'danger');
      }
        
      
    })
    
    // Volvemos al estado por defecto después de actualizar
    this.statusDefault();
  }



}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClientService } from '../../pages/clients/client.service';
import { ClientsInterface } from '../../interfaces/clients-interface';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton,
  IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonBadge, IonFab, IonFabButton, IonIcon} from "@ionic/angular/standalone";
import { CommonModule, NgClass } from '@angular/common';



@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss'],
  imports: [IonBadge, IonCardContent, IonButton, IonSpinner, IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonGrid, IonRow, IonCol, NgClass, CommonModule, IonFab, IonFabButton, IonIcon],
  
})
export class ClientsListComponent implements OnInit {

 
  clients: ClientsInterface[] = [];
  isLoading = false; 
  error: string | null = null;

  @Output() eliminarCliente = new EventEmitter<number>();
  @Output() getClientByName = new EventEmitter<string>();
  @Output() verDetalleCliente = new EventEmitter<any>();
  @Output() editClientOutput = new EventEmitter<any>();


  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.error = null;
    
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching clients', err);
        this.error = 'Error al cargar los clientes. Por favor intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  editClient(client: any){
    console.log('Edit client:', client);
    this.editClientOutput.emit(client);
    
  }

  onEliminar(client_id: number) {
    this.eliminarCliente.emit(client_id);
    

  }

  updateClientStatus(updatedClient: ClientsInterface) {
    // Busca el cliente en la lista y actualiza su estado
    const index = this.clients.findIndex(client => client.id === updatedClient.id);
    if (index !== -1) {
      this.clients[index] = updatedClient;
    }
  }

  onGetClientByName(client: any) {
    this.getClientByName.emit(client);
  }


  onVerDetalleCliente(client: any) {
    this.verDetalleCliente.emit(client);
  }




}
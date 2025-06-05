import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators  } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular'; 
import { LocacionesEnum } from "../../interfaces/locaciones-enum";
import { HttpClient, HttpParams } from '@angular/common/http';




import { Delivery, DeliveryStanding } from "../../interfaces/deliveries"
import { DeliveryService } from 'src/app/pages/deliveries/delivery.service';
import { ClientService } from 'src/app/pages/clients/client.service';
import { RidersInterface } from "../../interfaces/riders-interface";
import { ClientsInterface } from "../../interfaces/clients-interface";

@Component({
  selector: 'app-new-domi',
  templateUrl: './new-domi.component.html',
  styleUrls: ['./new-domi.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonicModule ],
})


export class NewDomiComponent  implements OnInit {

  @Output() formSubmit = new EventEmitter<Delivery>()

  riders: RidersInterface[] = [];
  clients: ClientsInterface[] = []

  estadosMapping = {
    [DeliveryStanding.PENDING]: 'Pendiente',
    [DeliveryStanding.IN_PROGRESS]: 'En progreso',
    [DeliveryStanding.DELIVERED]: 'Entregado',
    [DeliveryStanding.CANCELLED]: 'Cancelado'
    
  };

  domicilioForm!: FormGroup;

  estadosDisponibles = Object.values(DeliveryStanding);
  deliveries_locaitions = Object.values(LocacionesEnum);
 
  constructor(
    private formBuilder: FormBuilder,
    private deliveryService: DeliveryService,
    private clientService: ClientService,
    private cdr: ChangeDetectorRef, 
    private alertCtrl: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.initForm()
    this.getIdsRiders()
    this.getAllCLients()
    
  }


  private initForm(){
    this.domicilioForm = this.formBuilder.group({
    
      client_id: ['', Validators.required], 
      rider_id:  ["", ],
      package_name: ['', Validators.required], 
      receptor_name: ['', Validators.required], 
      receptor_number: ['', Validators.required], 
      delivery_enterprise_amount: ['', Validators.required], 
      delivery_total_amount: ['', Validators.required], 
      delivery_address: ["", Validators.required],
      delivery_location: [LocacionesEnum.MEDELLIN, Validators.required],
      delivery_comment: ["", ],
      state: [`${DeliveryStanding.PENDING}`, Validators.required], 


    }) 
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.domicilioForm.valid) {
      console.log('Formulario válido:', this.domicilioForm.value);
      this.formSubmit.emit(this.domicilioForm.value);
      // this.generateLabel(this.domicilioForm.value);
      // Resetear el formulario después de guardar
      this.domicilioForm.reset();
    } else {
      console.log('Formulario inválido');
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.domicilioForm.controls).forEach(key => {
        const control = this.domicilioForm.get(key);
        control!.markAsTouched();
      });
    }
  }

  // Método de utilidad para verificar si un campo es inválido
  isInvalid(controlName: string): boolean {
    const control = this.domicilioForm.get(controlName);
    return control!.invalid && (control!.dirty || control!.touched);
  }


  getIdsRiders() {
    this.deliveryService.getIdsRiders().subscribe({
      next: (resp) => {
        
        this.riders = resp;        
        this.cdr.detectChanges(); 

      },
      error: (err) => {
        console.error("error", err);
      }
    });
  }
  
  
  getAllCLients(){
    this.clientService.getAllClients().subscribe({
      next: (resp) => {
        this.clients = resp;
        this.cdr.detectChanges()
        
      },
      error: (err)=> {
        console.error("error", err);}
    })
  }




}

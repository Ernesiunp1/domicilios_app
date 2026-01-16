import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { RouterLink } from '@angular/router';
import { TypeAccount } from '../../interfaces/clients-interface';


import {  IonRouterLink, IonCard, IonCardSubtitle, IonIcon, IonNote,
  IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,  FormsModule,  ReactiveFormsModule, IonRouterLink,
    RouterLink, IonCard, IonCardSubtitle, IonIcon, IonNote, IonItem, IonLabel, 
    IonInput, IonButton, IonSelect, IonSelectOption
  ],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent {
  @Output() formSubmitted = new EventEmitter<any>();

  corriente = TypeAccount.CORRIENTE;
  ahorro = TypeAccount.AHORRO;

  clientForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      client_name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      address: ['', Validators.required],
      bank: ['', Validators.required],
      account_number: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      account_type: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.clientForm.valid) {
      this.formSubmitted.emit(this.clientForm.value);
      this.clientForm.reset()
    } else {
      this.clientForm.markAllAsTouched();
    }
  }
}

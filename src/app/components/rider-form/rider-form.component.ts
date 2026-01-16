import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RouterLink } from '@angular/router';

import { IonButton, IonLabel, IonItem, IonNote, IonIcon,  IonCard, IonCardSubtitle, IonInput
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-rider-form',
  standalone: true,
  imports: [IonNote, IonCardSubtitle, CommonModule, FormsModule, ReactiveFormsModule, RouterLink, 
            IonButton, CommonModule, IonItem, IonNote, IonLabel, IonIcon, IonCard, 
            IonCardSubtitle, RouterLink, IonCard, IonCardSubtitle, IonIcon, IonNote, IonItem, IonLabel, 
            IonInput,  IonButton ],
  templateUrl: './rider-form.component.html',
  styleUrls: ['./rider-form.component.scss']
})
export class RiderFormComponent {

  @Output() formSubmitted = new EventEmitter<any>();

  bikerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bikerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      plate: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.bikerForm.valid) {
      this.formSubmitted.emit(this.bikerForm.value);
      this.bikerForm.reset()
    } else {
      this.bikerForm.markAllAsTouched();
    }
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rider-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterLink],
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
    } else {
      this.bikerForm.markAllAsTouched();
    }
  }
}

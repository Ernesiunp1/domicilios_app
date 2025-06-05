import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { IonHeader, IonContent, IonToolbar, IonTitle, IonNote, IonItem,
   IonLabel, IonInput, IonButton, IonCard,  IonIcon, IonCardSubtitle,
   IonAlert, IonInputPasswordToggle } from "@ionic/angular/standalone";
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: 'login.page.html',
  imports: [IonCardSubtitle, IonIcon, IonCard, 
    IonInput, IonNote, IonHeader, IonContent, IonToolbar, IonTitle, 
    IonItem, IonLabel, IonButton, ReactiveFormsModule, NgIf, RouterLink, 
    IonAlert, IonInputPasswordToggle,
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;
  showErrorAlert = false;
  errorMessage: string = ""

  public alertButtons = [
    {
      text: 'OK',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.showErrorAlert = false;
      }
    }
  ];
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
    
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const { username, password } = this.loginForm.value;
    
    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
        this.presenloginToast('Bienvenido Login exitoso');
      },
      error: (err) => {
        this.error = 'Credenciales incorrectas';
        console.error('Error de login:', err);
        this.errorMessage = this.error
        this.showErrorAlert = true;

        
        this.loading = false;
      
      },
      complete: () => {
        this.loading = false;
      }
    });
  }



  async presenloginToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'success',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
  
    await toast.present();
  }
  
  

}
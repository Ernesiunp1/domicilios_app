import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router , RouterLink} from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
  IonItem, IonLabel, IonInput, IonButton, IonNote, IonIcon, IonCardSubtitle, 
  IonText, IonGrid, IonCol, IonRow, AlertController, IonToast, ToastController } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { RiderFormComponent } from 'src/app/components/rider-form/rider-form.component';
import { ClientFormComponent } from 'src/app/components/client-form/client-form.component';


@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  imports: [IonRow, IonCol, IonGrid,  IonCardSubtitle, IonIcon, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonItem, IonLabel, IonInput, IonButton, ReactiveFormsModule, NgIf, IonCard,
  RouterLink, RiderFormComponent, ClientFormComponent ]
})
export class RegisterPage {
  registerForm: FormGroup;
  selectedForm: 'rider' | 'client' | 'user' | null = "client";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertctrl: AlertController,
    private toastController: ToastController
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ¡Asegúrate de tener este método!
  // onSubmit() {
  //   if (this.registerForm.valid) {
  //     this.authService.register(this.registerForm.value).subscribe({
  //       next: () => {
  //         console.log('Registro exitoso!');
  //         this.router.navigate(['/login']); // Redirige al login tras registrar
  //       },
  //       error: (err) => console.error('Error en registro:', err)
  //     });
  //   }
  // }

  selectForm(value: any){
    this.selectedForm = value;
  }


  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      color: color,
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async presentAlert(errorMessage: string) {
    const alert = await this.alertctrl.create({
      header: 'Error',
      message: errorMessage,
      buttons: ['OK']
    });
    await alert.present();
  }


  onClientFormSubmit(data: any) {   
    
    this.authService.createClient(data).subscribe({     
      
      next: () => {
        console.log('Cliente registrado con éxito');
        this.presentToast('Cliente registrado con éxito');
        this.router.navigate(['/login']);      
      
      },

      error: (err) => {
        this.presentAlert(`Error al registrar cliente. ${err.error.detail}.`);    
        this.presentToast(`Error al registrar cliente. ${err.error.detail}.`, 'danger');    
        console.error('Error al registrar cliente:', err)
      }
    });
  }
  
    
  
  onRiderFormSubmit(data: any) {
    this.authService.createRider(data).subscribe({
      next: () => {
        console.log('Rider registrado con éxito');
        this.presentToast('Rider registrado con éxito');
        this.router.navigate(['/login']);
      },
     
      error: (err) => {
        this.presentAlert(`Error al registrar rider. ${err.error.detail}.`);
        this.presentToast(`Error al registrar rider. ${err.error.detail}.`, 'danger');      
        console.error('Error al registrar rider:', err)}
    });
  }




  onUserFormSubmit() {
    if (this.registerForm.valid) {
      console.log('Formulario de usuario válido:', this.registerForm.value);
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          console.log('Usuario registrado con éxito');
          this.presentToast('Usuario registrado con éxito');
          this.router.navigate(['/login']);
        },
        
        error: (err) => {
          
          this.presentAlert(`Error al registrar usuario. ${err.error.detail}.`);
          this.presentToast(`Error al registrar usuario. ${err.error.detail}.`, 'danger');
          console.error('Error al registrar usuario:', err);

        }
      });
    }
  }






}
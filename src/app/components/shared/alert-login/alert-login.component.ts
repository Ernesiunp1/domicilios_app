import { Component } from '@angular/core';
import { IonAlert, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'alert-login',
  templateUrl: './alert-login.component.html',
  styleUrls: ['./alert-login.component.scss'],
  standalone: true,
  imports: [IonAlert, IonButton],
})
export class AlertLoginComponent {
  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
    },
  ];
}
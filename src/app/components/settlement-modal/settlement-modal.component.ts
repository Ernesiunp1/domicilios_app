import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonToolbar, IonHeader, IonItem, IonButtons, IonButton, IonIcon, IonContent, IonLabel
  , IonFooter, IonRow, IonCol, IonTitle, IonTextarea,
 } from "@ionic/angular/standalone";

@Component({
  selector: 'app-settlement-modal',
  standalone: true,
  imports: [IonToolbar, CommonModule, FormsModule, IonHeader, IonItem, IonButtons, IonButton, 
    IonIcon, IonContent, IonLabel, IonFooter, IonRow, IonCol, IonTitle, IonTextarea],
  providers: [ModalController],
  templateUrl: './settlement-modal.component.html',
  styleUrls: ['./settlement-modal.component.scss'],})


  
export class SettlementModalComponent {
  riderName: string = '';
  paymentIds: number[] = [];
  totalAmount: number = 0;
  paymentCount: number = 0;
  comments: string = '';
  
  constructor(private modalCtrl: ModalController) {}
  
  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  
  confirm() {
    this.modalCtrl.dismiss({
      comments: this.comments
    }, 'confirm');
  }
}
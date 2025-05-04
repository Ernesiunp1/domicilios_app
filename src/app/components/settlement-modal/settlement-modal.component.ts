// settlement-modal.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-settlement-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
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
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonList, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons, IonCard, IonLabel, IonItem, IonButton, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/angular/standalone';
import { RidersService } from './riders.service';
import { Router, RouterLink } from '@angular/router';
import { RiderDetailsComponent } from 'src/app/components/rider-details/rider-details.component';

@Component({
  selector: 'app-riders',
  templateUrl: './riders.page.html',
  styleUrls: ['./riders.page.scss'],
  standalone: true,
  imports: [RiderDetailsComponent ,IonList, IonCardTitle, IonCardContent, IonCardHeader, IonButton, IonItem, IonLabel, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, 
    FormsModule, IonMenuButton, IonButtons, IonCard, IonLabel, IonItem, IonButton, IonCardHeader, 
    IonCardContent, RouterLink]
})
export class RidersPage implements OnInit {

  riders: any[] = [];

  constructor(
    private ridersService: RidersService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getRiders();
  }


  getRiders(){
    return this.ridersService.getRiders().subscribe({
      next: (response) => {
        console.log('Riders:', response.riders);
        this.riders = response.riders;
        console.log('arrogle de Riders:', this.riders);
        
        
      },
      error: (error) => {
        console.error('Error fetching riders:', error);
      },
    })
  }

}

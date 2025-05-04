import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})
export class MenuComponent implements OnInit, OnDestroy {
  
  isAuthenticated = false;
  private authSubscription: Subscription =  new Subscription();
  private router = inject(Router);
  private menuCtrl = inject(MenuController)


  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      isAuth => {
        this.isAuthenticated = isAuth;
      }
    );
  }

  ngOnDestroy() {
    
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  
  async navigateTo(page: string) {
    await this.menuCtrl.close(); // Cierra el menú primero
    this.router.navigate([page]); // Luego navega
  }

  handleSwipe(){
    this.menuCtrl.close();
  }


  OnlogOut(){
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
      },
      error: () => {
        console.error('Logout failed');
      }
    });   

  }

 



}
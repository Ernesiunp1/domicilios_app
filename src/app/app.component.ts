import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { eye, add, sync, closeCircleOutline, bicycleOutline, homeOutline, bagHandleOutline, carOutline,
  peopleOutline, cardOutline, idCardOutline, personOutline, logOut, logOutOutline, exit, walletOutline,
  addCircleOutline, search, chevronBack, eyeOutline, chevronForward, checkmarkDoneOutline,
  saveOutline, callOutline, refreshOutline, checkmarkDoneCircleOutline, closeOutline, 
  alertCircle, refresh, cash, close, person } from 'ionicons/icons';




  import { IonApp, IonRouterOutlet, IonMenuToggle,
        IonItem, IonIcon, IonLabel, 
        IonList, IonHeader, IonContent,
        IonMenu, IonToolbar, IonTitle, IonSplitPane, IonButtons, IonMenuButton, MenuController } from '@ionic/angular/standalone';
import { MenuComponent } from './components/menu/menu.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';



addIcons({
  'car-outline': carOutline,
  'bicycle-outline': bicycleOutline,
  'home-outline': homeOutline,
  'bag-handle-outline': bagHandleOutline,
  'people-outline': peopleOutline,
  'card-outline': cardOutline,
  'id-card-outline': idCardOutline,
  'person-outline': personOutline,
  'log-out-outline': logOutOutline,
  'exit': exit,
  'add-circle-outline': addCircleOutline,
  'close-circle-outline': closeCircleOutline,
  'search': search,
  'sync': sync,
  'add': add,
  'eye': eye,
  'chevron-back': chevronBack,
  'log-out': logOut,
  'add-circle': addCircleOutline,
  'chevron-back-outline': chevronBack,
  'eye-outline':eyeOutline,
  'chevron-forward': chevronForward,
  'save-outline': saveOutline,
  'refresh-outline': refreshOutline,
  'checkmark-done-outline': checkmarkDoneOutline,
  'checkmark-done-circle-outline': checkmarkDoneCircleOutline,
  "close-outline": closeOutline,
  "alert-circle": alertCircle,
  "call-outline": callOutline,
  "wallet-outline": walletOutline,
  "refresh": refresh,
  "cash": cash,
  "close": close,
  "person": person,
  "checkmark-done": checkmarkDoneOutline,
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonButtons, IonSplitPane, IonTitle, IonContent, 
            IonHeader, IonMenuButton, IonList,  IonLabel, 
            IonIcon, IonItem, IonApp, IonRouterOutlet,
            IonMenu, IonToolbar, RouterLink, IonMenuToggle, MenuComponent,
          ],
            
})


export class AppComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  private authSubscription: Subscription =  new Subscription();

  constructor( private authService: AuthService, ){}
  

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
  

  
  private menuCtrl = inject(MenuController);

  // Método para abrir el menú manualmente
  openMenu() {
    this.menuCtrl.open('main-content');
  }



}

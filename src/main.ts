import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { PLATFORM_ID } from '@angular/core';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { authInterceptor } from './app/auth/auth.interceptor';
import { withInterceptors } from '@angular/common/http';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    // provideHttpClient(),
    { 
      provide: PLATFORM_ID, 
      useValue: 'browser'
    },
    {
      provide: Storage,
      useFactory: () => {
        const storage = new Storage();
        storage.create(); // Asegúrate de llamar a create() aquí
        return storage;
      }
    },
  ],
});
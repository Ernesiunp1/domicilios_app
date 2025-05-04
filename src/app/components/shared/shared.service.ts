// shared.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private reloadDataSubject = new Subject<void>();
  
  reloadData$ = this.reloadDataSubject.asObservable();
  
  triggerReload() {
    this.reloadDataSubject.next();
  }
}
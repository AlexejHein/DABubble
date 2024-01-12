import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FocusService {
  private _focusMessageInput = new BehaviorSubject<void>(undefined);
  focusMessageInput$ = this._focusMessageInput.asObservable();

  triggerFocusMessageInput(): void {
    this._focusMessageInput.next();
  }
}

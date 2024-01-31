import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private _addMessageClick = new Subject<void>();

  addMessageClick$ = this._addMessageClick.asObservable();

  addMessageClicked() {
    this._addMessageClick.next();
  }
}

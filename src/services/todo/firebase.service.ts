import { Injectable, OnDestroy } from '@angular/core';
import { deleteApp, FirebaseApp, initializeApp } from '@firebase/app';
import { Firestore, getFirestore } from '@firebase/firestore';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService implements OnDestroy {

  private _app?: FirebaseApp | undefined;
  private _store?: Firestore | undefined;

  get app(): FirebaseApp {
    return this._app ||= initializeApp(
      environment.firebase.config,
      {
        name: 'quiz.todo-list.angular',
      }
    );
  }

  get store(): Firestore {
    return this._store ||= getFirestore(this.app);
  }

  ngOnDestroy(): void {
    if (this._app) {
      deleteApp(this._app).catch(error => console.error(error));
    }
  }

}

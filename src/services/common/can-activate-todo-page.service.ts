import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TodoFactory } from '../todo';

@Injectable({
  providedIn: 'root',
})
export class CanActivateTodoPage implements CanActivate {

  constructor(
    private readonly _router: Router,
    private readonly _todoFactory: TodoFactory,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree | true {

    const listUid = route.paramMap.get('list-uid');

    if (listUid && this._todoFactory.validateUid(listUid)) {
      return true;
    }

    const { uid } = this._todoFactory.createList();

    return this._router.createUrlTree(['/', uid]);
  }

}

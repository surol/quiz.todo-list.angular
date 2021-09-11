import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TODOService } from '../todo';

@Injectable({
  providedIn: 'root',
})
export class CanActivateTodoPage implements CanActivate {

  constructor(
    private readonly _router: Router,
    private readonly _todoService: TODOService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UrlTree | true {

    const listUid = route.paramMap.get('list-uid');

    if (listUid && this._todoService.validateUid(listUid)) {
      return true;
    }

    const { uid } = this._todoService.createList();

    return this._router.createUrlTree(['/', uid]);
  }

}

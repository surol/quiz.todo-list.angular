import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as UUIDv4, validate as validateUUID } from 'uuid';
import { TODOList } from './todo-list';
import { UpdateResult } from './update-result';

@Injectable({
  providedIn: 'root',
})
export class TODOService {

  private readonly _lists = new Map<string, TODOList>();

  validateUid(uid: string): boolean {
    return validateUUID(uid);
  }

  createList(
    {
      uid = UUIDv4(),
      name,
    }: {
      readonly uid?: string | undefined;
      readonly name?: string | undefined,
    } = {},
  ): TODOList {
    return {
      uid,
      rev: 0,
      name: name || `TODO ${uid}`,
      items: [],
    };
  }

  loadOrCreateList(uid: string): Observable<TODOList> {

    const list = this._lists.get(uid);

    return list ? of(list) : of(this.createList({ uid }));
  }

  storeList(
    list: TODOList,
    {
      overrideRev,
    }: {
      readonly overrideRev?: number | undefined;
    },
  ): Observable<UpdateResult<TODOList>> {
    return new Observable(subscriber => {

      const existing = this._lists.get(list.uid);

      if (existing && existing.rev !== overrideRev) {
        subscriber.next({
          type: 'conflict',
          proposedItem: list,
          conflictingItem: existing,
        });
      } else {
        subscriber.next({ type: 'ok' });
      }

      subscriber.complete();
    });
  }

}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TodoFactory } from './todo-factory';
import { TodoList } from './todo-list';
import { UpdateResult } from './update-result';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {

  private readonly _lists = new Map<string, TodoList>();

  constructor(private readonly _todoFactory: TodoFactory) {
  }

  loadOrCreateList(uid: string): Observable<TodoList> {

    const list = this._lists.get(uid);

    return list ? of(list) : of(this._todoFactory.createList({ uid }));
  }

  storeList(
    list: TodoList,
    {
      overrideRev = list.rev,
    }: {
      readonly overrideRev?: number | undefined;
    } = {},
  ): Observable<UpdateResult<TodoList>> {
    return new Observable(subscriber => {

      const existing = this._lists.get(list.uid);

      if (existing && existing.rev !== overrideRev) {
        subscriber.next({
          type: 'conflict',
          proposed: list,
          conflicting: existing,
        });
      } else {

        const updated: TodoList = { ...list, rev: overrideRev + 1 };

        this._lists.set(list.uid, updated)
        subscriber.next({ type: 'ok', updated });
      }

      subscriber.complete();
    });
  }

}

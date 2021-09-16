import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TodoFactory } from './todo-factory';
import { TodoList } from './todo-list';
import { UpdateResult } from './update-result';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {

  private static MAX_RECENT_LISTS = 7;

  private readonly _lists = new Map<string, TodoList>();
  private readonly _recent = new BehaviorSubject<TodoList[]>([]);

  constructor(private readonly _todoFactory: TodoFactory) {
  }

  recentLists(): Observable<TodoList[]> {
    return this._recent.asObservable();
  }

  loadOrCreateList(uid: string): Observable<TodoList> {

    const list = this._lists.get(uid);

    if (list) {
      this._putRecentList(list);

      return of(list);
    }

    return of(this._todoFactory.createList({ uid }));
  }

  storeList(
    list: TodoList,
    {
      overrideRev = list.rev,
    }: {
      readonly overrideRev?: number | undefined;
    } = {},
  ): Observable<UpdateResult<TodoList>> {
    this._putRecentList(list);

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

  private _putRecentList(mostRecent: TodoList) {

    const allRecent: TodoList[] = [
      mostRecent,
      ...this._recent.getValue().filter(list => list.uid !== mostRecent.uid),
    ];

    this._recent.next(allRecent.slice(0, TodoStore.MAX_RECENT_LISTS));
  }

}

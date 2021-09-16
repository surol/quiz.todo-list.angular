import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { TodoFactory } from './todo-factory';
import { TodoList } from './todo-list';
import { UpdateResult } from './update-result';

@Injectable({
  providedIn: 'root',
})
export class TodoStore implements OnDestroy {

  private static MAX_RECENT_LISTS = 7;
  private static RECENT_LISTS_KEY = 'recentTodoLists';

  private readonly _lists = new Map<string, TodoList>();
  private _recent?: BehaviorSubject<TodoList[]> | undefined;
  private subscription: Subscription;

  constructor(private readonly _todoFactory: TodoFactory) {
    this.subscription = Subscription.EMPTY;
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

  recentLists(): Observable<TodoList[]> {
    return this.recent.asObservable();
  }

  private get recent(): BehaviorSubject<TodoList[]> {
    if (!this._recent) {

      const serialized = localStorage.getItem(TodoStore.RECENT_LISTS_KEY);
      const allRecent: TodoList[] = serialized ? JSON.parse(serialized) : [];

      this._recent = new BehaviorSubject(allRecent);
      this.subscription = this._recent.subscribe(list => {
        localStorage.setItem(TodoStore.RECENT_LISTS_KEY, JSON.stringify(list));
      });
    }

    return this._recent;
  }

  private _putRecentList(mostRecent: TodoList): void {

    const allRecent: TodoList[] = [
      mostRecent,
      ...this.recent.getValue().filter(list => list.uid !== mostRecent.uid),
    ];

    this.recent.next(allRecent.slice(0, TodoStore.MAX_RECENT_LISTS));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

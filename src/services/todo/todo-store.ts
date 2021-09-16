import { Injectable, OnDestroy } from '@angular/core';
import { collection, CollectionReference, doc, DocumentReference, getDoc, runTransaction } from '@firebase/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import { TodoFactory } from './todo-factory';
import { TodoList } from './todo-list';
import { UpdateResult } from './update-result';

@Injectable({
  providedIn: 'root',
})
export class TodoStore implements OnDestroy {

  private static MAX_RECENT_LISTS = 7;
  private static RECENT_LISTS_KEY = 'recentTodoLists';

  private _recent?: BehaviorSubject<readonly TodoList[]> | undefined;
  private subscription: Subscription;

  constructor(
    private readonly _todoFactory: TodoFactory,
    private readonly _firebase: FirebaseService,
  ) {
    this.subscription = Subscription.EMPTY;
  }

  loadOrCreateList(uid: string): Observable<TodoList> {
    return new Observable(subscriber => {
      getDoc(this._docRef(uid))
        .then(snapshot => {
          if (snapshot.exists()) {

            const list = snapshot.data();

            subscriber.next(list)
            this._putRecentList(list);
          } else {
            subscriber.next(this._todoFactory.createList({ uid }));
          }

          subscriber.complete();
        })
        .catch(error => subscriber.error(error))
    });
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
      runTransaction(this._firebase.store, async tx => {

        const ref = this._docRef(list.uid);
        const doc = await tx.get(ref);

        if (doc.exists()) {

          const existing = doc.data();

          if (existing.rev !== overrideRev) {
            subscriber.next({
              type: 'conflict',
              proposed: list,
              conflicting: existing,
            });
            subscriber.complete();
            return;
          }
        }

        const updated: TodoList = { ...list, rev: overrideRev + 1 };

        tx.set(ref, updated)

        subscriber.next({ type: 'ok', updated });
        subscriber.complete();
      }).catch(error => {
        subscriber.error(error);
      });
    });
  }

  private get collection(): CollectionReference<TodoList> {
    return collection(this._firebase.store, 'todo-list') as CollectionReference<TodoList>;
  }

  private _docRef(uid: string): DocumentReference<TodoList> {
    return doc(this.collection, uid);
  }

  recentLists(): Observable<TodoList[]> {
    return this.recent.pipe(
      map(allRecent => allRecent.slice().sort(TodoList$compare)),
    );
  }

  private get recent(): BehaviorSubject<readonly TodoList[]> {
    if (!this._recent) {

      const serialized = localStorage.getItem(TodoStore.RECENT_LISTS_KEY);
      const allRecent: readonly TodoList[] = serialized ? JSON.parse(serialized) : [];

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

function TodoList$compare({ name: name1 }: TodoList, { name: name2 }: TodoList): number {
  return name1 < name2 ? -1 : (name1 > name2 ? 1 : 0);
}

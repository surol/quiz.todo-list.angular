import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { TodoList, TodoStore } from '../../services/todo';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss']
})
export class TodoPageComponent implements OnInit {

  list$!: Observable<TodoList>;
  private readonly _updatedList$ = new Subject<TodoList>();

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _todoStore: TodoStore,
  ) {
  }

  storeList(list: TodoList): void {
    this._todoStore.storeList(list).subscribe(result => {
      if (result.type === 'ok') {
        this._updatedList$.next(result.updated);
      }
    });
  }

  ngOnInit(): void {
    this.list$ = merge(
      this._route.params.pipe(
        switchMap(({ 'list-uid': uid }) => this._todoStore.loadOrCreateList(uid)),
      ),
      this._updatedList$,
    ).pipe(
      shareReplay(),
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, Subject } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { TODOList, TODOService } from '../../services/todo';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss']
})
export class TodoPageComponent implements OnInit {

  list$!: Observable<TODOList>;
  private readonly _updatedList$ = new Subject<TODOList>();

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _todoService: TODOService,
  ) {
  }

  storeList(list: TODOList): void {
    this._todoService.storeList(list).subscribe(result => {
      if (result.type === 'ok') {
        this._updatedList$.next(result.updated);
      }
    });
  }

  ngOnInit(): void {
    this.list$ = merge(
      this._route.params.pipe(
        switchMap(({ 'list-uid': uid }) => this._todoService.loadOrCreateList(uid)),
      ),
      this._updatedList$,
    ).pipe(
      shareReplay(),
    );
  }

}

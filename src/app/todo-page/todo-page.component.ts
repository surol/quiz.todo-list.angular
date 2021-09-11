import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { TODOList, TODOService } from '../../services/todo';

@Component({
  selector: 'app-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss']
})
export class TodoPageComponent implements OnInit {

  list$!: Observable<TODOList>;

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _todoService: TODOService,
  ) {
  }

  ngOnInit(): void {
    this.list$ = this._route.params.pipe(
      switchMap(({ 'list-uid': uid }) => this._todoService.loadOrCreateList(uid)),
      shareReplay(),
    );
  }

}

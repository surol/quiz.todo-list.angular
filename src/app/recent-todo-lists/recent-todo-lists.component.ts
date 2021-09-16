import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoList, TodoStore } from '../../services/todo';

@Component({
  selector: 'app-recent-todo-lists',
  templateUrl: './recent-todo-lists.component.html',
  styleUrls: ['./recent-todo-lists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentTodoListsComponent implements OnInit {

  recentLists$!: Observable<readonly TodoList[]>;

  constructor(
    private readonly _todoStore: TodoStore,
  ) {
  }

  ngOnInit(): void {
    this.recentLists$ = this._todoStore.recentLists();
  }

  listUid(_index: number, { uid }: TodoList): string {
    return uid;
  }

}

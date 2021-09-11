import { Component, Input } from '@angular/core';
import { TODOItem, TODOList, TODOService } from '../../services/todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {

  @Input()
  list?: TODOList | null | undefined;

  constructor(private readonly _todoService: TODOService) {
  }

  itemUid(_index: number, item: TODOItem): string {
    return item.uid;
  }

}

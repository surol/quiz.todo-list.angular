import { TodoItemStatus } from './todo-item-status';

export interface TodoItem {

  readonly uid: string;

  readonly status: TodoItemStatus;

  readonly description: string;

}

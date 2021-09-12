import { TodoItem } from './todo-item';

export interface TodoList {

  readonly uid: string;

  readonly rev: number;

  readonly name: string;

  readonly items: readonly TodoItem[];

}

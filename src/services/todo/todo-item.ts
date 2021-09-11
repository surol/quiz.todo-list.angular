import { TODOItemStatus } from './todo-item-status';

export interface TODOItem {

  readonly uid: string;

  readonly status: TODOItemStatus;

  readonly description: string;

}

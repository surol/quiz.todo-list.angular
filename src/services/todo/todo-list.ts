import { TODOItem } from './todo-item';

export interface TODOList {

  readonly uid: string;

  readonly rev: number;

  readonly name: string;

  readonly items: readonly TODOItem[];

}

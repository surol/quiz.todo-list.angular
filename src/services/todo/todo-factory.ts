import { Injectable } from '@angular/core';
import { v4 as UUIDv4, validate as validateUUID } from 'uuid';
import { TodoItem } from './todo-item';
import { TodoItemStatus } from './todo-item-status';
import { TodoList } from './todo-list';

@Injectable({
  providedIn: 'root',
})
export class TodoFactory {

  validateUid(uid: string): boolean {
    return validateUUID(uid);
  }

  createList(
    {
      uid = UUIDv4(),
      name,
    }: {
      readonly uid?: string | undefined;
      readonly name?: string | undefined,
    } = {},
  ): TodoList {
    return {
      uid,
      rev: 0,
      name: name || `TODO ${uid}`,
      items: [],
    };
  }

  createItem(
    {
      uid = UUIDv4(),
      status = TodoItemStatus.Pending,
      description = '',
    }: Partial<TodoItem> = {}
  ): TodoItem {
    return {
      uid,
      status,
      description,
    }
  }

}

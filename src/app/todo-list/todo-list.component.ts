import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TodoItem, TodoList } from '../../services/todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {

  private _list?: TodoList | null | undefined;

  @Output()
  listChange = new EventEmitter<TodoList>();

  readonly nameControl: FormControl;

  constructor(private readonly _changeDetector: ChangeDetectorRef) {
    this.nameControl = new FormControl(
      { value: '', disabled: true },
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(144),
      ],
    );
  }

  @Input()
  get list(): TodoList | null | undefined {
    return this._list;
  }

  set list(value: TodoList | null | undefined) {
    this._list = value;
    this.nameControl.setValue(value?.name, { onlySelf: true, emitEvent: false });
    this._changeDetector.markForCheck();
  }

  editName(element: HTMLInputElement): void {
    if (this.list && !this.nameControl.enabled) {
      this.nameControl.enable({ onlySelf: true, emitEvent: false });
      element.focus();
      element.select();
      this._changeDetector.markForCheck();
    }
  }

  updateName(): void {
    if (this.list && this.nameControl.enabled && this.nameControl.valid) {

      const name = this.nameControl.value;

      this.nameControl.disable({ onlySelf: true, emitEvent: false });
      this.listChange.next({ ...this.list, name: name });
      this._changeDetector.markForCheck();
    }
  }

  submitName(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.updateName();
    }
  }

  updateItem(index: number, item: TodoItem | null): void {
    if (this.list) {

      const items = this.list.items.slice();

      if (item) {
        items[index] = item;
      } else {
        items.splice(index, 1);
      }

      this.listChange.next({ ...this.list, items })
    }
  }

  itemUid(_index: number, item: TodoItem): string {
    return item.uid;
  }

}

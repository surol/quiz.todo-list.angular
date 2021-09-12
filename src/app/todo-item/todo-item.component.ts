import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TodoFactory, TodoItem, TodoItemStatus } from '../../services/todo';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {

  @Input()
  label!: string;

  private _item?: TodoItem;

  @Output()
  readonly itemChange = new EventEmitter<TodoItem | null>();

  readonly descriptionControl: FormControl;
  readonly doneControl: FormControl;

  constructor(private readonly _todoFactory: TodoFactory, private readonly _changeDetector: ChangeDetectorRef) {
    this.descriptionControl = new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(144),
      ],
    );
    this.doneControl = new FormControl();
    this._resetEdit();
  }

  @Input()
  get item(): TodoItem | undefined {
    return this._item;
  }

  set item(value: TodoItem | undefined) {
    this._item = value;

    if (value) {
      this.descriptionControl.setValue(value.description, { onlySelf: true });
      this.doneControl.setValue(value.status === TodoItemStatus.Done, { onlySelf: true });
    }

    this._resetEdit();
  }

  editDescription(element: HTMLInputElement): void {
    if (!this.descriptionControl.enabled) {
      this.descriptionControl.enable({ onlySelf: true, emitEvent: false });
      this.doneControl.disable({ onlySelf: true, emitEvent: false });
      element.focus();
      element.select();
      this._changeDetector.markForCheck();
    }
  }

  submitDescription(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.updateItem();
    }
  }

  private _resetEdit(): void {
    if (this._item) {
      this.descriptionControl.disable({ onlySelf: true, emitEvent: false });
      this.doneControl.enable({ onlySelf: true, emitEvent: false });
    } else {
      this.descriptionControl.enable({ onlySelf: true, emitEvent: false });
      this.doneControl.disable({ onlySelf: true, emitEvent: false });
    }
    this._changeDetector.markForCheck();
  }

  updateItem(): void {
    if (this.descriptionControl.enabled && this.descriptionControl.valid) {

      const isNewItem = !this._item;
      const { item = this._todoFactory.createItem() } = this;

      this.itemChange.next({
        ...item,
        status: this.doneControl.value ? TodoItemStatus.Done : TodoItemStatus.Pending,
        description: this.descriptionControl.value,
      });

      if (isNewItem) {
        this.item = undefined;
        this.descriptionControl.setValue('', { onlySelf: true, emitEvent: false });
      }

      this._resetEdit();
    }
  }

  removeItem(): void {
    this.itemChange.next(null);
  }

}

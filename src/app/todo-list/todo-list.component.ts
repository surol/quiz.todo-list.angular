import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TODOItem, TODOList, TODOService } from '../../services/todo';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {

  private _list?: TODOList | null | undefined;

  @Output()
  listChange = new EventEmitter<TODOList>();

  readonly nameInput: FormControl;

  constructor(private readonly _todoService: TODOService, private readonly _changeDetector: ChangeDetectorRef) {
    this.nameInput = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.nameInput.disable();
  }

  @Input()
  get list(): TODOList | null | undefined {
    return this._list;
  }

  set list(value: TODOList | null | undefined) {
    this._list = value;
    this.nameInput.setValue(value?.name || '');
  }

  editName(element: HTMLInputElement): void {
    if (this.list && !this.nameInput.enabled) {
      this.nameInput.enable();
      element.focus();
      element.select();
      this._changeDetector.markForCheck();
    }
  }

  updateName(): void {
    if (this.list && this.nameInput.enabled && this.nameInput.valid) {

      const name = this.nameInput.value;

      this.nameInput.disable();
      this._changeDetector.markForCheck();
      this.listChange.next({ ...this.list, name: name });
    }
  }

  itemUid(_index: number, item: TODOItem): string {
    return item.uid;
  }

}

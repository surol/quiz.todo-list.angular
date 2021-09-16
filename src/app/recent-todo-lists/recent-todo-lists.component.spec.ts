import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTodoListsComponent } from './recent-todo-lists.component';

describe('RecentTodoListsComponent', () => {
  let component: RecentTodoListsComponent;
  let fixture: ComponentFixture<RecentTodoListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentTodoListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentTodoListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

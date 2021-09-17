import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateTodoPage } from '../services/common';
import { TodoPageComponent } from './todo-page/todo-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: TodoPageComponent, canActivate: [CanActivateTodoPage] },
  { path: ':list-uid', component: TodoPageComponent, canActivate: [CanActivateTodoPage] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

# Quiz: TODO List

Implement TODO list with the following features:

1. Use Angular 9 and up
2. Data should be stored in firebase. (https://firebase.google.com/)
3. Application should support storing multiple “todo lists” identified by unique key.
4. Opening the application main page should create a new todo list that could be shared by
   URL. I.E http://example.com/<unique-key> or http://example.com/#<unique-key>
5. Application should support simultaneous todo list access for multiple users:
   a. user having access URL should be able to view/edit corresponding todo list,
   b. saving TODO list should check whether it has been changed by another user. If
   there are any changes in parallel sessions detected the application should show
   a dialog asking users to choose recovery strategy (e.g. loading server
   state/overwriting)
6. Publish to GitHub and provide a Readme file with build/install/run instructions.

It will be great if you (required for Senior level):

1. Add merge recovery strategy
2. Implement offline mode support
3. Implement authentication (with secure firebase access control)
4. Improvise. Anything that shows the level of your skill will be appreciated, from small
   tricks to major architectural decisions. But, of course, don’t push too hard»

## Implementation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

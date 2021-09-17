import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorDisplayService {

  constructor(private readonly _snackBar: MatSnackBar) {
  }

  displayError(
    {
      message,
      reason,
      duration = 3000,
      dismissal = 'Dismiss',
    }: {
      message: string;
      reason: unknown,
      duration?: number;
      dismissal?: string;
    }) {
    console.error(message, reason);
    this._snackBar.open(
      `${message}. ${reason}`,
      dismissal,
      {
        duration,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      },
    );
  }

}

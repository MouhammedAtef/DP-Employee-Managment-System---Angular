import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-confirm-dialoge',
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule],
  templateUrl: './confirm-dialoge.component.html',
  styleUrl: './confirm-dialoge.component.css'
})
export class ConfirmDialogeComponent {
   constructor(
    public dialogRef: MatDialogRef<ConfirmDialogeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Faculty {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-faculty-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-modal.component.html',
  styleUrls: ['./faculty-modal.component.css']
})
export class FacultyModalComponent {
  @Input() faculty: Faculty = { id: 0, nombre: '' };
  @Input() isEditMode = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveFaculty = new EventEmitter<Faculty>();

  onClose() {
    this.closeModal.emit();
  }

  onSave() {
    this.saveFaculty.emit(this.faculty);
  }
}

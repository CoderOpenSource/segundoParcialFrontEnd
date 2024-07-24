import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Departamento {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-departamento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departamento-modal.component.html',
  styleUrls: ['./departamento-modal.component.css']
})
export class DepartamentoModalComponent implements OnInit {
  @Input() departamento: Departamento = { id: 0, nombre: '' };
  @Input() isEditMode = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveDepartamento = new EventEmitter<Departamento>();

  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
  }

  onClose() {
    this.closeModal.emit();
  }

  onSave() {
    this.saveDepartamento.emit(this.departamento);
  }
}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EstadoAsistencia {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-estado-asistencia-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estado-asistencia-modal.component.html',
  styleUrls: ['./estado-asistencia-modal.component.css']
})
export class EstadoAsistenciaModalComponent implements OnInit {
  @Input() estadoAsistencia: EstadoAsistencia = { id: 0, nombre: '' };
  @Input() isEditMode = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveEstadoAsistencia = new EventEmitter<EstadoAsistencia>();

  toastMessage: string | null = null;
  toastClass: string = '';

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
    this.saveEstadoAsistencia.emit(this.estadoAsistencia);
  }
}

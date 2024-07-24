import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Facultad {
  id: number;
  nombre: string;
}

interface Aula {
  id: number;
  nombre: string;
  latitud: number;
  longitud: number;
  facultadId: number | null;
}

@Component({
  selector: 'app-aula-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aula-modal.component.html',
  styleUrls: ['./aula-modal.component.css']
})
export class AulaModalComponent implements OnInit {
  @Input() aula: Aula = {
    id: 0,
    nombre: '',
    latitud: 0,
    longitud: 0,
    facultadId: null
  };
  @Input() facultades: Facultad[] = [];
  @Input() isEditMode = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveAula = new EventEmitter<Aula>();

  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Cargar facultades en el componente principal, no es necesario cargar aquí.
  }

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
    this.saveAula.emit(this.aula);
  }
}

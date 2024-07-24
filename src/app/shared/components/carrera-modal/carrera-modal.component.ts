import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Facultad {
  id: number;
  nombre: string;
}

interface Carrera {
  id: number;
  nombre: string;
  codigo: string;
  facultad: {
    id: number | null;
    nombre: string;
  };
}

@Component({
  selector: 'app-carrera-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrera-modal.component.html',
  styleUrls: ['./carrera-modal.component.css']
})
export class CarreraModalComponent implements OnInit {
  @Input() carrera: Carrera = {
    id: 0,
    nombre: '',
    codigo: '',
    facultad: {
      id: null,
      nombre: ''
    }
  };
  @Input() isEditMode = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveCarrera = new EventEmitter<Carrera>();
  @Output() carreraCreatedOrUpdated = new EventEmitter<void>();

  facultades: Facultad[] = [];
  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFacultades();
    if (!this.isEditMode) {
      this.carrera.facultad.id = null;
    }
  }

  loadFacultades() {
    this.http.get<Facultad[]>('http://68.183.146.53/facultades/').subscribe(
      data => {
        this.facultades = data;
      },
      error => {
        console.error('Error loading facultades', error);
      }
    );
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
    this.saveCarrera.emit(this.carrera);
  }
}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Facultad {
  id: number;
  nombre: string;
}

interface Carrera {
  id: number | null;
  nombre: string;
}

interface Materia {
  id: number;
  nombre: string;
  creditos: number;
  carrera: Carrera;
}

@Component({
  selector: 'app-materia-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materia-modal.component.html',
  styleUrls: ['./materia-modal.component.css']
})
export class MateriaModalComponent implements OnInit {
  @Input() materia: Materia = {
    id: 0,
    nombre: '',
    creditos: 0,
    carrera: {
      id: null,  // Asegúrate de que sea null por defecto
      nombre: ''
    }
  };
  @Input() isEditMode = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveMateria = new EventEmitter<Materia>();

  carreras: Carrera[] = [];
  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCarreras();
    if (!this.isEditMode) {
      this.materia = {
        id: 0,
        nombre: '',
        creditos: 0,
        carrera: {
          id: null,
          nombre: ''
        }
      };
    }
  }

  loadCarreras() {
    this.http.get<Carrera[]>('http://68.183.146.53/carreras/').subscribe(
      data => {
        this.carreras = data;
      },
      error => {
        console.error('Error loading carreras', error);
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
    this.saveMateria.emit(this.materia);
  }
}

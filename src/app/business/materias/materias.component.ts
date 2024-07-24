import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MateriaModalComponent } from '../../shared/components/materia-modal/materia-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

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
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, FormsModule, MateriaModalComponent, ConfirmModalComponent],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit {
  materias: Materia[] = [];
  selectedMateria: Materia = {
    id: 0,
    nombre: '',
    creditos: 0,
    carrera: {
      id: 0,
      nombre: ''
    }
  };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  materiaIdToDelete: number | null = null;
  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMaterias();
  }

  loadMaterias() {
    this.http.get<Materia[]>('http://68.183.146.53/materias/').subscribe(
      data => {
        this.materias = data;
      },
      error => {
        console.error('Error loading materias', error);
      }
    );
  }

  editMateria(materiaId: number) {
    this.selectedMateria = this.materias.find(materia => materia.id === materiaId) || this.selectedMateria;
    this.isEditMode = true;
    this.showModal = true;
  }

  addMateria() {
    this.selectedMateria = {
      id: 0,
      nombre: '',
      creditos: 0,
      carrera: {
        id: 0,
        nombre: ''
      }
    };
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(materiaId: number) {
    this.materiaIdToDelete = materiaId;
    this.showConfirmModal = true;
  }

  deleteMateria() {
    if (this.materiaIdToDelete !== null) {
      this.http.delete(`http://68.183.146.53/materias/${this.materiaIdToDelete}`).subscribe(
        () => {
          this.showToast('Materia eliminada con éxito', 'success');
          this.loadMaterias(); // Recargar la lista de materias después de eliminar
          this.materiaIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar la materia', 'error');
          console.error('Error deleting materia', error);
        }
      );
    }
  }

  cancelDelete() {
    this.materiaIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveMateria(materia: Materia) {
    if (this.isEditMode) {
      // Lógica para actualizar la materia
      this.http.put<Materia>(`http://68.183.146.53/materias/${materia.id}`, materia).subscribe(
        response => {
          this.showToast('Materia actualizada con éxito', 'success');
          this.loadMaterias(); // Recargar la lista de materias
        },
        error => {
          this.showToast('Error al actualizar la materia', 'error');
          console.error('Error updating materia', error);
        }
      );
    } else {
      // Lógica para crear una nueva materia
      this.http.post<Materia>('http://68.183.146.53/materias/', materia).subscribe(
        response => {
          this.showToast('Materia creada con éxito', 'success');
          this.loadMaterias(); // Recargar la lista de materias
        },
        error => {
          this.showToast('Error al crear la materia', 'error');
          console.error('Error creating materia', error);
        }
      );
    }
    this.handleCloseModal();
  }

  handleCloseModal() {
    this.showModal = false;
  }

  handleCloseConfirmModal() {
    this.showConfirmModal = false;
  }

  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
  }
}

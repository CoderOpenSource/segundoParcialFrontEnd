import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarreraModalComponent } from '../../shared/components/carrera-modal/carrera-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

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
  selector: 'app-carreras',
  standalone: true,
  imports: [CommonModule, FormsModule, CarreraModalComponent, ConfirmModalComponent],
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit {
  carreras: Carrera[] = [];
  selectedCarrera: Carrera = { id: 0, nombre: '', codigo: '', facultad: { id: null, nombre: '' } };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  carreraIdToDelete: number | null = null;
  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCarreras();
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

  editCarrera(carreraId: number) {
    this.selectedCarrera = this.carreras.find(carrera => carrera.id === carreraId) || this.selectedCarrera;
    this.isEditMode = true;
    this.showModal = true;
  }

  addCarrera() {
    this.selectedCarrera = { id: 0, nombre: '', codigo: '', facultad: { id: null, nombre: '' } };
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(carreraId: number) {
    this.carreraIdToDelete = carreraId;
    this.showConfirmModal = true;
  }

  deleteCarrera() {
    if (this.carreraIdToDelete !== null) {
      this.http.delete(`http://68.183.146.53/carreras/${this.carreraIdToDelete}`).subscribe(
        () => {
          this.showToast('Carrera eliminada con éxito', 'success');
          this.loadCarreras(); // Recargar la lista de carreras después de eliminar
          this.carreraIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar la carrera', 'error');
          console.error('Error deleting carrera', error);
        }
      );
    }
  }

  cancelDelete() {
    this.carreraIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveCarrera(carrera: Carrera) {
    if (this.isEditMode) {
      // Lógica para actualizar la carrera
      this.http.put<Carrera>(`http://68.183.146.53/carreras/${carrera.id}`, carrera).subscribe(
        response => {
          this.showToast('Carrera actualizada con éxito', 'success');
          this.loadCarreras(); // Recargar la lista de carreras

        },
        error => {
          this.showToast('Error al actualizar la carrera', 'error');
          console.error('Error updating carrera', error);
        }
      );
    } else {
      // Lógica para crear una nueva carrera
      this.http.post<Carrera>('http://68.183.146.53/carreras/', carrera).subscribe(
        response => {
          this.showToast('Carrera creada con éxito', 'success');
          this.loadCarreras(); // Recargar la lista de carreras
        },
        error => {
          this.showToast('Error al crear la carrera', 'error');
          console.error('Error creating carrera', error);
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

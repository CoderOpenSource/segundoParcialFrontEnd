import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SesionClaseModalComponent } from '../../shared/components/sesion-clase-modal/sesion-clase-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

interface SesionClase {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-sesion-clase',
  standalone: true,
  imports: [CommonModule, FormsModule, SesionClaseModalComponent, ConfirmModalComponent],
  templateUrl: './sesion-clase.component.html',
  styleUrls: ['./sesion-clase.component.css']
})
export class SesionClaseComponent implements OnInit {
  sesionesClase: SesionClase[] = [];
  selectedSesionClase: SesionClase = {
    id: 0,
    diaSemana: '',
    horaInicio: '',
    horaFin: ''
  };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  toastMessage: string | null = null;
  toastClass: string = '';
  sesionClaseIdToDelete: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSesionesClase();
  }

  loadSesionesClase() {
    this.http.get<SesionClase[]>('http://68.183.146.53/sesionesclase/').subscribe(
      data => {
        this.sesionesClase = data;
      },
      error => {
        console.error('Error loading sesiones de clase', error);
      }
    );
  }

  editSesionClase(sesionClaseId: number) {
    this.selectedSesionClase = this.sesionesClase.find(sesionClase => sesionClase.id === sesionClaseId) || this.selectedSesionClase;
    this.isEditMode = true;
    this.showModal = true;
  }

  addSesionClase() {
    this.selectedSesionClase = {
      id: 0,
      diaSemana: '',
      horaInicio: '',
      horaFin: ''
    };
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(sesionClaseId: number) {
    this.sesionClaseIdToDelete = sesionClaseId;
    this.showConfirmModal = true;
  }

  deleteSesionClase() {
    if (this.sesionClaseIdToDelete !== null) {
      this.http.delete(`http://68.183.146.53/sesionesclase/${this.sesionClaseIdToDelete}`).subscribe(
        () => {
          this.showToast('Sesión de clase eliminada con éxito', 'success');
          this.loadSesionesClase(); // Recargar la lista de sesiones de clase después de eliminar
          this.sesionClaseIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar la sesión de clase', 'error');
          console.error('Error deleting sesion de clase', error);
        }
      );
    }
  }

  cancelDelete() {
    this.sesionClaseIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveSesionClase(sesionClase: SesionClase) {
    if (this.isEditMode) {
      // Lógica para actualizar la sesión de clase
      this.http.put<SesionClase>(`http://68.183.146.53/sesionesclase/${sesionClase.id}`, sesionClase).subscribe(
        response => {
          this.showToast('Sesión de clase actualizada con éxito', 'success');
          this.loadSesionesClase(); // Recargar la lista de sesiones de clase
        },
        error => {
          this.showToast('Error al actualizar la sesión de clase', 'error');
          console.error('Error updating sesion de clase', error);
        }
      );
    } else {
      // Lógica para crear una nueva sesión de clase
      this.http.post<SesionClase>('http://68.183.146.53/sesionesclase/', sesionClase).subscribe(
        response => {
          this.showToast('Sesión de clase creada con éxito', 'success');
          this.loadSesionesClase(); // Recargar la lista de sesiones de clase
        },
        error => {
          this.showToast('Error al crear la sesión de clase', 'error');
          console.error('Error creating sesion de clase', error);
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

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoAsistenciaModalComponent } from '../../shared/components/estado-asistencia-modal/estado-asistencia-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

interface EstadoAsistencia {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-estado-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, EstadoAsistenciaModalComponent, ConfirmModalComponent],
  templateUrl: './estado-asistencia.component.html',
  styleUrls: ['./estado-asistencia.component.css']
})
export class EstadoAsistenciaComponent implements OnInit {
  estadosAsistencia: EstadoAsistencia[] = [];
  selectedEstadoAsistencia: EstadoAsistencia = { id: 0, nombre: '' };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  toastMessage: string | null = null;
  toastClass: string = '';
  estadoAsistenciaIdToDelete: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEstadosAsistencia();
  }

  loadEstadosAsistencia() {
    this.http.get<EstadoAsistencia[]>('http://68.183.146.53/estadosasistencia/').subscribe(
      data => {
        this.estadosAsistencia = data;
      },
      error => {
        console.error('Error loading estados asistencia', error);
      }
    );
  }

  editEstadoAsistencia(estadoAsistenciaId: number) {
    this.selectedEstadoAsistencia = this.estadosAsistencia.find(estado => estado.id === estadoAsistenciaId) || this.selectedEstadoAsistencia;
    this.isEditMode = true;
    this.showModal = true;
  }

  addEstadoAsistencia() {
    this.selectedEstadoAsistencia = { id: 0, nombre: '' };
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(estadoAsistenciaId: number) {
    this.estadoAsistenciaIdToDelete = estadoAsistenciaId;
    this.showConfirmModal = true;
  }

  deleteEstadoAsistencia() {
    if (this.estadoAsistenciaIdToDelete !== null) {
      this.http.delete(`http://68.183.146.53/estadosasistencia/${this.estadoAsistenciaIdToDelete}`).subscribe(
        () => {
          this.showToast('Estado de Asistencia eliminado con éxito', 'success');
          this.loadEstadosAsistencia(); // Recargar la lista de estados de asistencia después de eliminar
          this.estadoAsistenciaIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar el Estado de Asistencia', 'error');
          console.error('Error deleting estado asistencia', error);
        }
      );
    }
  }

  cancelDelete() {
    this.estadoAsistenciaIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveEstadoAsistencia(estadoAsistencia: EstadoAsistencia) {
    if (this.isEditMode) {
      this.http.put<EstadoAsistencia>(`http://68.183.146.53/estadosasistencia/${estadoAsistencia.id}`, estadoAsistencia).subscribe(
        response => {
          this.showToast('Estado de Asistencia actualizado con éxito', 'success');
          this.loadEstadosAsistencia();
        },
        error => {
          this.showToast('Error al actualizar el Estado de Asistencia', 'error');
          console.error('Error updating estado asistencia', error);
        }
      );
    } else {
      this.http.post<EstadoAsistencia>('http://68.183.146.53/estadosasistencia/', estadoAsistencia).subscribe(
        response => {
          this.showToast('Estado de Asistencia creado con éxito', 'success');
          this.loadEstadosAsistencia();
        },
        error => {
          this.showToast('Error al crear el Estado de Asistencia', 'error');
          console.error('Error creating estado asistencia', error);
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

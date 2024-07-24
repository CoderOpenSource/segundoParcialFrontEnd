import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartamentoModalComponent } from '../../shared/components/departamento-modal/departamento-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

interface Departamento {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule, DepartamentoModalComponent, ConfirmModalComponent],
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent implements OnInit {
  departamentos: Departamento[] = [];
  selectedDepartamento: Departamento = { id: 0, nombre: '' };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  departamentoIdToDelete: number | null = null;
  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDepartamentos();
  }

  loadDepartamentos() {
    this.http.get<Departamento[]>('http://68.183.146.53/departamentos/').subscribe(
      data => {
        this.departamentos = data;
      },
      error => {
        console.error('Error loading departamentos', error);
      }
    );
  }

  editDepartamento(departamentoId: number) {
    this.selectedDepartamento = this.departamentos.find(departamento => departamento.id === departamentoId) || this.selectedDepartamento;
    this.isEditMode = true;
    this.showModal = true;
  }

  addDepartamento() {
    this.selectedDepartamento = { id: 0, nombre: '' };
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(departamentoId: number) {
    this.departamentoIdToDelete = departamentoId;
    this.showConfirmModal = true;
  }

  deleteDepartamento() {
    if (this.departamentoIdToDelete !== null) {
      this.http.delete(`http://68.183.146.53/departamentos/${this.departamentoIdToDelete}`).subscribe(
        () => {
          this.showToast('Departamento eliminado con éxito', 'success');
          this.loadDepartamentos(); // Recargar la lista de departamentos después de eliminar
          this.departamentoIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar el departamento', 'error');
          console.error('Error deleting departamento', error);
        }
      );
    }
  }

  cancelDelete() {
    this.departamentoIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveDepartamento(departamento: Departamento) {
    if (this.isEditMode) {
      // Lógica para actualizar el departamento
      this.http.put<Departamento>(`http://68.183.146.53/departamentos/${departamento.id}`, departamento).subscribe(
        response => {
          this.showToast('Departamento actualizado con éxito', 'success');
          this.loadDepartamentos(); // Recargar la lista de departamentos
        },
        error => {
          this.showToast('Error al actualizar el departamento', 'error');
          console.error('Error updating departamento', error);
        }
      );
    } else {
      // Lógica para crear un nuevo departamento
      this.http.post<Departamento>('http://68.183.146.53/departamentos/', departamento).subscribe(
        response => {
          this.showToast('Departamento creado con éxito', 'success');
          this.loadDepartamentos(); // Recargar la lista de departamentos
        },
        error => {
          this.showToast('Error al crear el departamento', 'error');
          console.error('Error creating departamento', error);
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

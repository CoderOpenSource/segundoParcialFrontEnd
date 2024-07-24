import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyModalComponent } from '../../shared/components/faculty-modal/faculty-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

interface Faculty {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, FormsModule, FacultyModalComponent, ConfirmModalComponent],
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.css']
})
export class FacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  selectedFaculty: Faculty = { id: 0, nombre: '' };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  facultyIdToDelete: number | null = null;
  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFaculties();
  }

  loadFaculties() {
    this.http.get<Faculty[]>('http://68.183.146.53/facultades/').subscribe(
      data => {
        this.faculties = data;
      },
      error => {
        console.error('Error loading faculties', error);
      }
    );
  }

  editFaculty(facultyId: number) {
    this.selectedFaculty = this.faculties.find(faculty => faculty.id === facultyId) || this.selectedFaculty;
    this.isEditMode = true;
    this.showModal = true;
  }

  addFaculty() {
    this.selectedFaculty = { id: 0, nombre: '' };
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(facultyId: number) {
    this.facultyIdToDelete = facultyId;
    this.showConfirmModal = true;
  }

  deleteFaculty() {
    if (this.facultyIdToDelete !== null) {
      this.http.delete(`http://68.183.146.53/facultades/${this.facultyIdToDelete}`).subscribe(
        () => {
          this.showToast('Facultad eliminada con éxito', 'success');
          this.loadFaculties(); // Recargar la lista de facultades después de eliminar
          this.facultyIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar la facultad', 'error');
          console.error('Error deleting faculty', error);
        }
      );
    }
  }

  cancelDelete() {
    this.facultyIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveFaculty(faculty: Faculty) {
    if (this.isEditMode) {
      // Lógica para actualizar la facultad
      this.http.put<Faculty>(`http://68.183.146.53/facultades/${faculty.id}`, faculty).subscribe(
        response => {
          this.showToast('Facultad actualizada con éxito', 'success');
          this.loadFaculties(); // Recargar la lista de facultades

        },
        error => {
          this.showToast('Error al actualizar la facultad', 'error');
          console.error('Error updating faculty', error);
        }
      );
    } else {
      // Lógica para crear una nueva facultad
      this.http.post<Faculty>('http://68.183.146.53/facultades/', faculty).subscribe(
        response => {
          this.showToast('Facultad creada con éxito', 'success');
          console.log("F");
          this.loadFaculties(); // Recargar la lista de facultades
        },
        error => {
          this.showToast('Error al crear la facultad', 'error');
          console.error('Error creating faculty', error);
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

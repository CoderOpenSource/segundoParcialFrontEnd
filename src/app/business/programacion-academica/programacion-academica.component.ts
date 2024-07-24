import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramacionAcademicaModalComponent } from '../../shared/components/programacion-academica-modal/programacion-academica-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

interface Materia {
  id: number;
  nombre: string;
}

interface Aula {
  id: number;
  nombre: string;
}

interface SesionClase {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

interface ProgramacionAcademica {
  id: number;
  materiaId: number | null;
  aulaId: number | null;
  sesionClaseIds: number[];
  grupo: string; // Nuevo atributo
}

@Component({
  selector: 'app-programacion-academica',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgramacionAcademicaModalComponent, ConfirmModalComponent],
  templateUrl: './programacion-academica.component.html',
  styleUrls: ['./programacion-academica.component.css']
})
export class ProgramacionAcademicaComponent implements OnInit {
  programacionesAcademicas: ProgramacionAcademica[] = [];
  materias: Materia[] = [];
  aulas: Aula[] = [];
  sesionesClase: SesionClase[] = [];
  selectedProgramacionAcademica: ProgramacionAcademica = {
    id: 0,
    materiaId: null,
    aulaId: null,
    sesionClaseIds: [],
    grupo: ''
  };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  toastMessage: string | null = null;
  toastClass: string = '';
  programacionAcademicaIdToDelete: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProgramacionesAcademicas();
    this.loadMaterias();
    this.loadAulas();
    this.loadSesionesClase();
  }

  loadProgramacionesAcademicas() {
    this.http.get<ProgramacionAcademica[]>('http://68.183.146.53/programacionesacademicas/').subscribe(
      data => {
        this.programacionesAcademicas = data;
      },
      error => {
        console.error('Error loading programaciones academicas', error);
      }
    );
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

  loadAulas() {
    this.http.get<Aula[]>('http://68.183.146.53/aulas/').subscribe(
      data => {
        this.aulas = data;
      },
      error => {
        console.error('Error loading aulas', error);
      }
    );
  }

  loadSesionesClase() {
    this.http.get<SesionClase[]>('http://68.183.146.53/sesionesclase/').subscribe(
      data => {
        this.sesionesClase = data;
      },
      error => {
        console.error('Error loading sesiones clase', error);
      }
    );
  }

  getNombreMateria(materiaId: number | null): string {
    const materia = this.materias.find(m => m.id === materiaId);
    return materia ? materia.nombre : 'N/A';
  }

  getNombreAula(aulaId: number | null): string {
    const aula = this.aulas.find(a => a.id === aulaId);
    return aula ? aula.nombre : 'N/A';
  }

  getFormattedSesionClase(sesionClaseIds: number[]): string {
    const sesiones = this.sesionesClase.filter(s => sesionClaseIds.includes(s.id));
    return sesiones.map(s => `${s.diaSemana.slice(0, 3).toUpperCase()} ${s.horaInicio}-${s.horaFin}`).join(' ');
  }

  editProgramacionAcademica(programacionAcademicaId: number) {
    this.selectedProgramacionAcademica = this.programacionesAcademicas.find(programacionAcademica => programacionAcademica.id === programacionAcademicaId) || this.selectedProgramacionAcademica;
    this.isEditMode = true;
    this.showModal = true;
  }

  addProgramacionAcademica() {
    this.selectedProgramacionAcademica = {
      id: 0,
      materiaId: null,
      aulaId: null,
      sesionClaseIds: [],
      grupo: ''
    };
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(programacionAcademicaId: number) {
    this.programacionAcademicaIdToDelete = programacionAcademicaId;
    this.showConfirmModal = true;
  }

  deleteProgramacionAcademica() {
    if (this.programacionAcademicaIdToDelete !== null) {
      this.http.delete(`http://68.183.146.53/programacionesacademicas/${this.programacionAcademicaIdToDelete}`).subscribe(
        () => {
          this.showToast('Programación Académica eliminada con éxito', 'success');
          this.loadProgramacionesAcademicas(); // Recargar la lista de programaciones académicas después de eliminar
          this.programacionAcademicaIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar la Programación Académica', 'error');
          console.error('Error deleting programacion academica', error);
        }
      );
    }
  }

  cancelDelete() {
    this.programacionAcademicaIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveProgramacionAcademica(programacionAcademica: ProgramacionAcademica) {
    if (this.isEditMode) {
      this.http.put<ProgramacionAcademica>(`http://68.183.146.53/programacionesacademicas/${programacionAcademica.id}`, programacionAcademica).subscribe(
        response => {
          this.showToast('Programación Académica actualizada con éxito', 'success');
          this.loadProgramacionesAcademicas();
        },
        error => {
          this.showToast('Error al actualizar la Programación Académica', 'error');
          console.error('Error updating programacion academica', error);
        }
      );
    } else {
      this.http.post<ProgramacionAcademica>('http://68.183.146.53/programacionesacademicas/', programacionAcademica).subscribe(
        response => {
          this.showToast('Programación Académica creada con éxito', 'success');
          this.loadProgramacionesAcademicas();
        },
        error => {
          this.showToast('Error al crear la Programación Académica', 'error');
          console.error('Error creating programacion academica', error);
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

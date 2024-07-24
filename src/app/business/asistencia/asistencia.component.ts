import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaModalComponent } from '../../shared/components/asistencia-modal/asistencia-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, AsistenciaModalComponent, ConfirmModalComponent],
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css']
})
export class AsistenciaComponent implements OnInit {
  asistencias: Asistencia[] = [];
  programacionesAcademicas: ProgramacionAcademica[] = [];
  estadosAsistencia: EstadoAsistencia[] = [];
  docentes: Docente[] = [];
  materias: Materia[] = [];
  aulas: Aula[] = [];
  sesionesClase: SesionClase[] = [];

  selectedAsistencia: Asistencia = {
    id: 0,
    programacionAcademicaId: 0,
    estadoAsistenciaId: 0,
    docenteId: 0,
    fecha: '',
    observaciones: '',

    latitud: 0,
    longitud: 0
  };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  toastMessage: string | null = null;
  toastClass: string = '';
  asistenciaIdToDelete: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAsistencias();
    this.loadProgramacionesAcademicas();
    this.loadEstadosAsistencia();
    this.loadDocentes();
    this.loadMaterias();
    this.loadAulas();
    this.loadSesionesClase();
  }

  loadAsistencias() {
    this.http.get<Asistencia[]>('http://192.168.0.15/asistencias/').subscribe(
      data => {
        this.asistencias = data;
      },
      error => {
        console.error('Error loading asistencias', error);
      }
    );
  }

  loadProgramacionesAcademicas() {
    this.http.get<ProgramacionAcademica[]>('http://192.168.0.15/programacionesacademicas/').subscribe(
      data => {
        this.programacionesAcademicas = data;
      },
      error => {
        console.error('Error loading programaciones academicas', error);
      }
    );
  }

  loadEstadosAsistencia() {
    this.http.get<EstadoAsistencia[]>('http://192.168.0.15/estadosasistencia/').subscribe(
      data => {
        this.estadosAsistencia = data;
      },
      error => {
        console.error('Error loading estados asistencia', error);
      }
    );
  }

  loadDocentes() {
    this.http.get<Docente[]>('http://192.168.0.15/docentes/').subscribe(
      data => {
        this.docentes = data;
      },
      error => {
        console.error('Error loading docentes', error);
      }
    );
  }

  loadMaterias() {
    this.http.get<Materia[]>('http://192.168.0.15/materias/').subscribe(
      data => {
        this.materias = data;
      },
      error => {
        console.error('Error loading materias', error);
      }
    );
  }

  loadAulas() {
    this.http.get<Aula[]>('http://192.168.0.15/aulas/').subscribe(
      data => {
        this.aulas = data;
      },
      error => {
        console.error('Error loading aulas', error);
      }
    );
  }

  loadSesionesClase() {
    this.http.get<SesionClase[]>('http://192.168.0.15/sesionesclase/').subscribe(
      data => {
        this.sesionesClase = data;
      },
      error => {
        console.error('Error loading sesiones clase', error);
      }
    );
  }

  getNombreProgramacionAcademica(programacionAcademicaId: number): string {
    const programacionAcademica = this.programacionesAcademicas.find(p => p.id === programacionAcademicaId);
    if (programacionAcademica) {
      const materia = this.materias.find(m => m.id === programacionAcademica.materiaId);
      const aula = this.aulas.find(a => a.id === programacionAcademica.aulaId);
      const sesiones = this.getFormattedSesionClase(programacionAcademica.sesionClaseIds);
      return `${programacionAcademica.grupo}:${materia ? materia.nombre : 'N/A'} - ${aula ? aula.nombre : 'N/A'} (${sesiones})`;
    }
    return 'N/A';
  }

  getNombreEstadoAsistencia(estadoAsistenciaId: number): string {
    const estadoAsistencia = this.estadosAsistencia.find(e => e.id === estadoAsistenciaId);
    return estadoAsistencia ? estadoAsistencia.nombre : 'N/A';
  }

  getNombreDocente(docenteId: number): string {
    const docente = this.docentes.find(d => d.id === docenteId);
    return docente ? docente.nombre : 'N/A';
  }

  getFormattedSesionClase(sesionClaseIds: number[]): string {
    const sesiones = this.sesionesClase.filter(s => sesionClaseIds.includes(s.id));
    return sesiones.map(s => `${s.diaSemana.slice(0, 3).toUpperCase()} ${s.horaInicio}-${s.horaFin}`).join(' ');
  }

  editAsistencia(asistenciaId: number) {
    this.selectedAsistencia = this.asistencias.find(asistencia => asistencia.id === asistenciaId) || this.selectedAsistencia;
    this.isEditMode = true;
    this.showModal = true;
  }

  addAsistencia() {
    this.selectedAsistencia = {
      id: 0,
      programacionAcademicaId: 0,
      estadoAsistenciaId: 0,
      docenteId: 0,
      fecha: this.getCurrentDate(),
      observaciones: '',
      latitud: 0,
      longitud: 0
    };
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(asistenciaId: number) {
    this.asistenciaIdToDelete = asistenciaId;
    this.showConfirmModal = true;
  }

  deleteAsistencia() {
    if (this.asistenciaIdToDelete !== null) {
      this.http.delete(`http://192.168.0.15/asistencias/${this.asistenciaIdToDelete}`).subscribe(
        () => {
          this.showToast('Asistencia eliminada con éxito', 'success');
          this.loadAsistencias(); // Recargar la lista de asistencias después de eliminar
          this.asistenciaIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar la Asistencia', 'error');
          console.error('Error deleting asistencia', error);
        }
      );
    }
  }

  cancelDelete() {
    this.asistenciaIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveAsistencia(asistencia: Asistencia) {
    if (this.isEditMode) {
      this.http.put<Asistencia>(`http://192.168.0.15/asistencias/${asistencia.id}`, asistencia).subscribe(
        response => {
          this.showToast('Asistencia actualizada con éxito', 'success');
          this.loadAsistencias();
        },
        error => {
          this.showToast('Error al actualizar la Asistencia', 'error');
          console.error('Error updating asistencia', error);
        }
      );
    } else {
      this.http.post<Asistencia>('http://192.168.0.15/asistencias/', asistencia).subscribe(
        response => {
          this.showToast('Asistencia creada con éxito', 'success');
          this.loadAsistencias();
        },
        error => {
          this.showToast('Error al crear la Asistencia', 'error');
          console.error('Error creating asistencia', error);
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

  getCurrentDate(): string {
    const now = new Date();
    return now.toISOString();
  }
}

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

interface EstadoAsistencia {
  id: number;
  nombre: string;
}

interface Docente {
  id: number;
  nombre: string;
  apellido: string;
}

interface Asistencia {
  id: number;
  programacionAcademicaId: number;
  estadoAsistenciaId: number;
  docenteId: number;
  fecha: string;
  observaciones: string;
  latitud: number;
  longitud: number;
}

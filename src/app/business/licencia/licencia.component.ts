import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LicenciaModalComponent } from '../../shared/components/licencia-modal/licencia-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

interface Licencia {
  id: number | null;
  docenteId: number | null;
  programacionAcademicaId: number | null;
  fecha: string;
  motivo: string;
  fotoLicencia: string | null;
}

interface Docente {
  id: number;
  nombre: string;
  apellido: string;
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
  materiaId: number;
  aulaId: number;
  sesionClaseIds: number[];
  grupo: string;
}

@Component({
  selector: 'app-licencia',
  standalone: true,
  imports: [CommonModule, FormsModule, LicenciaModalComponent, ConfirmModalComponent],
  templateUrl: './licencia.component.html',
  styleUrls: ['./licencia.component.css']
})
export class LicenciaComponent implements OnInit {
  licencias: Licencia[] = [];
  docentes: Docente[] = [];
  materias: Materia[] = [];
  aulas: Aula[] = [];
  sesionesClase: SesionClase[] = [];
  programaciones: ProgramacionAcademica[] = [];

  selectedLicencia: Licencia = {
    id: null,
    docenteId: null,
    programacionAcademicaId: null,
    fecha: '',
    motivo: '',
    fotoLicencia: null
  };
  selectedFile: File | null = null;
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  toastMessage: string | null = null;
  toastClass: string = '';
  licenciaIdToDelete: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLicencias();
    this.loadDocentes();
    this.loadMaterias();
    this.loadAulas();
    this.loadSesionesClase();
    this.loadProgramaciones();
  }

  loadLicencias() {
    this.http.get<Licencia[]>('http://192.168.0.18/licencias/').subscribe(
      data => {
        this.licencias = data;
      },
      error => {
        console.error('Error loading licencias', error);
      }
    );
  }

  loadDocentes() {
    this.http.get<Docente[]>('http://192.168.0.18/docentes/').subscribe(
      data => {
        this.docentes = data;
      },
      error => {
        console.error('Error loading docentes', error);
      }
    );
  }

  loadMaterias() {
    this.http.get<Materia[]>('http://192.168.0.18/materias/').subscribe(
      data => {
        this.materias = data;
      },
      error => {
        console.error('Error loading materias', error);
      }
    );
  }

  loadAulas() {
    this.http.get<Aula[]>('http://192.168.0.18/aulas/').subscribe(
      data => {
        this.aulas = data;
      },
      error => {
        console.error('Error loading aulas', error);
      }
    );
  }

  loadSesionesClase() {
    this.http.get<SesionClase[]>('http://192.168.0.18/sesionesclase/').subscribe(
      data => {
        this.sesionesClase = data;
      },
      error => {
        console.error('Error loading sesiones clase', error);
      }
    );
  }

  loadProgramaciones() {
    this.http.get<ProgramacionAcademica[]>('http://192.168.0.18/programacionesacademicas/').subscribe(
      data => {
        this.programaciones = data;
      },
      error => {
        console.error('Error loading programaciones', error);
      }
    );
  }

  getNombreDocente(docenteId: number | null): string {
    const docente = this.docentes.find(doc => doc.id === docenteId);
    return docente ? docente.nombre : 'Desconocido';
  }

  getApellido(docenteId: number | null): string {
    const docente = this.docentes.find(doc => doc.id === docenteId);
    return docente ? docente.apellido : 'Desconocido';
  }

  getMateriaNombre(materiaId: number): string {
    const materia = this.materias.find(m => m.id === materiaId);
    return materia ? materia.nombre : 'Desconocido';
  }

  getAulaNombre(aulaId: number): string {
    const aula = this.aulas.find(a => a.id === aulaId);
    return aula ? aula.nombre : 'Desconocido';
  }

  getFormattedSesionClase(sesionClaseIds: number[]): string {
    const sesiones = this.sesionesClase.filter(s => sesionClaseIds.includes(s.id));
    return sesiones.map(s => `${s.diaSemana.slice(0, 3).toUpperCase()} ${s.horaInicio}-${s.horaFin}`).join(' ');
  }

  getProgramacionDescripcion(programacionId: number | null): string {
    if (programacionId === null) {
      return 'Sin programación';
    }
    const programacion = this.programaciones.find(prog => prog.id === programacionId);
    if (programacion) {
      const materiaNombre = this.getMateriaNombre(programacion.materiaId);
      const aulaNombre = this.getAulaNombre(programacion.aulaId);
      const sesiones = this.getFormattedSesionClase(programacion.sesionClaseIds);
      return `${programacion.grupo}: ${materiaNombre} - ${aulaNombre} (${sesiones})`;
    }
    return 'Desconocido';
  }

  editLicencia(licenciaId: number | null) {
    if (licenciaId !== null) {
      this.selectedLicencia = this.licencias.find(licencia => licencia.id === licenciaId) || this.selectedLicencia;
      this.isEditMode = true;
      this.showModal = true;
    }
  }

  addLicencia() {
    this.selectedLicencia = {
      id: null,
      docenteId: null,
      programacionAcademicaId: null,
      fecha: '',
      motivo: '',
      fotoLicencia: null
    };
    this.selectedFile = null;
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(licenciaId: number | null) {
    if (licenciaId !== null) {
      this.licenciaIdToDelete = licenciaId;
      this.showConfirmModal = true;
    }
  }

  deleteLicencia() {
    if (this.licenciaIdToDelete !== null) {
      this.http.delete(`http://192.168.0.18/licencias/${this.licenciaIdToDelete}`).subscribe(
        () => {
          this.showToast('Licencia eliminada con éxito', 'success');
          this.loadLicencias(); // Recargar la lista de licencias después de eliminar
          this.licenciaIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar la Licencia', 'error');
          console.error('Error deleting licencia', error);
        }
      );
    }
  }

  cancelDelete() {
    this.licenciaIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveLicencia(licencia: Licencia) {
    const formData = new FormData();
    formData.append('licencia', new Blob([JSON.stringify(licencia)], { type: 'application/json' }));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.http.post('http://192.168.0.18/licencias/createOrUpdate', formData).subscribe(
      () => {
        this.showToast('Licencia guardada con éxito', 'success');
        this.loadLicencias();
      },
      error => {
        this.showToast('Error al guardar la Licencia', 'error');
        console.error('Error creating or updating licencia', error);
      }
    );

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocenteModalComponent } from '../../shared/components/docente-modal/docente-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

interface Departamento {
  id: number | null;
  nombre: string;
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
  docenteIds: number[];
  sesionClaseIds: number[];
  grupo: string;
}

interface Docente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  departamentoId: number | null;
  programacionAcademicaIds: number[];
}

interface DocenteDTO {
  id: number | null;
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  rolId: number;
  departamentoId: number | null;
  programacionAcademicaIds: number[];
}

@Component({
  selector: 'app-docente',
  standalone: true,
  imports: [CommonModule, FormsModule, DocenteModalComponent, ConfirmModalComponent],
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css']
})
export class DocenteComponent implements OnInit {
  docentes: Docente[] = [];
  departamentos: Departamento[] = [];
  materias: Materia[] = [];
  aulas: Aula[] = [];
  sesionesClase: SesionClase[] = [];
  programaciones: ProgramacionAcademica[] = [];

  selectedDocente: Docente = {
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    departamentoId: null,
    programacionAcademicaIds: []
  };
  showModal = false;
  showConfirmModal = false;
  isEditMode = false;
  docenteIdToDelete: number | null = null;
  toastMessage: string | null = null;
  toastClass: string = '';
  confirmMessage: string = '¿Estás seguro?';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDocentes();
    this.loadDepartamentos();
    this.loadMaterias();
    this.loadAulas();
    this.loadSesionesClase();
    this.loadProgramaciones();
  }

  loadDocentes() {
    this.http.get<Docente[]>('http://192.168.0.15/docentes/').subscribe(
      data => {
        this.docentes = data;
        console.log(data);
      },
      error => {
        console.error('Error loading docentes', error);
      }
    );
  }

  loadDepartamentos() {
    this.http.get<Departamento[]>('http://192.168.0.15/departamentos/').subscribe(
      data => {
        this.departamentos = data;
      },
      error => {
        console.error('Error loading departamentos', error);
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

  loadProgramaciones() {
    this.http.get<ProgramacionAcademica[]>('http://192.168.0.15/programacionesacademicas/').subscribe(
      data => {
        this.programaciones = data;
      },
      error => {
        console.error('Error loading programaciones', error);
      }
    );
  }

  getDepartamentoNombre(departamentoId: number | null): string {
    const departamento = this.departamentos.find(dep => dep.id === departamentoId);
    return departamento ? departamento.nombre : 'Desconocido';
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

  getProgramacionDescripcion(programacionId: number): string {
    const programacion = this.programaciones.find(prog => prog.id === programacionId);
    if (programacion) {
      const materiaNombre = this.getMateriaNombre(programacion.materiaId);
      const aulaNombre = this.getAulaNombre(programacion.aulaId);
      const sesiones = this.getFormattedSesionClase(programacion.sesionClaseIds);
      return `${programacion.grupo}: ${materiaNombre} - ${aulaNombre} (${sesiones})`;
    }
    return 'Desconocido';
  }

  editDocente(docenteId: number) {
    this.selectedDocente = this.docentes.find(docente => docente.id === docenteId) || this.selectedDocente;
    this.isEditMode = true;
    this.showModal = true;
  }

  addDocente() {
    this.selectedDocente = {
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      contrasena: '',
      departamentoId: null,
      programacionAcademicaIds: []
    };
    this.isEditMode = false;
    this.showModal = true;
  }

  confirmDelete(docenteId: number) {
    this.docenteIdToDelete = docenteId;
    this.confirmMessage = '¿Estás seguro de eliminar este docente?';
    this.showConfirmModal = true;
  }

  deleteDocente() {
    if (this.docenteIdToDelete !== null) {
      this.http.delete(`http://192.168.0.15/docentes/${this.docenteIdToDelete}`).subscribe(
        () => {
          this.showToast('Docente eliminado con éxito', 'success');
          this.loadDocentes(); // Recargar la lista de docentes después de eliminar
          this.docenteIdToDelete = null;
          this.showConfirmModal = false;
        },
        error => {
          this.showToast('Error al eliminar el docente', 'error');
          console.error('Error deleting docente', error);
        }
      );
    }
  }

  cancelDelete() {
    this.docenteIdToDelete = null;
    this.showConfirmModal = false;
  }

  saveDocente(docente: Docente) {
    console.log('Docente antes de enviar:', JSON.stringify(docente, null, 2));

    const docenteDTO: DocenteDTO = {
      id: this.isEditMode ? docente.id : null,
      nombre: docente.nombre,
      apellido: docente.apellido,
      email: docente.email,
      contrasena: docente.contrasena,
      rolId: 2, // Siempre 2 para Docente
      departamentoId: docente.departamentoId,
      programacionAcademicaIds: docente.programacionAcademicaIds
    };

    if (this.isEditMode) {
      this.http.put<Docente>(`http://192.168.0.15/docentes/${docente.id}`, docenteDTO).subscribe(
        response => {
          this.showToast('Docente actualizado con éxito', 'success');
          this.loadDocentes();
        },
        error => {
          this.showToast('Error al actualizar el docente', 'error');
          console.error('Error updating docente', error);
        }
      );
    } else {
      this.http.post<Docente>('http://192.168.0.15/docentes/', docenteDTO).subscribe(
        response => {
          this.showToast('Docente creado con éxito', 'success');
          this.loadDocentes();
        },
        error => {
          this.showToast('Error al crear el docente', 'error');
          console.error('Error creating docente', error);
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


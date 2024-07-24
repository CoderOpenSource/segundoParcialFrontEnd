import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  grupo:string;
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

@Component({
  selector: 'app-docente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docente-modal.component.html',
  styleUrls: ['./docente-modal.component.css']
})
export class DocenteModalComponent implements OnInit {
  @Input() docente: Docente = {
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    departamentoId: null,
    programacionAcademicaIds: []
  };
  @Input() isEditMode = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveDocente = new EventEmitter<Docente>();

  departamentos: Departamento[] = [];
  materias: Materia[] = [];
  aulas: Aula[] = [];
  sesionesClase: SesionClase[] = [];
  programaciones: ProgramacionAcademica[] = [];
  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDepartamentos();
    this.loadMaterias();
    this.loadAulas();
    this.loadSesionesClase();
    this.loadProgramaciones();
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

  getProgramacionDescripcion(programacion: ProgramacionAcademica): string {
    const materia = this.materias.find(m => m.id === programacion.materiaId);
    const aula = this.aulas.find(a => a.id === programacion.aulaId);
    const sesiones = this.getFormattedSesionClase(programacion.sesionClaseIds);
    return `${programacion.grupo}: ${materia?.nombre || 'Desconocido'} - ${aula?.nombre || 'Desconocido'} (${sesiones})`;
  }

  getFormattedSesionClase(sesionClaseIds: number[]): string {
    const sesiones = this.sesionesClase.filter(s => sesionClaseIds.includes(s.id));
    return sesiones.map(s => `${s.diaSemana.slice(0, 3).toUpperCase()} ${s.horaInicio}-${s.horaFin}`).join(', ');
  }

  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastClass = type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
  }

  onClose() {
    this.closeModal.emit();
  }

  onSave() {
    this.saveDocente.emit(this.docente);
  }

  isProgramacionSelected(programacion: ProgramacionAcademica): boolean {
    return this.docente.programacionAcademicaIds.includes(programacion.id);
  }

  toggleProgramacionSelection(programacion: ProgramacionAcademica) {
    if (this.isProgramacionSelected(programacion)) {
      this.docente.programacionAcademicaIds = this.docente.programacionAcademicaIds.filter(id => id !== programacion.id);
    } else {
      this.docente.programacionAcademicaIds.push(programacion.id);
    }
  }
}

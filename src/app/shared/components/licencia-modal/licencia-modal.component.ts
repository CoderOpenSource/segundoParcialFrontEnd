import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

interface Docente {
  id: number;
  nombre: string;
  apellido: string;
}

interface Licencia {
  id: number | null;
  docenteId: number | null;
  programacionAcademicaId: number | null;
  fecha: string;
  motivo: string;
  fotoLicencia: string | null;
}

@Component({
  selector: 'app-licencia-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './licencia-modal.component.html',
  styleUrls: ['./licencia-modal.component.css']
})
export class LicenciaModalComponent implements OnInit {
  @Input() licencia: Licencia = {
    id: null,
    docenteId: null,
    programacionAcademicaId: null,
    fecha: '',
    motivo: '',
    fotoLicencia: null
  };
  @Input() isEditMode = false;
  @Input() docentes: Docente[] = [];
  @Input() programaciones: ProgramacionAcademica[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveLicencia = new EventEmitter<Licencia>();
  @Output() fileSelected = new EventEmitter<Event>();

  materias: Materia[] = [];
  aulas: Aula[] = [];
  sesionesClase: SesionClase[] = [];
  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMaterias();
    this.loadAulas();
    this.loadSesionesClase();
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
    this.saveLicencia.emit(this.licencia);
  }

  onFileSelected(event: Event) {
    this.fileSelected.emit(event);
  }
}

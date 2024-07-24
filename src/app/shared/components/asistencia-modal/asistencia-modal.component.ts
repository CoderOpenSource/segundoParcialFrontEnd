import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asistencia-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia-modal.component.html',
  styleUrls: ['./asistencia-modal.component.css']
})
export class AsistenciaModalComponent implements OnInit {
  @Input() asistencia: Asistencia = {
    id: 0,
    programacionAcademicaId: 0,
    estadoAsistenciaId: 1,
    docenteId: 0,
    fecha: '',
    observaciones: '',
    latitud: 0,
    longitud: 0
  };
  @Input() isEditMode = false;
  @Input() programacionesAcademicas: ProgramacionAcademica[] = [];
  @Input() estadosAsistencia: EstadoAsistencia[] = [];
  @Input() docentes: Docente[] = [];
  @Input() materias: Materia[] = [];
  @Input() aulas: Aula[] = [];
  @Input() sesionesClase: SesionClase[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveAsistencia = new EventEmitter<Asistencia>();

  selectedProgramacion: ProgramacionAcademica | null = null;

  ngOnInit(): void {
    this.getCurrentLocation();
    if (!this.isEditMode) {
      this.asistencia.fecha = this.getCurrentDate();
    }
    this.onProgramacionChange();
  }

  handleSave() {
    this.saveAsistencia.emit(this.asistencia);
  }

  handleClose() {
    this.closeModal.emit();
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.asistencia.latitud = position.coords.latitude;
        this.asistencia.longitud = position.coords.longitude;
      }, error => {
        console.error('Error getting location: ', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  getCurrentDate(): string {
    const now = new Date();
    return now.toISOString();
  }

  onProgramacionChange() {
    this.selectedProgramacion = this.programacionesAcademicas.find(p => p.id === this.asistencia.programacionAcademicaId) || null;
  }

  getNombreMateria(materiaId: number | null): string {
    if (materiaId === null) {
      return 'N/A';
    }
    const materia = this.materias.find(m => m.id === materiaId);
    return materia ? materia.nombre : 'N/A';
  }

  getNombreAula(aulaId: number | null): string {
    if (aulaId === null) {
      return 'N/A';
    }
    const aula = this.aulas.find(a => a.id === aulaId);
    return aula ? aula.nombre : 'N/A';
  }

  getFormattedSesionClase(sesionClaseIds: number[]): string {
    const sesiones = this.sesionesClase.filter(s => sesionClaseIds.includes(s.id));
    return sesiones.map(s => `${s.diaSemana.slice(0, 3).toUpperCase()} ${s.horaInicio}-${s.horaFin}`).join(' ');
  }

  getProgramacionDescripcion(programacion: ProgramacionAcademica): string {
    const materia = this.getNombreMateria(programacion.materiaId);
    const aula = this.getNombreAula(programacion.aulaId);
    const sesiones = this.getFormattedSesionClase(programacion.sesionClaseIds);
    return `${programacion.grupo}: ${materia} - ${aula} (${sesiones})`;
  }
}

interface ProgramacionAcademica {
  id: number;
  materiaId: number | null;
  aulaId: number | null;
  sesionClaseIds: number[];
  grupo: string;
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

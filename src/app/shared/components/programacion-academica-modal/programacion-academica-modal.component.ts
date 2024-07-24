import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Materia {
  id: number | null;
  nombre: string;
}

interface Aula {
  id: number | null;
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
  selector: 'app-programacion-academica-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programacion-academica-modal.component.html',
  styleUrls: ['./programacion-academica-modal.component.css']
})
export class ProgramacionAcademicaModalComponent implements OnInit {
  @Input() programacionAcademica: ProgramacionAcademica = {
    id: 0,
    materiaId: null,
    aulaId: null,
    sesionClaseIds: [],
    grupo: '' // Nuevo atributo
  };
  @Input() isEditMode = false;
  @Input() materias: Materia[] = [];
  @Input() aulas: Aula[] = [];
  @Input() sesionesClase: SesionClase[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveProgramacionAcademica = new EventEmitter<ProgramacionAcademica>();

  toastMessage: string | null = null;
  toastClass: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

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
    this.saveProgramacionAcademica.emit(this.programacionAcademica);
  }
}

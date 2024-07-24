import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SesionClase {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-sesion-clase-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sesion-clase-modal.component.html',
  styleUrls: ['./sesion-clase-modal.component.css']
})
export class SesionClaseModalComponent implements OnInit {
  @Input() sesionClase: SesionClase = {
    id: 0,
    diaSemana: '',
    horaInicio: '',
    horaFin: ''
  };
  @Input() isEditMode = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveSesionClase = new EventEmitter<SesionClase>();

  toastMessage: string | null = null;
  toastClass: string = '';

  constructor() {}

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
    this.saveSesionClase.emit(this.sesionClase);
  }
}

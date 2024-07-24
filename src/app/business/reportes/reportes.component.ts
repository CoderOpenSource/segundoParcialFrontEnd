import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TipoReporte {
  id: number;
  nombre: string;
}

interface Reporte {
  id: number;
  fechaGeneracion: Date;
  periodo: string;
  tipoReporteId: number;
  pdfPath: string;
  excelPath: string;
  tipoReporteNombre?: string;
}

interface Materia {
  id: number;
  nombre: string;
}

interface Docente {
  id: number;
  nombre: string;
  apellido: string;
}

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReporteComponent implements OnInit {
  tiposReporte: TipoReporte[] = [];
  reportes: Reporte[] = [];
  materias: Materia[] = [];
  docentes: Docente[] = [];
  selectedTipoReporte: number | null = null;
  selectedMateria: string | null = null;
  selectedDocente: string | null = null;
  fechaInicio: string | null = null;
  fechaFin: string | null = null;
  reportUrl: string = 'http://68.183.146.53/reportes/';
  tipoReporteUrl: string = 'http://68.183.146.53/tiporeportes/';
  materiasUrl: string = 'http://68.183.146.53/materias/';
  docentesUrl: string = 'http://68.183.146.53/docentes/';
  generatingReport: boolean = false;

  // Variables para el modal de eliminación
  showDeleteModal: boolean = false;
  reportIdToDelete: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTiposReporte();
    this.loadReportes();
    this.loadMaterias();
    this.loadDocentes();
  }

  loadTiposReporte() {
    this.http.get<TipoReporte[]>(this.tipoReporteUrl).subscribe(
      data => {
        this.tiposReporte = data;
        this.mapReportesTipoNombre();
      },
      error => {
        console.error('Error loading tipos de reporte', error);
      }
    );
  }

  loadReportes() {
    this.http.get<Reporte[]>(this.reportUrl).subscribe(
      data => {
        this.reportes = data;
        this.mapReportesTipoNombre();
      },
      error => {
        console.error('Error loading reportes', error);
      }
    );
  }

  loadMaterias() {
    this.http.get<Materia[]>(this.materiasUrl).subscribe(
      data => {
        this.materias = data;
      },
      error => {
        console.error('Error loading materias', error);
      }
    );
  }

  loadDocentes() {
    this.http.get<Docente[]>(this.docentesUrl).subscribe(
      data => {
        this.docentes = data;
      },
      error => {
        console.error('Error loading docentes', error);
      }
    );
  }

  mapReportesTipoNombre() {
    if (this.tiposReporte.length > 0 && this.reportes.length > 0) {
      this.reportes.forEach(reporte => {
        const tipo = this.tiposReporte.find(t => t.id === reporte.tipoReporteId);
        if (tipo) {
          reporte.tipoReporteNombre = tipo.nombre;
        }
      });
    }
  }

  generateReport(format: string) {
    if (this.selectedTipoReporte !== null) {
      this.generatingReport = true;
      let tipoReporte: string;
      switch (this.selectedTipoReporte) {
        case 1:
          tipoReporte = 'asistencias';
          break;
        case 2:
          tipoReporte = 'atrasos';
          break;
        case 3:
          tipoReporte = 'faltas';
          break;
        case 4:
          tipoReporte = 'licencias';
          break;
        default:
          tipoReporte = 'asistencias';
      }

      let params = new HttpParams();
      if (this.fechaInicio) params = params.set('fechaInicio', this.fechaInicio);
      if (this.fechaFin) params = params.set('fechaFin', this.fechaFin);
      if (this.selectedMateria) params = params.set('materia', this.selectedMateria);
      if (this.selectedDocente) params = params.set('docente', this.selectedDocente);

      const url = `${this.reportUrl}${tipoReporte}/${format}`;

      this.http.get(url, { responseType: 'blob', params }).subscribe(blob => {
        const newBlob = new Blob([blob], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Crear un enlace temporal para descargar el archivo con el nombre correcto
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = format === 'pdf' ? `reporte_${this.selectedTipoReporte}.pdf` : `reporte_${this.selectedTipoReporte}.xlsx`;
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        this.generatingReport = false;
        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          location.reload();
        }, 1000);
      }, error => {
        console.error('Error generating report', error);
        this.generatingReport = false;
      });
    } else {
      alert('Seleccione un tipo de reporte');
    }
  }

  openDeleteModal(id: number) {
    this.reportIdToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.reportIdToDelete = null;
  }

  confirmDelete() {
    if (this.reportIdToDelete !== null) {
      this.http.delete(`${this.reportUrl}${this.reportIdToDelete}`).subscribe(() => {
        this.loadReportes();
        this.closeDeleteModal();
      }, error => {
        console.error('Error deleting reporte', error);
        this.closeDeleteModal();
      });
    }
  }
}


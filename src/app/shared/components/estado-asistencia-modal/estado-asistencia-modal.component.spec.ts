import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoAsistenciaModalComponent } from './estado-asistencia-modal.component';

describe('EstadoAsistenciaModalComponent', () => {
  let component: EstadoAsistenciaModalComponent;
  let fixture: ComponentFixture<EstadoAsistenciaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoAsistenciaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstadoAsistenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoAsistenciaComponent } from './estado-asistencia.component';

describe('EstadoAsistenciaComponent', () => {
  let component: EstadoAsistenciaComponent;
  let fixture: ComponentFixture<EstadoAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoAsistenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EstadoAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

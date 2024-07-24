import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaModalComponent } from './asistencia-modal.component';

describe('AsistenciaModalComponent', () => {
  let component: AsistenciaModalComponent;
  let fixture: ComponentFixture<AsistenciaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsistenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

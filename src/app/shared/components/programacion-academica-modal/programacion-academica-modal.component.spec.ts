import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionAcademicaModalComponent } from './programacion-academica-modal.component';

describe('ProgramacionAcademicaModalComponent', () => {
  let component: ProgramacionAcademicaModalComponent;
  let fixture: ComponentFixture<ProgramacionAcademicaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramacionAcademicaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramacionAcademicaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

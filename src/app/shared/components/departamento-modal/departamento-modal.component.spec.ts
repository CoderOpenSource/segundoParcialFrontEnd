import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartamentoModalComponent } from './departamento-modal.component';

describe('DepartamentoModalComponent', () => {
  let component: DepartamentoModalComponent;
  let fixture: ComponentFixture<DepartamentoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartamentoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartamentoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

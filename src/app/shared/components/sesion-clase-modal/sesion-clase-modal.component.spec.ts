import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionClaseModalComponent } from './sesion-clase-modal.component';

describe('SesionClaseModalComponent', () => {
  let component: SesionClaseModalComponent;
  let fixture: ComponentFixture<SesionClaseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionClaseModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SesionClaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

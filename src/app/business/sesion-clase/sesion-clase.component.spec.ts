import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionClaseComponent } from './sesion-clase.component';

describe('SesionClaseComponent', () => {
  let component: SesionClaseComponent;
  let fixture: ComponentFixture<SesionClaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionClaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SesionClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarreraModalComponent } from './carrera-modal.component';

describe('CarreraModalComponent', () => {
  let component: CarreraModalComponent;
  let fixture: ComponentFixture<CarreraModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarreraModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarreraModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

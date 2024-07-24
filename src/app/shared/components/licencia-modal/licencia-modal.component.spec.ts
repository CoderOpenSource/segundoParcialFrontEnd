import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenciaModalComponent } from './licencia-modal.component';

describe('LicenciaModalComponent', () => {
  let component: LicenciaModalComponent;
  let fixture: ComponentFixture<LicenciaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LicenciaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LicenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

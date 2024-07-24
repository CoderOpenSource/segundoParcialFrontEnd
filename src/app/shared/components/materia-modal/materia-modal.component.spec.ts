import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaModalComponent } from './materia-modal.component';

describe('MateriaModalComponent', () => {
  let component: MateriaModalComponent;
  let fixture: ComponentFixture<MateriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MateriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

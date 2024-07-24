import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulaModalComponent } from './aula-modal.component';

describe('AulaModalComponent', () => {
  let component: AulaModalComponent;
  let fixture: ComponentFixture<AulaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AulaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AulaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

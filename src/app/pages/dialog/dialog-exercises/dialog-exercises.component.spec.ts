import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExercisesComponent } from './dialog-exercises.component';

describe('DialogExercisesComponent', () => {
  let component: DialogExercisesComponent;
  let fixture: ComponentFixture<DialogExercisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogExercisesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

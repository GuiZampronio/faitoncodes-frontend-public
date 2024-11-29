import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTurmasComponent } from './dialog-turmas.component';

describe('DialogTurmasComponent', () => {
  let component: DialogTurmasComponent;
  let fixture: ComponentFixture<DialogTurmasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTurmasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogTurmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDontateComponent } from './edit-dontate.component';

describe('EditDontateComponent', () => {
  let component: EditDontateComponent;
  let fixture: ComponentFixture<EditDontateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDontateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDontateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

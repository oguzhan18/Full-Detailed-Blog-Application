import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditVideosComponent } from './add-edit-videos.component';

describe('AddEditVideosComponent', () => {
  let component: AddEditVideosComponent;
  let fixture: ComponentFixture<AddEditVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

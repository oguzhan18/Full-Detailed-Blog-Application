import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWrappperComponent } from './user-wrappper.component';

describe('UserWrappperComponent', () => {
  let component: UserWrappperComponent;
  let fixture: ComponentFixture<UserWrappperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWrappperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWrappperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

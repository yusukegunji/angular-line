import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogTableComponent } from './user-log-table.component';

describe('UserLogTableComponent', () => {
  let component: UserLogTableComponent;
  let fixture: ComponentFixture<UserLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLogTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

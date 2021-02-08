import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLogTableComponent } from './member-log-table.component';

describe('MemberLogTableComponent', () => {
  let component: MemberLogTableComponent;
  let fixture: ComponentFixture<MemberLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberLogTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

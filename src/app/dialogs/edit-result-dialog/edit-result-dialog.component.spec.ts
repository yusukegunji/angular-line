import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResultDialogComponent } from './edit-result-dialog.component';

describe('EditResultDialogComponent', () => {
  let component: EditResultDialogComponent;
  let fixture: ComponentFixture<EditResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditResultDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

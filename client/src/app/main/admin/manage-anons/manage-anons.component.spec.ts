import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAnonsComponent } from './manage-anons.component';

describe('ManageAnonsComponent', () => {
  let component: ManageAnonsComponent;
  let fixture: ComponentFixture<ManageAnonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAnonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAnonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

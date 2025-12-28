import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentParcelComponent } from './resident-parcel.component';

describe('ResidentParcelComponent', () => {
  let component: ResidentParcelComponent;
  let fixture: ComponentFixture<ResidentParcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResidentParcelComponent]
    });
    fixture = TestBed.createComponent(ResidentParcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

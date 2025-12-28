import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentApprovalComponent } from './resident-approval.component';

describe('ResidentApprovalComponent', () => {
  let component: ResidentApprovalComponent;
  let fixture: ComponentFixture<ResidentApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResidentApprovalComponent]
    });
    fixture = TestBed.createComponent(ResidentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorLogComponent } from './visitor-log.component';

describe('VisitorLogComponent', () => {
  let component: VisitorLogComponent;
  let fixture: ComponentFixture<VisitorLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitorLogComponent]
    });
    fixture = TestBed.createComponent(VisitorLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

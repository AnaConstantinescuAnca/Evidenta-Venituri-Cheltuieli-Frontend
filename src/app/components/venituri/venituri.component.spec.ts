import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenituriComponent } from './venituri.component';

describe('VenituriComponent', () => {
  let component: VenituriComponent;
  let fixture: ComponentFixture<VenituriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenituriComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenituriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MounthlyChart } from './mounthly-chart';

describe('MounthlyChart', () => {
  let component: MounthlyChart;
  let fixture: ComponentFixture<MounthlyChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MounthlyChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MounthlyChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

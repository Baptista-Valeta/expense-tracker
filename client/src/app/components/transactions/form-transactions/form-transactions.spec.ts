import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTransactions } from './form-transactions';

describe('FormTransactions', () => {
  let component: FormTransactions;
  let fixture: ComponentFixture<FormTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTransactions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTransactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

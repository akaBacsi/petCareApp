import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetRegisterPage } from './pet-register.page';

describe('PetRegisterPage', () => {
  let component: PetRegisterPage;
  let fixture: ComponentFixture<PetRegisterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PetRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

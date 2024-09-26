import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetEditPage } from './edit-profile.page';

describe('PetEditPage', () => {
  let component: PetEditPage;
  let fixture: ComponentFixture<PetEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PetEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

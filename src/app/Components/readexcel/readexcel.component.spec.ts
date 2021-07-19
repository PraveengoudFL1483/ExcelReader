import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadexcelComponent } from './readexcel.component';

describe('ReadexcelComponent', () => {
  let component: ReadexcelComponent;
  let fixture: ComponentFixture<ReadexcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadexcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadexcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

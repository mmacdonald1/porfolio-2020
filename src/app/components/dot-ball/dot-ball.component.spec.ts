import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotBallComponent } from './dot-ball.component';

describe('DotBallComponent', () => {
  let component: DotBallComponent;
  let fixture: ComponentFixture<DotBallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotBallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

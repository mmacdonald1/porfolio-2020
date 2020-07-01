import { TestBed } from '@angular/core/testing';

import { NodeDiagramService } from './node-diagram.service';

describe('NodeDiagramServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeDiagramService = TestBed.get(NodeDiagramService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ParticipantsDialogService } from './participants-dialog.service';

describe('ParticipantsDialogService', () => {
  let service: ParticipantsDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantsDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

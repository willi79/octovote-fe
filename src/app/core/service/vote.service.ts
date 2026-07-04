import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environment/environment';
import { Candidate, CastVoteResponse } from '../model/candidate.model';

export interface VoteResults {
    totalVotes: number;
    results: Candidate[];
}

@Injectable({ providedIn: 'root' })
export class VoteService {
    private readonly http = inject(HttpClient);

    getCandidates(): Observable<{ candidates: Candidate[] }> {
        return this.http.get<{ candidates: Candidate[] }>(`${environment.apiUrl}/vote/candidates`);
    }

    castVote(name: string): Observable<CastVoteResponse> {
        return this.http.post<CastVoteResponse>(`${environment.apiUrl}/vote`, { name });
    }

    getResults(): Observable<VoteResults> {
        return this.http.get<VoteResults>(`${environment.apiUrl}/vote/results`);
    }
}

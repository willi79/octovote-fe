import { Component, inject, OnInit, signal } from '@angular/core';
import { VoteService } from '../../../core/service/vote.service';
import { Candidate } from '../../../core/model/candidate.model';

@Component({
    selector: 'app-admin-results',
    standalone: true,
    imports: [],
    templateUrl: './admin-results.component.html',
    styleUrl: './admin-results.component.scss',
})
export class AdminResultsComponent implements OnInit {
    readonly results = signal<Candidate[]>([]);
    readonly totalVotes = signal(0);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);
    private readonly voteService = inject(VoteService);

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.isLoading.set(true);
        this.voteService.getResults().subscribe({
            next: (res) => {
                console.log('Results response:', res);
                this.results.set(res.results);
                this.totalVotes.set(res.totalVotes);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Could not load results.');
            },
        });
    }

    sharePercent(votes: number): number {
        const total = this.totalVotes();
        return total === 0 ? 0 : Math.round((votes / total) * 100);
    }
}

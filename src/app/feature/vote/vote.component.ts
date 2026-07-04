import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { VoteService } from '../../core/service/vote.service';
import { AuthService } from '../../core/service/auth.service';
import { Candidate } from '../../core/model/candidate.model';

@Component({
    selector: 'app-vote',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './vote.component.html',
    styleUrl: './vote.component.scss',
})
export class VoteComponent implements OnInit {
    readonly auth = inject(AuthService);
    readonly candidates = signal<Candidate[]>([]);
    readonly isLoading = signal(true);
    readonly isSubmitting = signal(false);
    readonly errorMessage = signal<string | null>(null);
    readonly votedFor = signal<string | null>(null);
    readonly choiceMode = signal<'existing' | 'new'>('existing');
    private readonly fb = inject(FormBuilder);
    readonly form = this.fb.group({
        existingName: ['', [Validators.required]],
        newName: ['', [Validators.required, Validators.minLength(2)]],
    });
    private readonly voteService = inject(VoteService);

    ngOnInit(): void {
        if (this.auth.currentUser()?.hasVoted) {
            this.votedFor.set('already-voted');
        }

        this.voteService.getCandidates().subscribe({
            next: (res) => {
                this.candidates.set(res.candidates);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false),
        });
    }

    setChoiceMode(mode: 'existing' | 'new'): void {
        this.choiceMode.set(mode);
        this.errorMessage.set(null);
    }

    submit(): void {
        const name =
            this.choiceMode() === 'existing' ? this.form.controls.existingName.value : this.form.controls.newName.value;

        if (!name || !name.trim()) {
            this.errorMessage.set('Please choose or type a name to vote for.');
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set(null);

        this.voteService.castVote(name.trim()).subscribe({
            next: (res) => {
                this.isSubmitting.set(false);
                this.votedFor.set(res.candidate.name);
            },
            error: (err) => {
                this.isSubmitting.set(false);
                this.errorMessage.set(err.error?.message || 'Could not record your vote.');
            },
        });
    }
}

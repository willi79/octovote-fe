export interface Candidate {
    _id: string;
    name: string;
    votes: number;
}

export interface CastVoteResponse {
    message: string;
    candidate: Candidate;
}

// Timeline event interface
export interface ITimelineEvent {
    time: string;
    type: string;
    team: string;
    player?: string;
    assistedBy?: string;
    description?: string;
}

// Fixture interface
export interface IFixture {
    _id: string;
    date: string;
    time: string;
    stadium: string;
    competition: string;
    competitionType: string;
    seasonYear: string;
    month: string;
    homeTeam: string;
    awayTeam: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    status: string;
    homeScore: number;
    awayScore: number;
    leagueLogo: string;
    channelLogo: string;
    matchReport: string;
    highlights: string;
    timeline: ITimelineEvent[];
    createdAt: Date;
    updatedAt: Date;
    matchImage: string;
}
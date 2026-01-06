export type SliderType = "text" | "game";

export interface GameSliderData {
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamName: string;
  awayTeamLogo: string;
  leagueLogo: string;
  matchDate: string;
  matchTime: string;
  matchLocation: string;
  leftPlayerImage: string;
  rightPlayerImage: string;
}

export interface Slider {
  _id: string;
  type: SliderType;
  title: string;
  content: string;
  image: string;
  link: string;
  buttonText: string;
  order: number;
  isActive: boolean;
  gameData?: GameSliderData;
  fixtureId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SliderFormData {
  type: SliderType;
  title: string;
  content: string;
  image: string;
  link: string;
  buttonText: string;
  order: number;
  isActive: boolean;
  gameData?: GameSliderData;
}

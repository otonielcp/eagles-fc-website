import { Types } from 'mongoose';

export interface Team {
  _id: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  image: string;
  isActive: boolean;
  order: number;
  sponsor: {
    name: string;
    logo: string;
    website: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TeamFormData {
  name: string;
  shortName: string;
  description: string;
  category: string;
  image: string;
  isActive: boolean;
  order: number;
  sponsor: {
    name: string;
    logo: string;
    website: string;
    isActive: boolean;
  };
}

export interface Player {
  _id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  jerseyNumber: number;
  position: string;
  dateOfBirth: string;
  nationality: string;
  height: number;
  weight: number;
  biography: string;
  image: string;
  teamId: string;
  isActive: boolean;
  isCaptain: boolean;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutes: number;
    starts: number;
    substitutions: number;
    fouls: number;
    penalties: number;
    doubleYellowCards: number;
    shots: number;
    matchesPlayed: number;
  };
  socialMedia: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PlayerFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  jerseyNumber: number;
  position: string;
  dateOfBirth: string;
  nationality: string;
  height: number;
  weight: number;
  biography: string;
  image: string;
  teamId: string;
  isActive: boolean;
  isCaptain: boolean;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutes: number;
    starts: number;
    substitutions: number;
    fouls: number;
    penalties: number;
    doubleYellowCards: number;
    shots: number;
    matchesPlayed: number;
  };
  socialMedia: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
}

export interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  dateOfBirth: string;
  nationality: string;
  biography: string;
  image: string;
  teamId: string;
  isActive: boolean;
  order: number;
  socialMedia: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  dateOfBirth: string;
  nationality: string;
  biography: string;
  image: string;
  teamId: string;
  isActive: boolean;
  order: number;
  socialMedia: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
} 
import { Team } from "./team";
import { Event } from "./event";
import { TitleReign } from "./title_reign";

export type Gender = 'MALE' | 'FEMALE' | 'N/A';
export type Allegiance = 'HEEL' | 'FACE' | 'TWEENER';
export type Role = 'WRESTLER' | 'MANAGER' | 'BOOKER' | 'REFEREE' | 'CIVILIAN';
export type FinishType = 'UNFINISHED' | 'PIN' | 'SUBMISSION' | 'DISQUALIFICATION' | 'COUNTOUT' | 'TIMEOUT' | 'ELIMINATION' | 'SPECIAL';

export type Wrestler = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  gender: Gender;
  finisherName: string;
  allegiance: Allegiance;
  role: Role;
  territoryId: number;
  promotionId: number;
  popularity: number;
  strength: number | null;
  skill: number | null;
  agility: number | null;
  stamina: number | null;
  attitude: number | null;
  managerId: number | null;
  partnerId: number | null;
  storyFriendId: number | null;
  storyEnemyId: number | null;
  realFriendId: number | null;
  realEnemyId: number | null;
  events?: Event[];
  titleReigns?: TitleReign[];
  teams?: Team[];
  isWinner?: number;
  finishType?: FinishType;
  wins: number;
  losses: number;
};

export type GroupCategory =
  | "none"
  | "gender"
  | "allegiance"
  | "role"
  | "territoryId"
  | "promotionId"
  | "alphabetical"
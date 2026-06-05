import { Team } from "./team";
import { Event } from "./event";
import { TitleReign } from "./title_reign";

type Gender = 'MALE' | 'FEMALE' | 'N/A';
type Allegiance = 'HEEL' | 'FACE' | 'TWEENER';
type Role = 'WRESTLER' | 'MANAGER' | 'BOOKER' | 'REFEREE' | 'CIVILIAN';
type FinishType = 'UNFINISHED' | 'PIN' | 'SUBMISSION' | 'DISQUALIFICATION' | 'COUNTOUT' | 'TIMEOUT' | 'ELIMINATION' | 'SPECIAL';

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
  strength: number;
  skill: number;
  agility: number;
  stamina: number;
  attitude: number;
  managerId: number | null;
  partnerId: number | null;
  storyFriendId: number | null;
  storyEnemyId: number | null;
  realFriendId: number | null;
  realEnemyId: number | null;
  events?: Event[];
  titleReigns?: TitleReign[];
  teams?: Team[];
  isWinner?: boolean;
  finishType?: FinishType;
};

export type GroupCategory =
  | "none"
  | "gender"
  | "allegiance"
  | "role"
  | "territoryId"
  | "promotionId"
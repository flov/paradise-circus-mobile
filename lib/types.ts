// Plain TS interfaces for the Paradise Circus mobile app
// Derived from the web API response shapes (no Drizzle dependencies)

export interface TimetableEvent {
  id: number;
  title: string;
  description: string | null;
  instructor: string | null;
  instructorId: number | null;
  instructorDisplayName: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  whatToBring: string | null;
  isWorkshop: boolean;
  propId: number | null;
  isPublished: boolean;
  isRecurring: boolean;
  recurringSeriesId: string | null;
  recurringUntil: string | null;
  instructorProfile?: {
    id: number;
    displayName: string | null;
    username: string;
    bio: string | null;
    instagramHandle: string | null;
  } | null;
  isBlocked?: boolean;
}

export type TimetableData = {
  [day: string]: {
    [timeSlot: string]: TimetableEvent[];
  };
};

// Shape returned by GET /api/artists
export interface ArtistListItem {
  id: string;
  name: string | null;
  avatar?: string;
  username: string;
  isInstructor: boolean | null;
  workshopCount: number;
  props: Array<{ name: string; skillLevel: number }>;
  videoCount: number;
  bio?: string | null;
  instagramHandle?: string | null;
  availableForPerformances: boolean;
  performanceStyle?: string | null;
}

export interface ArtistProp {
  propName: string;
  skillLevel: number;
}

export interface Workshop {
  id: number;
  title: string;
  description: string | null;
  instructor: string | null;
  date: string | Date;
  startTime: string;
  endTime: string;
  location: string | null;
  isRecurring: boolean;
}

export interface ArtistProfile {
  id: number;
  username: string;
  displayName: string | null;
  bio: string | null;
  instagramHandle: string | null;
  patreonPage: string | null;
  website: string | null;
  isInstructor: boolean | null;
  availableForPerformances: boolean | null;
  performanceStyle: string | null;
  location: string | null;
  avatarImageUrl: string | null;
  youtubeVideos: string[] | null;
  vimeoVideos: string[] | null;
  experienceStartDate: string | null;
}

// Shape returned by GET /api/artists/[username]
export interface ArtistProfileResponse {
  user: ArtistProfile;
  props: ArtistProp[];
  workshops: Workshop[];
}

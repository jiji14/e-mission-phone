/* This file provides typings for use in '/diary', including timeline objects (trips and places)
 and user input objects.
 As much as possible, these types parallel the types used in the server code. */

import { BaseModeKey, MotionTypeKey } from '../diary/diaryHelper';
import { ServerData, LocalDt } from './serverData';
import { FeatureCollection, Feature, Geometry } from 'geojson';

type ObjectId = { $oid: string };
export type ConfirmedPlace = {
  additions: UserInputEntry[];
  cleaned_place: ObjectId;
  ending_trip: ObjectId;
  enter_fmt_time: string; // ISO string 2023-10-31T12:00:00.000-04:00
  enter_local_dt: LocalDt;
  enter_ts: number; // Unix timestamp
  location: Geometry;
  raw_places: ObjectId[];
  source: string;
  user_input: {
    /* for keys ending in 'user_input' (e.g. 'trip_user_input'), the server gives us the raw user
      input object with 'data' and 'metadata' */
    [k: `${string}user_input`]: UserInputEntry;
    /* for keys ending in 'confirm' (e.g. 'mode_confirm'), the server just gives us the user input value
      as a string (e.g. 'walk', 'drove_alone') */
    [k: `${string}confirm`]: string;
  };
  exit_fmt_time: string;
  exit_ts: number;
  exit_local_dt: LocalDt;
  starting_trip: ObjectId;
};

export type TripTransition = {
  currstate: string;
  transition: string;
  ts: number;
};

/* These are the properties received from the server (basically matches Python code)
  This should match what Timeline.readAllCompositeTrips returns (an array of these objects) */
export type CompositeTrip = {
  _id: ObjectId;
  additions: UserInputEntry[];
  cleaned_section_summary: SectionSummary;
  cleaned_trip: ObjectId;
  confidence_threshold: number;
  confirmed_trip: ObjectId;
  distance: number;
  duration: number;
  end_confirmed_place: ServerData<ConfirmedPlace>;
  end_fmt_time: string;
  end_loc: Geometry;
  end_local_dt: LocalDt;
  end_place: ObjectId;
  end_ts: number;
  expectation: any; // TODO "{to_label: boolean}"
  expected_trip: ObjectId;
  inferred_labels: any[]; // TODO
  inferred_section_summary: SectionSummary;
  inferred_trip: ObjectId;
  key: string;
  locations: any[]; // TODO
  origin_key: string;
  raw_trip: ObjectId;
  sections: any[]; // TODO
  source: string;
  start_confirmed_place: ServerData<ConfirmedPlace>;
  start_fmt_time: string;
  start_loc: Geometry;
  start_local_dt: LocalDt;
  start_place: ObjectId;
  start_ts: number;
  user_input: {
    /* for keys ending in 'user_input' (e.g. 'trip_user_input'), the server gives us the raw user
      input object with 'data' and 'metadata' */
    [k: `${string}user_input`]: UserInputEntry;
    /* for keys ending in 'confirm' (e.g. 'mode_confirm'), the server just gives us the user input value
      as a string (e.g. 'walk', 'drove_alone') */
    [k: `${string}confirm`]: string;
  };
};

/* The 'timeline' for a user is a list of their trips and places,
 so a 'timeline entry' is either a trip or a place. */
export type TimelineEntry = ConfirmedPlace | CompositeTrip;

/* These properties aren't received from the server, but are derived from the above properties.
  They are used in the UI to display trip/place details and are computed by the useDerivedProperties hook. */
export type DerivedProperties = {
  displayDate: string;
  displayStartTime: string;
  displayEndTime: string;
  displayTime: string;
  displayStartDateAbbr: string;
  displayEndDateAbbr: string;
  formattedDistance: string;
  formattedSectionProperties: any[]; // TODO
  distanceSuffix: string;
  detectedModes: { mode: string; icon: string; color: string; pct: number | string }[];
};

export type SectionSummary = {
  count: { [k: MotionTypeKey | BaseModeKey]: number };
  distance: { [k: MotionTypeKey | BaseModeKey]: number };
  duration: { [k: MotionTypeKey | BaseModeKey]: number };
};

export type UserInputEntry = {
  data: {
    end_ts: number;
    start_ts: number;
    label: string;
    start_local_dt?: LocalDt;
    end_local_dt?: LocalDt;
    status?: string;
    match_id?: string;
  };
  metadata: {
    time_zone: string;
    plugin: string;
    write_ts: number;
    platform: string;
    read_ts: number;
    key: string;
  };
  key?: string;
};

export type Location = {
  speed: number;
  heading: number;
  local_dt: LocalDt;
  idx: number;
  section: ObjectId;
  longitude: number;
  latitude: number;
  fmt_time: string; // ISO
  mode: number;
  loc: Geometry;
  ts: number; // Unix
  altitude: number;
  distance: number;
};

// used in readAllCompositeTrips
export type SectionData = {
  end_ts: number; // Unix time, e.x. 1696352498.804
  end_loc: Geometry;
  start_fmt_time: string; // ISO time
  end_fmt_time: string;
  trip_id: ObjectId;
  sensed_mode: number;
  source: string; // e.x., "SmoothedHighConfidenceMotion"
  start_ts: number; // Unix
  start_loc: Geometry;
  cleaned_section: ObjectId;
  start_local_dt: LocalDt;
  end_local_dt: LocalDt;
  sensed_mode_str: string; //e.x., "CAR"
  duration: number;
  distance: number;
};

export type GeoJSONStyledFeature = Feature & { style?: { color: string } };

export type GeoJSONData = {
  data: FeatureCollection & { id: string; properties: { start_ts: number; end_ts: number } };
};

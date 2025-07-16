// NASA API Response Types

export interface APODResponse {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
  thumbnail_url?: string;
}

export interface MarsRoverPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface MarsRoverResponse {
  photos: MarsRoverPhoto[];
}

export interface MarsRover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date: string;
  total_photos: number;
  cameras: Array<{
    name: string;
    full_name: string;
  }>;
}

export interface MarsRoversResponse {
  rovers: MarsRover[];
}

export interface NearEarthObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    miles: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    feet: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
    };
    orbiting_body: string;
  }>;
  is_sentry_object: boolean;
}

export interface NeoWsResponse {
  links: {
    self: string;
    next?: string;
    prev?: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NearEarthObject[];
  };
}

export interface EPICImage {
  identifier: string;
  caption: string;
  image: string;
  version: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
  dscovr_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  lunar_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  sun_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
  attitude_quaternions: {
    q0: number;
    q1: number;
    q2: number;
    q3: number;
  };
  date: string;
  coords: {
    centroid_coordinates: {
      lat: number;
      lon: number;
    };
    dscovr_j2000_position: {
      x: number;
      y: number;
      z: number;
    };
    lunar_j2000_position: {
      x: number;
      y: number;
      z: number;
    };
    sun_j2000_position: {
      x: number;
      y: number;
      z: number;
    };
    attitude_quaternions: {
      q0: number;
      q1: number;
      q2: number;
      q3: number;
    };
  };
}

export interface NASAImageSearchResult {
  collection: {
    href: string;
    items: Array<{
      href: string;
      data: Array<{
        center: string;
        title: string;
        nasa_id: string;
        date_created: string;
        media_type: string;
        description: string;
        keywords: string[];
        location: string;
        photographer: string;
        secondary_creator: string;
        album: string[];
        description_508: string;
      }>;
      links: Array<{
        href: string;
        rel: string;
        render: string;
      }>;
    }>;
    metadata: {
      total_hits: number;
    };
    version: string;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface DashboardData {
  apod: APODResponse | null;
  marsRoverData: MarsRoverResponse | null;
  neoData: NeoWsResponse | null;
  errors: {
    apod: string | null;
    marsRoverData: string | null;
    neoData: string | null;
  };
} 
/// <reference types="vite/client" />
import axios from 'axios';
import {
  APODResponse,
  MarsRoverResponse,
  MarsRoversResponse,
  NeoWsResponse,
  EPICImage,
  NASAImageSearchResult,
  APIResponse,
  DashboardData
} from '../types/nasa';

const API_BASE_URL = 'https://5484f7c93ecd.ngrok-free.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1'
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const nasaAPI = {
  // Dashboard - Get multiple data sources
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get<APIResponse<DashboardData>>('/nasa/dashboard');

    return response.data.data;
  },

  // APOD - Astronomy Picture of the Day
  getAPOD: async (date?: string, startDate?: string, endDate?: string): Promise<APODResponse | APODResponse[]> => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);

    const response = await api.get<APIResponse<APODResponse | APODResponse[]>>(`/nasa/apod?${params}`);
    return response.data.data;
  },

  // Mars Rover Photos
  getMarsRoverPhotos: async (
    rover: string = 'curiosity',
    sol?: number,
    earthDate?: string,
    camera?: string,
    page: number = 1
  ): Promise<MarsRoverResponse> => {
    const params = new URLSearchParams();
    params.append('rover', rover);
    params.append('page', page.toString());
    if (typeof sol === 'number' && !isNaN(sol)) params.append('sol', sol.toString());
    if (earthDate && earthDate !== '') params.append('earth_date', earthDate);
    if (camera && camera !== '') params.append('camera', camera);
    console.log('MarsRover API params:', params.toString());
    const response = await api.get<APIResponse<MarsRoverResponse>>(`/nasa/mars-rover?${params}`);
    return response.data.data;
  },

  // Available Mars Rovers
  getMarsRovers: async (): Promise<MarsRoversResponse> => {
    const response = await api.get<APIResponse<MarsRoversResponse>>('/nasa/mars-rovers');
    return response.data.data;
  },

  // Mars Rover Manifest
  getMarsRoverManifest: async (rover: string): Promise<any> => {
    const response = await api.get<APIResponse<any>>(`/nasa/mars-rover-manifest/${rover}`);
    return response.data.data;
  },

  // Near Earth Objects
  getNearEarthObjects: async (startDate: string, endDate?: string): Promise<NeoWsResponse> => {
    const params = new URLSearchParams({ start_date: startDate });
    if (endDate) params.append('end_date', endDate);

    const response = await api.get<APIResponse<NeoWsResponse>>(`/nasa/neo?${params}`);
    return response.data.data;
  },

  // Asteroid Details
  getAsteroidDetails: async (asteroidId: string): Promise<any> => {
    const response = await api.get<APIResponse<any>>(`/nasa/asteroid/${asteroidId}`);
    return response.data.data;
  },

  // EPIC Images
  getEPICImages: async (date?: string, type: 'natural' | 'enhanced' = 'natural'): Promise<EPICImage[]> => {
    const params = new URLSearchParams({ type });
    if (date) params.append('date', date);

    const response = await api.get<APIResponse<EPICImage[]>>(`/nasa/epic?${params}`);
    return response.data.data;
  },

  // NASA Image and Video Library Search
  searchNASAImages: async (
    query: string,
    mediaType: string = 'image',
    yearStart?: number,
    yearEnd?: number,
    page: number = 1
  ): Promise<NASAImageSearchResult> => {
    const params = new URLSearchParams({
      q: query,
      media_type: mediaType,
      page: page.toString(),
    });
    if (yearStart) params.append('year_start', yearStart.toString());
    if (yearEnd) params.append('year_end', yearEnd.toString());

    const response = await api.get<APIResponse<NASAImageSearchResult>>(`/nasa/search?${params}`);
    return response.data.data;
  },
};

export default nasaAPI; 
export interface GarbageReport {
  id: string;
  place: string;
  ward: string;
  source: 'Citizen report' | 'Field inspection' | 'IoT Overflow' | 'Sanitation Supervisor';
  category: 'Mixed Waste' | 'Plastic & Dry' | 'Commercial Dump' | 'Organic / Kitchen' | 'Debris';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  status: 'Open' | 'Reviewing' | 'Action Scheduled' | 'Resolved';
  lat: number;
  lng: number;
  reportCountCluster?: number;
  notes?: string;
  citizenName?: string;
  photo?: string;
}

export interface Dustbin {
  id: string;
  place: string;
  ward: string;
  type: string;
  capacityLiters: number;
  fillLevelPercent: number;
  lastCleaned: string;
  status: 'Active' | 'Needs service' | 'Overfilled' | 'Newly placed';
  lat: number;
  lng: number;
  installDate?: string;
}

export interface Recommendation {
  id: string;
  place: string;
  ward: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Installed';
  lat: number;
  lng: number;
  clusterReportsCount: number;
  nearestBinDistanceMeters: number;
  urgency: 'Medium' | 'High' | 'Critical';
  suggestedType: string;
  projectedReductionPercent: number;
  approvedAt?: string;
  createdBinId?: string;
}

export interface SystemSettings {
  lookbackDays: number;
  hotspotRadiusMeters: number;
  triggerReportsThreshold: number;
  currentWard: string;
  autoAlgorithmActive: boolean;
  municipalityName: string;
}

export interface SelectedEntity {
  type: 'hotspot' | 'bin' | 'recommendation';
  data: GarbageReport | Dustbin | Recommendation;
}

export interface StatsData {
  openHotspots: number;
  totalReports: number;
  totalBins: number;
  activeBinsWard4: number;
  pendingRecommendations: number;
  approvedRecommendations: number;
  complaintReductionPercent: number;
  daysTracked: number;
  ward: string;
  citizenVerifiedStars?: number;
  citizenCertificates?: number;
}

export interface CitizenReport {
  id: string;
  citizenName: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
  photo: string;
  date: string;
  status: 'Pending Verification' | 'Genuine · Star awarded' | 'Rejected';
  earned: boolean;
}

export interface CitizenData {
  stars: number;
  certificates: number;
  medals: number;
  reports: CitizenReport[];
}

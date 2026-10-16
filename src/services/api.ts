import { GarbageReport, Dustbin, Recommendation, SystemSettings, StatsData } from '../types';

export const fallbackReports: GarbageReport[] = [
  { id: 'GR-1042', place: 'Main Road, Ward 4', ward: 'Ward 4', source: 'Citizen report', category: 'Mixed Waste', severity: 'High', date: 'Today, 10:25 AM', status: 'Open', lat: 18.524, lng: 73.859, reportCountCluster: 6, notes: 'Repeated open dumping near corner vegetable vendors.' },
  { id: 'GR-1041', place: 'Shivaji Chowk', ward: 'Ward 4', source: 'Field inspection', category: 'Plastic & Dry', severity: 'High', date: 'Yesterday, 04:15 PM', status: 'Open', lat: 18.5208, lng: 73.8528, reportCountCluster: 4, notes: 'Heavy pedestrian foot traffic and snack stall overflow.' },
  { id: 'GR-1040', place: 'Market Lane', ward: 'Ward 4', source: 'Citizen report', category: 'Organic / Kitchen', severity: 'Medium', date: 'Yesterday, 11:30 AM', status: 'Reviewing', lat: 18.518, lng: 73.861, reportCountCluster: 5, notes: 'Vegetable waste bags piling up outside drainage line.' },
  { id: 'GR-1039', place: 'Gandhi Nagar', ward: 'Ward 4', source: 'Citizen report', category: 'Mixed Waste', severity: 'Medium', date: '14 Oct 2026, 02:40 PM', status: 'Open', lat: 18.5265, lng: 73.854, reportCountCluster: 3, notes: 'Residential roadside accumulation.' },
  { id: 'GR-1038', place: 'Bus Stand Road', ward: 'Ward 4', source: 'Field inspection', category: 'Plastic & Dry', severity: 'Critical', date: '13 Oct 2026, 09:10 AM', status: 'Resolved', lat: 18.527, lng: 73.848, reportCountCluster: 5, notes: 'Frequent bus passenger litter near depot entrance.' },
  { id: 'GR-1037', place: 'River Road', ward: 'Ward 4', source: 'Citizen report', category: 'Commercial Dump', severity: 'Low', date: '12 Oct 2026, 05:00 PM', status: 'Reviewing', lat: 18.5195, lng: 73.865, reportCountCluster: 2, notes: 'Packaging cartons left behind after evening bazaar.' },
  { id: 'GR-1036', place: 'Park Street', ward: 'Ward 4', source: 'Sanitation Supervisor', category: 'Plastic & Dry', severity: 'Low', date: '11 Oct 2026, 08:30 AM', status: 'Resolved', lat: 18.529, lng: 73.862, reportCountCluster: 2, notes: 'Single pile cleared during morning sweep.' },
  { id: 'GR-1035', place: 'Old Post Office Road', ward: 'Ward 4', source: 'Citizen report', category: 'Mixed Waste', severity: 'Medium', date: '10 Oct 2026, 01:20 PM', status: 'Open', lat: 18.522, lng: 73.847, reportCountCluster: 3, notes: 'Waste left alongside boundary wall.' },
  { id: 'GR-1034', place: 'Station Road', ward: 'Ward 4', source: 'Citizen report', category: 'Mixed Waste', severity: 'High', date: '09 Oct 2026, 07:45 PM', status: 'Open', lat: 18.5155, lng: 73.852, reportCountCluster: 4, notes: 'Rickshaw stand corner needs dedicated waste bin.' },
  { id: 'GR-1033', place: 'Gandhi Nagar East', ward: 'Ward 4', source: 'Citizen report', category: 'Organic / Kitchen', severity: 'Low', date: '08 Oct 2026, 10:15 AM', status: 'Resolved', lat: 18.5255, lng: 73.855, reportCountCluster: 2, notes: 'Garden trimming debris collected by municipal van.' },
  { id: 'GR-1032', place: 'Market Lane South', ward: 'Ward 4', source: 'Field inspection', category: 'Mixed Waste', severity: 'Medium', date: '07 Oct 2026, 03:20 PM', status: 'Open', lat: 18.5165, lng: 73.858, reportCountCluster: 3, notes: 'Litter scattered around corner light pole.' },
  { id: 'GR-1031', place: 'Main Road South', ward: 'Ward 4', source: 'Citizen report', category: 'Debris', severity: 'Low', date: '06 Oct 2026, 12:00 PM', status: 'Resolved', lat: 18.517, lng: 73.855, reportCountCluster: 1, notes: 'Construction remnants removed.' }
];

export const fallbackBins: Dustbin[] = [
  { id: 'D-042', place: 'Near Market Road, Ward 4', ward: 'Ward 4', type: 'Wet & Dry (2-compartment)', capacityLiters: 80, fillLevelPercent: 68, lastCleaned: '12 Oct 2026, 06:30 AM', status: 'Active', lat: 18.5227, lng: 73.8567 },
  { id: 'D-043', place: 'Gandhi Nagar Central', ward: 'Ward 4', type: 'General waste', capacityLiters: 120, fillLevelPercent: 42, lastCleaned: '14 Oct 2026, 07:00 AM', status: 'Active', lat: 18.5262, lng: 73.8505 },
  { id: 'D-044', place: 'City Park Entrance', ward: 'Ward 4', type: 'Recyclables (3-bin station)', capacityLiters: 150, fillLevelPercent: 88, lastCleaned: '11 Oct 2026, 08:15 AM', status: 'Needs service', lat: 18.529, lng: 73.862 },
  { id: 'D-039', place: 'Civil Hospital Gate', ward: 'Ward 4', type: 'Wet & Dry (2-compartment)', capacityLiters: 120, fillLevelPercent: 54, lastCleaned: '15 Oct 2026, 05:45 AM', status: 'Active', lat: 18.5312, lng: 73.854 },
  { id: 'D-040', place: 'Subhash High School', ward: 'Ward 4', type: 'General waste', capacityLiters: 60, fillLevelPercent: 30, lastCleaned: '14 Oct 2026, 06:10 AM', status: 'Active', lat: 18.519, lng: 73.849 },
  { id: 'D-041', place: 'Railway Crossing West', ward: 'Ward 4', type: 'Smart Sensor Compactor', capacityLiters: 240, fillLevelPercent: 74, lastCleaned: '13 Oct 2026, 07:30 AM', status: 'Active', lat: 18.514, lng: 73.857 }
];

export const fallbackRecs: Recommendation[] = [
  {
    id: 'R-17',
    place: 'Main Road, Ward 4',
    ward: 'Ward 4',
    reason: '6 garbage reports recorded within 150 metres in the last 30 days, with no existing bin in direct pedestrian reach.',
    status: 'Pending',
    lat: 18.524,
    lng: 73.859,
    clusterReportsCount: 6,
    nearestBinDistanceMeters: 295,
    urgency: 'High',
    suggestedType: 'Wet & Dry (2-compartment, 120L)',
    projectedReductionPercent: 42
  },
  {
    id: 'R-18',
    place: 'Shivaji Chowk Junction',
    ward: 'Ward 4',
    reason: 'Repeated reports near a busy pedestrian commercial intersection; foot traffic exceeds current roadside disposal capacity.',
    status: 'Pending',
    lat: 18.5208,
    lng: 73.8528,
    clusterReportsCount: 4,
    nearestBinDistanceMeters: 380,
    urgency: 'High',
    suggestedType: 'Heavy-Duty Twin Compartment (150L)',
    projectedReductionPercent: 38
  },
  {
    id: 'R-19',
    place: 'Market Lane Produce Row',
    ward: 'Ward 4',
    reason: 'Dense complaint cluster and morning vegetable market organic overflow requiring high-capacity wet waste segregation.',
    status: 'Pending',
    lat: 18.518,
    lng: 73.861,
    clusterReportsCount: 5,
    nearestBinDistanceMeters: 360,
    urgency: 'Critical',
    suggestedType: 'Wet Waste High-Capacity (240L)',
    projectedReductionPercent: 45
  },
  {
    id: 'R-20',
    place: 'Bus Stand Road Transit Stop',
    ward: 'Ward 4',
    reason: 'Litter reports recur around the bus stop boarding shelter with zero dustbins along a 280-metre stretch.',
    status: 'Pending',
    lat: 18.527,
    lng: 73.848,
    clusterReportsCount: 4,
    nearestBinDistanceMeters: 320,
    urgency: 'Medium',
    suggestedType: 'Pole-Mounted Litter Bin (60L)',
    projectedReductionPercent: 35
  }
];

export const fallbackSettings: SystemSettings = {
  lookbackDays: 30,
  hotspotRadiusMeters: 150,
  triggerReportsThreshold: 4,
  currentWard: 'Ward 4',
  autoAlgorithmActive: true,
  municipalityName: 'Pune Municipal Corporation (PMC)'
};

// API Client Helper
export const api = {
  async getStats(): Promise<StatsData> {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return {
        openHotspots: 12,
        totalReports: 12,
        totalBins: 28,
        activeBinsWard4: 6,
        pendingRecommendations: 4,
        approvedRecommendations: 3,
        complaintReductionPercent: 40,
        daysTracked: 28,
        ward: 'Ward 4'
      };
    }
  },

  async getReports(): Promise<GarbageReport[]> {
    try {
      const res = await fetch('/api/reports');
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return fallbackReports;
    }
  },

  async addReport(report: Partial<GarbageReport>): Promise<GarbageReport> {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      const newId = `GR-${Math.floor(1043 + Math.random() * 500)}`;
      return {
        id: newId,
        place: report.place || 'Ward 4 Location',
        ward: report.ward || 'Ward 4',
        source: report.source || 'Citizen report',
        category: report.category || 'Mixed Waste',
        severity: report.severity || 'Medium',
        date: 'Just now',
        status: 'Open',
        lat: report.lat || 18.522 + (Math.random() - 0.5) * 0.015,
        lng: report.lng || 73.856 + (Math.random() - 0.5) * 0.015,
        reportCountCluster: 1,
        notes: report.notes || 'Citizen reported garbage accumulation.'
      };
    }
  },

  async updateReportStatus(id: string, status: GarbageReport['status']): Promise<GarbageReport | null> {
    try {
      const res = await fetch(`/api/reports/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return null;
    }
  },

  async getBins(): Promise<Dustbin[]> {
    try {
      const res = await fetch('/api/bins');
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return fallbackBins;
    }
  },

  async addBin(bin: Partial<Dustbin>): Promise<Dustbin> {
    try {
      const res = await fetch('/api/bins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bin)
      });
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      const id = `D-0${Math.floor(45 + Math.random() * 50)}`;
      return {
        id,
        place: bin.place || 'New Ward Location',
        ward: bin.ward || 'Ward 4',
        type: bin.type || 'Wet & Dry (2-compartment)',
        capacityLiters: bin.capacityLiters || 80,
        fillLevelPercent: 0,
        lastCleaned: 'Not yet cleaned (New)',
        status: 'Active',
        lat: bin.lat || 18.522 + (Math.random() - 0.5) * 0.012,
        lng: bin.lng || 73.856 + (Math.random() - 0.5) * 0.012,
        installDate: 'Today'
      };
    }
  },

  async getRecommendations(): Promise<Recommendation[]> {
    try {
      const res = await fetch('/api/recommendations');
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return fallbackRecs;
    }
  },

  async approveRecommendation(id: string): Promise<{ message: string; recommendation: Recommendation; newBin: Dustbin }> {
    const res = await fetch(`/api/recommendations/${id}/approve`, {
      method: 'POST'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to approve recommendation');
    }
    return await res.json();
  },

  async recalculateRecommendations(): Promise<{ message: string; recommendations: Recommendation[] }> {
    const res = await fetch('/api/recommendations/recalculate', {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to recalculate');
    return await res.json();
  },

  async getSettings(): Promise<SystemSettings> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      return fallbackSettings;
    }
  },

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const data = await res.json();
    return data.settings;
  },

  async getCitizenData(): Promise<{ stars: number; certificates: number; medals: number; reports: any[] }> {
    try {
      const res = await fetch('/api/citizen/data');
      if (!res.ok) throw new Error('Failed to fetch citizen data');
      return await res.json();
    } catch {
      return fallbackCitizenData;
    }
  },

  async submitCitizenReport(report: { citizenName: string; address: string; description: string; lat: number; lng: number; photo: string }): Promise<{ message: string; report: any }> {
    try {
      const res = await fetch('/api/citizen/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (!res.ok) throw new Error('Failed to submit citizen report');
      return await res.json();
    } catch {
      const reportId = `SSR-${String(Date.now()).slice(-7)}`;
      return {
        message: 'Report submitted in offline mode. Waiting for verification.',
        report: {
          id: reportId,
          citizenName: report.citizenName || 'Citizen Contributor',
          address: report.address,
          description: report.description,
          lat: report.lat,
          lng: report.lng,
          photo: report.photo || 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&q=80',
          date: 'Today, Just now',
          status: 'Pending Verification',
          earned: false
        }
      };
    }
  },

  async verifyCitizenReport(id: string, decision: 'genuine' | 'rejected'): Promise<{ message: string; report: any; citizenData: any }> {
    try {
      const res = await fetch(`/api/citizen/verify/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision })
      });
      if (!res.ok) throw new Error('Failed to verify report');
      return await res.json();
    } catch {
      return {
        message: decision === 'genuine' ? 'Report verified! Star awarded.' : 'Report marked as rejected.',
        report: { id, status: decision === 'genuine' ? 'Genuine · Star awarded' : 'Rejected', earned: decision === 'genuine' },
        citizenData: fallbackCitizenData
      };
    }
  },

  async resetDemo(): Promise<void> {
    await fetch('/api/reset', { method: 'POST' });
  }
};

export const fallbackCitizenData = {
  stars: 7,
  certificates: 0,
  medals: 0,
  reports: [
    {
      id: 'SSR-1049281',
      citizenName: 'Govind Shelke',
      address: 'Near Market Road, Ward 4',
      description: 'Vegetable waste bags piling up outside drainage line.',
      lat: 18.518,
      lng: 73.861,
      photo: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&q=80',
      date: '15 Oct 2026',
      status: 'Genuine · Star awarded' as const,
      earned: true
    },
    {
      id: 'SSR-1049282',
      citizenName: 'Govind Shelke',
      address: 'Shivaji Chowk Corner',
      description: 'Plastic food wrappers and tea cups scattered along footpath.',
      lat: 18.5208,
      lng: 73.8528,
      photo: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&q=80',
      date: '14 Oct 2026',
      status: 'Genuine · Star awarded' as const,
      earned: true
    },
    {
      id: 'SSR-1049283',
      citizenName: 'Govind Shelke',
      address: 'Main Road Bus Stop, Ward 4',
      description: 'Overflowing roadside litter bin needing immediate clearance.',
      lat: 18.524,
      lng: 73.859,
      photo: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&q=80',
      date: 'Today, 08:30 AM',
      status: 'Pending Verification' as const,
      earned: false
    }
  ]
};


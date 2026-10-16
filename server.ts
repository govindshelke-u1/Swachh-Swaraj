import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
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

// Initial In-Memory Seed Data (reflecting user's civic portal)
let reports: GarbageReport[] = [
  { id: 'GR-1042', place: 'Main Road, Ward 4', ward: 'Ward 4', source: 'Citizen report', category: 'Mixed Waste', severity: 'High', date: 'Today, 10:25 AM', status: 'Open', lat: 18.524, lng: 73.859, reportCountCluster: 6, notes: 'Repeated open dumping near corner vegetable vendors.', citizenName: 'Govind Shelke' },
  { id: 'GR-1041', place: 'Shivaji Chowk', ward: 'Ward 4', source: 'Field inspection', category: 'Plastic & Dry', severity: 'High', date: 'Yesterday, 04:15 PM', status: 'Open', lat: 18.5208, lng: 73.8528, reportCountCluster: 4, notes: 'Heavy pedestrian foot traffic and snack stall overflow.' },
  { id: 'GR-1040', place: 'Market Lane', ward: 'Ward 4', source: 'Citizen report', category: 'Organic / Kitchen', severity: 'Medium', date: 'Yesterday, 11:30 AM', status: 'Reviewing', lat: 18.518, lng: 73.861, reportCountCluster: 5, notes: 'Vegetable waste bags piling up outside drainage line.', citizenName: 'Rajesh Patil' },
  { id: 'GR-1039', place: 'Gandhi Nagar', ward: 'Ward 4', source: 'Citizen report', category: 'Mixed Waste', severity: 'Medium', date: '14 Oct 2026, 02:40 PM', status: 'Open', lat: 18.5265, lng: 73.854, reportCountCluster: 3, notes: 'Residential roadside accumulation.', citizenName: 'Ananya Deshmukh' },
  { id: 'GR-1038', place: 'Bus Stand Road', ward: 'Ward 4', source: 'Field inspection', category: 'Plastic & Dry', severity: 'Critical', date: '13 Oct 2026, 09:10 AM', status: 'Resolved', lat: 18.527, lng: 73.848, reportCountCluster: 5, notes: 'Frequent bus passenger litter near depot entrance.' },
  { id: 'GR-1037', place: 'River Road', ward: 'Ward 4', source: 'Citizen report', category: 'Commercial Dump', severity: 'Low', date: '12 Oct 2026, 05:00 PM', status: 'Reviewing', lat: 18.5195, lng: 73.865, reportCountCluster: 2, notes: 'Packaging cartons left behind after evening bazaar.', citizenName: 'Sunil Shinde' },
  { id: 'GR-1036', place: 'Park Street', ward: 'Ward 4', source: 'Sanitation Supervisor', category: 'Plastic & Dry', severity: 'Low', date: '11 Oct 2026, 08:30 AM', status: 'Resolved', lat: 18.529, lng: 73.862, reportCountCluster: 2, notes: 'Single pile cleared during morning sweep.' },
  { id: 'GR-1035', place: 'Old Post Office Road', ward: 'Ward 4', source: 'Citizen report', category: 'Mixed Waste', severity: 'Medium', date: '10 Oct 2026, 01:20 PM', status: 'Open', lat: 18.522, lng: 73.847, reportCountCluster: 3, notes: 'Waste left alongside boundary wall.', citizenName: 'Priya Kulkarni' },
  { id: 'GR-1034', place: 'Station Road', ward: 'Ward 4', source: 'Citizen report', category: 'Mixed Waste', severity: 'High', date: '09 Oct 2026, 07:45 PM', status: 'Open', lat: 18.5155, lng: 73.852, reportCountCluster: 4, notes: 'Rickshaw stand corner needs dedicated waste bin.', citizenName: 'Vikas Jadhav' },
  { id: 'GR-1033', place: 'Gandhi Nagar East', ward: 'Ward 4', source: 'Citizen report', category: 'Organic / Kitchen', severity: 'Low', date: '08 Oct 2026, 10:15 AM', status: 'Resolved', lat: 18.5255, lng: 73.855, reportCountCluster: 2, notes: 'Garden trimming debris collected by municipal van.' },
  { id: 'GR-1032', place: 'Market Lane South', ward: 'Ward 4', source: 'Field inspection', category: 'Mixed Waste', severity: 'Medium', date: '07 Oct 2026, 03:20 PM', status: 'Open', lat: 18.5165, lng: 73.858, reportCountCluster: 3, notes: 'Litter scattered around corner light pole.' },
  { id: 'GR-1031', place: 'Main Road South', ward: 'Ward 4', source: 'Citizen report', category: 'Debris', severity: 'Low', date: '06 Oct 2026, 12:00 PM', status: 'Resolved', lat: 18.517, lng: 73.855, reportCountCluster: 1, notes: 'Construction remnants removed.' }
];

let bins: Dustbin[] = [
  { id: 'D-042', place: 'Near Market Road, Ward 4', ward: 'Ward 4', type: 'Wet & Dry (2-compartment)', capacityLiters: 80, fillLevelPercent: 68, lastCleaned: '12 Oct 2026, 06:30 AM', status: 'Active', lat: 18.5227, lng: 73.8567 },
  { id: 'D-043', place: 'Gandhi Nagar Central', ward: 'Ward 4', type: 'General waste', capacityLiters: 120, fillLevelPercent: 42, lastCleaned: '14 Oct 2026, 07:00 AM', status: 'Active', lat: 18.5262, lng: 73.8505 },
  { id: 'D-044', place: 'City Park Entrance', ward: 'Ward 4', type: 'Recyclables (3-bin station)', capacityLiters: 150, fillLevelPercent: 88, lastCleaned: '11 Oct 2026, 08:15 AM', status: 'Needs service', lat: 18.529, lng: 73.862 },
  { id: 'D-039', place: 'Civil Hospital Gate', ward: 'Ward 4', type: 'Wet & Dry (2-compartment)', capacityLiters: 120, fillLevelPercent: 54, lastCleaned: '15 Oct 2026, 05:45 AM', status: 'Active', lat: 18.5312, lng: 73.854 },
  { id: 'D-040', place: 'Subhash High School', ward: 'Ward 4', type: 'General waste', capacityLiters: 60, fillLevelPercent: 30, lastCleaned: '14 Oct 2026, 06:10 AM', status: 'Active', lat: 18.519, lng: 73.849 },
  { id: 'D-041', place: 'Railway Crossing West', ward: 'Ward 4', type: 'Smart Sensor Compactor', capacityLiters: 240, fillLevelPercent: 74, lastCleaned: '13 Oct 2026, 07:30 AM', status: 'Active', lat: 18.514, lng: 73.857 }
];

let recommendations: Recommendation[] = [
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

let settings: SystemSettings = {
  lookbackDays: 30,
  hotspotRadiusMeters: 150,
  triggerReportsThreshold: 4,
  currentWard: 'Ward 4',
  autoAlgorithmActive: true,
  municipalityName: 'Pune Municipal Corporation (PMC)'
};

let citizenData = {
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
  ] as CitizenReport[]
};

let approvedRecCount = 3;

// Haversine distance calculator in meters
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Allow larger JSON bodies for photo upload data URLs
  app.use(express.json({ limit: '10mb' }));

  // API Health
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'Swachh Swaraj Municipal Waste Management Backend',
      timestamp: new Date().toISOString(),
      version: '1.3.0'
    });
  });

  // Overview Stats
  app.get('/api/stats', (_req: Request, res: Response) => {
    const totalReports = reports.length;
    const openHotspots = reports.filter(r => r.status === 'Open' || r.status === 'Reviewing').length;
    const totalBins = bins.length;
    const pendingRecs = recommendations.filter(r => r.status === 'Pending').length;
    const approvedRecs = recommendations.filter(r => r.status === 'Approved' || r.status === 'Installed').length + approvedRecCount;

    res.json({
      openHotspots,
      totalReports,
      totalBins: totalBins + 22,
      activeBinsWard4: totalBins,
      pendingRecommendations: pendingRecs,
      approvedRecommendations: approvedRecs,
      complaintReductionPercent: 40,
      daysTracked: 28,
      ward: settings.currentWard,
      citizenVerifiedStars: citizenData.stars,
      citizenCertificates: citizenData.certificates
    });
  });

  // Citizen Portal Endpoints
  app.get('/api/citizen/data', (_req: Request, res: Response) => {
    res.json(citizenData);
  });

  app.post('/api/citizen/reports', (req: Request, res: Response) => {
    const { citizenName, address, description, lat, lng, photo } = req.body;
    if (!address) {
      res.status(400).json({ error: 'Address is required' });
      return;
    }

    const reportId = `SSR-${String(Date.now()).slice(-7)}`;
    const newCitizenReport: CitizenReport = {
      id: reportId,
      citizenName: citizenName || 'Citizen Contributor',
      address,
      description: description || 'Cleanliness issue reported via citizen app.',
      lat: typeof lat === 'number' ? lat : 18.522,
      lng: typeof lng === 'number' ? lng : 73.856,
      photo: photo || 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400&q=80',
      date: 'Today, Just now',
      status: 'Pending Verification',
      earned: false
    };

    citizenData.reports.unshift(newCitizenReport);

    // Also mirror into municipal reports so officers see it on map & dashboard
    const municipalId = `GR-${1043 + reports.length}`;
    reports.unshift({
      id: municipalId,
      place: address,
      ward: settings.currentWard,
      source: 'Citizen report',
      category: 'Mixed Waste',
      severity: 'Medium',
      date: 'Today, Just now',
      status: 'Open',
      lat: newCitizenReport.lat,
      lng: newCitizenReport.lng,
      reportCountCluster: 1,
      notes: `${citizenName || 'Citizen'}: ${description || 'Cleanliness report'}`,
      citizenName: newCitizenReport.citizenName,
      photo: newCitizenReport.photo
    });

    res.status(201).json({
      message: 'Cleanliness report submitted successfully. Awaiting municipal verification.',
      report: newCitizenReport
    });
  });

  // Verify Citizen Report & Award Stars (Officer Action)
  app.post('/api/citizen/verify/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { decision } = req.body; // 'genuine' | 'rejected'

    const rep = citizenData.reports.find(r => r.id === id);
    if (!rep) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    if (decision === 'genuine') {
      rep.status = 'Genuine · Star awarded';
      if (!rep.earned) {
        rep.earned = true;
        citizenData.stars += 1;
        if (citizenData.stars % 10 === 0) {
          citizenData.certificates += 1;
          if (citizenData.certificates % 10 === 0) {
            citizenData.medals += 1;
          }
        }
      }
    } else {
      rep.status = 'Rejected';
    }

    // Also update matching municipal report if any
    const municipalReport = reports.find(r => r.place === rep.address);
    if (municipalReport) {
      municipalReport.status = decision === 'genuine' ? 'Reviewing' : 'Resolved';
    }

    res.json({
      message: decision === 'genuine' ? 'Report verified! Star awarded to citizen.' : 'Report marked as rejected.',
      report: rep,
      citizenData
    });
  });

  // Reports Endpoints
  app.get('/api/reports', (req: Request, res: Response) => {
    const { status, ward } = req.query;
    let filtered = [...reports];
    if (status && typeof status === 'string' && status !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }
    if (ward && typeof ward === 'string' && ward !== 'All wards') {
      filtered = filtered.filter(r => r.ward === ward);
    }
    res.json(filtered);
  });

  app.post('/api/reports', (req: Request, res: Response) => {
    const { place, source, category, severity, lat, lng, notes, ward, citizenName, photo } = req.body;
    if (!place) {
      res.status(400).json({ error: 'Place name is required' });
      return;
    }

    const newId = `GR-${1043 + reports.length}`;
    const newReport: GarbageReport = {
      id: newId,
      place,
      ward: ward || settings.currentWard,
      source: source || 'Citizen report',
      category: category || 'Mixed Waste',
      severity: severity || 'Medium',
      date: 'Just now',
      status: 'Open',
      lat: typeof lat === 'number' ? lat : 18.522 + (Math.random() - 0.5) * 0.015,
      lng: typeof lng === 'number' ? lng : 73.856 + (Math.random() - 0.5) * 0.015,
      reportCountCluster: 1,
      notes: notes || 'Citizen reported garbage accumulation.',
      citizenName,
      photo
    };

    reports.unshift(newReport);
    res.status(201).json(newReport);
  });

  app.patch('/api/reports/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const report = reports.find(r => r.id === id);
    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }
    if (['Open', 'Reviewing', 'Action Scheduled', 'Resolved'].includes(status)) {
      report.status = status;
    }
    res.json(report);
  });

  app.delete('/api/reports/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }
    const removed = reports.splice(index, 1)[0];
    res.json({ message: 'Report removed', report: removed });
  });

  // Dustbins Endpoints
  app.get('/api/bins', (_req: Request, res: Response) => {
    res.json(bins);
  });

  app.post('/api/bins', (req: Request, res: Response) => {
    const { place, type, capacityLiters, lat, lng, status, ward } = req.body;
    const nextNum = 45 + bins.length;
    const newBin: Dustbin = {
      id: `D-${String(nextNum).padStart(3, '0')}`,
      place: place || `Ward Location near #${nextNum}`,
      ward: ward || settings.currentWard,
      type: type || 'Wet & Dry (2-compartment)',
      capacityLiters: Number(capacityLiters) || 80,
      fillLevelPercent: 0,
      lastCleaned: 'Not yet cleaned (New)',
      status: status || 'Active',
      lat: typeof lat === 'number' ? lat : 18.522 + (Math.random() - 0.5) * 0.012,
      lng: typeof lng === 'number' ? lng : 73.856 + (Math.random() - 0.5) * 0.012,
      installDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    bins.push(newBin);
    res.status(201).json(newBin);
  });

  app.patch('/api/bins/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const bin = bins.find(b => b.id === id);
    if (!bin) {
      res.status(404).json({ error: 'Bin not found' });
      return;
    }

    if (req.body.status) bin.status = req.body.status;
    if (typeof req.body.fillLevelPercent === 'number') bin.fillLevelPercent = req.body.fillLevelPercent;
    if (req.body.lastCleaned) bin.lastCleaned = req.body.lastCleaned;
    if (req.body.place) bin.place = req.body.place;

    res.json(bin);
  });

  app.delete('/api/bins/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = bins.findIndex(b => b.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Bin not found' });
      return;
    }
    const removed = bins.splice(index, 1)[0];
    res.json({ message: 'Dustbin removed from inventory', bin: removed });
  });

  // Recommendations Endpoints
  app.get('/api/recommendations', (_req: Request, res: Response) => {
    res.json(recommendations);
  });

  // Recommendation Approval Engine
  app.post('/api/recommendations/:id/approve', (req: Request, res: Response) => {
    const { id } = req.params;
    const rec = recommendations.find(r => r.id === id);

    if (!rec) {
      res.status(404).json({ error: 'Recommendation not found' });
      return;
    }

    if (rec.status === 'Approved' || rec.status === 'Installed') {
      res.status(400).json({ error: 'Recommendation is already approved.' });
      return;
    }

    rec.status = 'Approved';
    rec.approvedAt = new Date().toISOString();

    const nextNum = 45 + bins.length;
    const createdBinId = `D-${String(nextNum).padStart(3, '0')}`;
    rec.createdBinId = createdBinId;

    const newBin: Dustbin = {
      id: createdBinId,
      place: rec.place,
      ward: rec.ward,
      type: rec.suggestedType || 'Wet & Dry (2-compartment)',
      capacityLiters: 120,
      fillLevelPercent: 0,
      lastCleaned: 'Installed Today',
      status: 'Newly placed',
      lat: rec.lat,
      lng: rec.lng,
      installDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    bins.push(newBin);
    approvedRecCount++;

    reports.forEach(rep => {
      const dist = getDistanceMeters(rep.lat, rep.lng, rec.lat, rec.lng);
      if (dist <= settings.hotspotRadiusMeters && rep.status === 'Open') {
        rep.status = 'Action Scheduled';
      }
    });

    res.json({
      message: `Recommendation ${id} successfully approved! New municipal dustbin ${createdBinId} provisioned at ${rec.place}.`,
      recommendation: rec,
      newBin,
      totalApproved: approvedRecCount,
      activeBinsCount: bins.length + 22
    });
  });

  // Algorithm Recalculation Engine
  app.post('/api/recommendations/recalculate', (_req: Request, res: Response) => {
    const openReports = reports.filter(r => r.status === 'Open' || r.status === 'Reviewing');
    let newlyFound = 0;

    openReports.forEach(rep => {
      const hasNearbyBin = bins.some(b => getDistanceMeters(b.lat, b.lng, rep.lat, rep.lng) < settings.hotspotRadiusMeters);
      const hasNearbyRec = recommendations.some(r => getDistanceMeters(r.lat, r.lng, rep.lat, rep.lng) < settings.hotspotRadiusMeters);

      if (!hasNearbyBin && !hasNearbyRec) {
        const neighborCount = openReports.filter(o => getDistanceMeters(o.lat, o.lng, rep.lat, rep.lng) <= settings.hotspotRadiusMeters).length;
        if (neighborCount >= settings.triggerReportsThreshold) {
          const recId = `R-${21 + recommendations.length}`;
          recommendations.push({
            id: recId,
            place: rep.place,
            ward: rep.ward,
            reason: `${neighborCount} reports within ${settings.hotspotRadiusMeters}m radius; nearest bin is beyond walking distance.`,
            status: 'Pending',
            lat: rep.lat,
            lng: rep.lng,
            clusterReportsCount: neighborCount,
            nearestBinDistanceMeters: 310,
            urgency: neighborCount >= 6 ? 'Critical' : 'High',
            suggestedType: 'Wet & Dry (2-compartment, 120L)',
            projectedReductionPercent: 40
          });
          newlyFound++;
        }
      }
    });

    res.json({
      message: `Algorithm recalculation complete. ${newlyFound} new recommendation(s) generated.`,
      recommendationsCount: recommendations.length,
      recommendations
    });
  });

  // Analytics Endpoint
  app.get('/api/analytics', (_req: Request, res: Response) => {
    res.json({
      impactSummary: {
        baselineComplaints30Days: 12,
        postPlacementComplaints30Days: 7,
        reductionPercent: 41.7,
        binsPlaced: approvedRecCount,
        trackingWindowDays: 28,
        averageDistanceToBinMeters: 92,
        segregationComplianceRatePercent: 78
      },
      weeklyTrends: [
        { week: 'Week 1 (Baseline)', complaints: 14, binsActive: 28 },
        { week: 'Week 2 (Placement R-14)', complaints: 11, binsActive: 29 },
        { week: 'Week 3 (Placement R-15)', complaints: 8, binsActive: 30 },
        { week: 'Week 4 (Placement R-16)', complaints: 6, binsActive: 31 },
        { week: 'Current (Monitoring)', complaints: 5, binsActive: 28 + approvedRecCount }
      ],
      wardBreakdown: [
        { ward: 'Ward 4 (Current)', score: 86, openIssues: reports.filter(r => r.status === 'Open').length, bins: bins.length },
        { ward: 'Ward 2 (Market)', score: 72, openIssues: 18, bins: 19 },
        { ward: 'Ward 7 (Suburbs)', score: 91, openIssues: 4, bins: 24 }
      ]
    });
  });

  // Settings Endpoints
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json(settings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    const { lookbackDays, hotspotRadiusMeters, triggerReportsThreshold, currentWard, autoAlgorithmActive, municipalityName } = req.body;
    if (lookbackDays) settings.lookbackDays = Number(lookbackDays);
    if (hotspotRadiusMeters) settings.hotspotRadiusMeters = Number(hotspotRadiusMeters);
    if (triggerReportsThreshold) settings.triggerReportsThreshold = Number(triggerReportsThreshold);
    if (currentWard) settings.currentWard = currentWard;
    if (typeof autoAlgorithmActive === 'boolean') settings.autoAlgorithmActive = autoAlgorithmActive;
    if (municipalityName) settings.municipalityName = municipalityName;

    res.json({ message: 'Settings successfully updated', settings });
  });

  // Reset demo data to default baseline
  app.post('/api/reset', (_req: Request, res: Response) => {
    approvedRecCount = 3;
    recommendations.forEach(r => {
      r.status = 'Pending';
      delete r.approvedAt;
      delete r.createdBinId;
    });
    bins = bins.slice(0, 6);
    reports.forEach((r, idx) => {
      if (idx < 5) r.status = 'Open';
    });
    citizenData.stars = 7;
    citizenData.certificates = 0;
    citizenData.medals = 0;
    res.json({ message: 'Demo data reset to baseline.' });
  });

  // Serve static files in production or hook Vite middleware in development
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Swachh Swaraj Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

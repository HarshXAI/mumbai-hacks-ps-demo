//import { Claim } from '../contexts/AppContext';

export const sampleClaims: any[] = [
  {
    id: '1',
    title: 'Candidate X promised to waive all student loans by 2026.',
    verdict: 'Misleading',
    trustScore: 32,
    confidence: 78,
    evidenceCount: 4,
    source: {
      handle: '@newsaccount',
      channel: 'ShortVideoApp',
      timestamp: '2h',
      platform: 'Short-video'
    },
    virality: [10, 25, 45, 78, 92, 85, 70, 55],
    mediaType: 'Video',
    language: 'en',
    region: 'National',
    summary: 'The candidate made a partial statement about student loan relief, but context shows it was conditional on specific economic targets and legislative approval.',
    evidence: [
      {
        type: 'Prior Speech',
        title: 'Campaign Rally Speech - Oct 15',
        timestamp: '3 days ago',
        quote: 'We will work toward student debt relief contingent on fiscal review...'
      },
      {
        type: 'Official Record',
        title: 'Party Manifesto 2024',
        timestamp: '2 weeks ago',
        quote: 'Student loan restructuring will be evaluated based on economic conditions.'
      },
      {
        type: 'Press Note',
        title: 'Finance Ministry Statement',
        timestamp: '1 week ago',
        quote: 'No commitment has been made for blanket loan waivers without parliamentary approval.'
      }
    ],
    forensics: {
      type: 'video',
      frames: ['frame1.jpg', 'frame2.jpg', 'frame3.jpg'],
      audioSpoofScore: 15,
      transcriptDrift: [0, 5, 12, 8, 3]
    }
  },
  {
    id: '2',
    title: 'This rally video shows last night\'s crowd.',
    verdict: 'Out of Context',
    trustScore: 45,
    confidence: 85,
    evidenceCount: 3,
    source: {
      handle: '@politicalwatch',
      channel: 'SocialMedia',
      timestamp: '4h',
      platform: 'Social Media'
    },
    virality: [5, 15, 30, 55, 45, 35, 28, 20],
    mediaType: 'Video',
    language: 'en',
    region: 'Mumbai',
    summary: 'The video is authentic but was recorded 3 weeks ago at a different event, not last night\'s rally.',
    evidence: [
      {
        type: 'Official Record',
        title: 'Original Event Registration',
        timestamp: '3 weeks ago',
        quote: 'Community gathering held on September 25th at the same venue.'
      },
      {
        type: 'Article',
        title: 'Local News Coverage',
        timestamp: '3 weeks ago',
        quote: 'The September event drew similar crowds to the venue.'
      }
    ],
    forensics: {
      type: 'video',
      frames: ['frame1.jpg', 'frame2.jpg', 'frame3.jpg'],
      metadata: {
        'Date Created': '2024-09-25 18:30',
        'Camera Model': 'iPhone 14 Pro',
        'GPS Coordinates': '19.0760, 72.8777'
      }
    }
  },
  {
    id: '3',
    title: 'Fuel tax cut announced today.',
    verdict: 'Accurate',
    trustScore: 88,
    confidence: 95,
    evidenceCount: 5,
    source: {
      handle: '@govtnews',
      channel: 'OfficialChannel',
      timestamp: '1h',
      platform: 'Press Release'
    },
    virality: [20, 35, 50, 65, 80, 75, 70, 68],
    mediaType: 'Text',
    language: 'en',
    region: 'National',
    summary: 'The government officially announced a 3% reduction in fuel tax effective immediately.',
    evidence: [
      {
        type: 'Official Record',
        title: 'Government Gazette Notification',
        timestamp: '30min ago',
        quote: 'Fuel tax reduced by 3% effective immediately as per notification GZ-2024-1015.'
      },
      {
        type: 'Press Note',
        title: 'Finance Minister Press Briefing',
        timestamp: '45min ago',
        quote: 'We are implementing immediate relief measures including fuel tax reduction.'
      }
    ]
  }
];
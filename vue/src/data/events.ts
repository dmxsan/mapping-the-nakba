import type { HistoricalEvent } from '@/types'

export const events: HistoricalEvent[] = [
  {
    id: 'nakba-1948',
    title: 'Nakba (The Catastrophe)',
    titleAr: 'النكبة',
    dateType: 'period',
    startDate: '1947-11-29',
    endDate: '1949-07-20',
    description: 'Systematic expulsion of over 700,000 Palestinians, destruction of 500+ villages. UN Resolution 181 (Nov 29, 1947) called for partition. Deir Yassin massacre occurred on April 9, 1948.',
    coordinates: [31.9522, 35.2332],
    casualties: '15,000+',
    refugeesCreated: '700,000-800,000 refugees',
    villagesDestroyed: '500+',
    location: 'Mandatory Palestine',
    sources: [
      { name: 'UN Resolution 181 (1947)', url: 'https://digitallibrary.un.org/record/209880' },
      { name: 'UN Resolution 194 (1948)', url: 'https://digitallibrary.un.org/record/209882' },
      { name: 'Palestine Open Maps', url: 'https://palopenmaps.org' }
    ]
  },
  {
    id: 'six-day-war-1967',
    title: 'Six-Day War',
    titleAr: 'حرب 1967',
    dateType: 'period',
    startDate: '1967-06-05',
    endDate: '1967-06-10',
    description: 'Israel occupied the West Bank, Gaza Strip, and East Jerusalem (Palestine), the Golan Heights (Syria), and the Sinai Peninsula (Egypt). Marked the beginning of Israel\'s military occupation of Palestinian territory.',
    coordinates: [31.9522, 35.2332],
    casualties: '20,000+',
    location: 'West Bank, Gaza, Golan Heights & Sinai',
    sources: [
      { name: 'UN SCR 242 (1967)', url: 'https://digitallibrary.un.org/record/90700' },
      { name: 'UN SCR 338 (1973)', url: 'https://digitallibrary.un.org/record/93199' },
      { name: 'UN OCHA OPT', url: 'https://www.ochaopt.org/' }
    ]
  },
  {
    id: 'oslo-accords-1993',
    title: 'Oslo Accords',
    titleAr: 'اتفاق أوسلو',
    dateType: 'specific',
    startDate: '1993-09-13',
    description: 'Signing of Declaration of Principles between PLO and Israel in Washington DC. Established Palestinian National Authority.',
    coordinates: [31.8996, 35.2042], // Ramallah - PNA headquarters
    location: 'Washington DC & Ramallah',
    sources: [
      { name: 'Oslo I Accord', url: 'https://peacemaker.un.org/israelopt-osloaccord93' },
      { name: 'PLO-Israel Letters', url: 'https://digitallibrary.un.org/record/183054' },
      { name: 'PASSIA', url: 'https://www.passia.org/themes/42' }
    ]
  },
  {
    id: 'second-intifada-2000',
    title: 'Second Intifada',
    titleAr: 'انتفاضة الأقصى',
    dateType: 'period',
    startDate: '2000-09-28',
    endDate: '2005-02-08',
    description: 'Palestinian uprising against Israeli occupation, triggered by Ariel Sharon\'s visit to Al-Aqsa Mosque.',
    coordinates: [31.7762, 35.2358], // Al-Aqsa
    casualties: '5,000+',
    location: 'West Bank & Gaza Strip',
    sources: [
      { name: "B'Tselem Statistics", url: 'https://www.btselem.org/statistics' },
      { name: 'UN OCHA Casualties', url: 'https://www.ochaopt.org/data/casualties' },
      { name: 'Human Rights Watch', url: 'https://www.hrw.org/middle-east/north-africa/israel/palestine' }
    ]
  },
  {
    id: 'gaza-disengagement-2005',
    title: 'Gaza Disengagement',
    titleAr: 'فك الارتباط',
    dateType: 'period',
    startDate: '2005-08-15',
    endDate: '2005-09-12',
    description: 'Israel unilaterally dismantled 21 settlements in the Gaza Strip and 4 in the northern West Bank, evacuating over 8,000 Israeli settlers. While not primarily a combat event, clashes during the evacuation resulted in Palestinian and Israeli fatalities.',
    coordinates: [31.4, 34.35], // Gaza
    casualties: '~6',
    refugeesCreated: '8,000+ settlers evacuated',
    villagesDestroyed: undefined,
    location: 'Gaza Strip',
    sources: [
      { name: 'B\'Tselem — Gaza Strip', url: 'https://www.btselem.org/topic/gaza_strip' },
      { name: 'Israeli Gov Report', url: 'https://www.gov.il/en/Departments/General/disengagement-plan' },
      { name: 'UN OCHA OPT', url: 'https://www.ochaopt.org/' }
    ]
  },
  {
    id: 'gaza-blockade-2007',
    title: 'Gaza Blockade',
    titleAr: 'حصار غزة',
    dateType: 'period',
    startDate: '2007-06-15',
    endDate: 'present',
    description: 'Israeli-Egyptian blockade of the Gaza Strip following Hamas takeover. Major escalations include Operation Cast Lead 2008-09 (1,400+ killed), Operation Pillar of Defense 2012 (170+), Operation Protective Edge 2014 (2,200+), May 2021 escalation (250+), and the 2023-26 onslaught which has caused catastrophic civilian loss. The blockade severely restricts movement of people, goods, medical supplies, and humanitarian aid.',
    coordinates: [31.42, 34.38],  // central Gaza Strip
    casualties: '73,000+',
    villagesDestroyed: undefined,
    location: 'Gaza Strip',
    sources: [
      { name: 'Gaza Health Ministry', url: 'https://moh.gov.ps/portal/category/data-statistics/' },
      { name: 'UN OCHA', url: 'https://www.ochaopt.org/data/casualties' },
      { name: 'Human Rights Watch', url: 'https://www.hrw.org/middle-east/north-africa/israel/palestine' },
      { name: 'Amnesty International', url: 'https://www.amnesty.org/en/location/middle-east-and-north-africa/israel-and-occupied-palestinian-territories/' }
    ]
  }
]

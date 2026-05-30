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
    description: 'Israeli-Egyptian blockade of the Gaza Strip following Hamas takeover, severely restricting movement of people, goods, medical supplies, and humanitarian aid. The blockade has created what the UN describes as the worlds largest open-air prison, with 2.2 million Palestinians living under severe restrictions on basic necessities.',
    coordinates: [31.42, 34.38],  // central Gaza Strip
    casualties: undefined,
    villagesDestroyed: undefined,
    location: 'Gaza Strip',
    sources: [
      { name: 'Gaza Health Ministry', url: 'https://moh.gov.ps/portal/category/data-statistics/' },
      { name: 'UN OCHA', url: 'https://www.ochaopt.org/data/casualties' },
      { name: 'Human Rights Watch', url: 'https://www.hrw.org/middle-east/north-africa/israel/palestine' },
      { name: 'Amnesty International', url: 'https://www.amnesty.org/en/location/middle-east-and-north-africa/israel-and-occupied-palestinian-territories/' }
    ]
  },
  {
    id: 'operation-cast-lead-2008',
    title: 'Operation Cast Lead',
    titleAr: 'الرصاص المصبوب',
    dateType: 'period',
    startDate: '2008-12-27',
    endDate: '2009-01-18',
    description: '22-day Israeli military offensive in Gaza. 1,400+ Palestinians killed, widespread destruction of homes, schools, and infrastructure. UN Fact Finding Mission (Goldstone Report) found evidence of war crimes.',
    coordinates: [31.5, 34.47],
    casualties: '1,400+',
    location: 'Gaza Strip',
    sources: [
      { name: 'UN Goldstone Report', url: 'https://www.ohchr.org/en/hr-bodies/hrc/regular-sessions/session12/res-dec-stat' },
      { name: "B'Tselem", url: 'https://www.btselem.org/topic/gaza_strip/cast_lead' },
      { name: 'Human Rights Watch', url: 'https://www.hrw.org/middle-east/north-africa/israel/palestine' }
    ]
  },
  {
    id: 'operation-pillar-of-defense-2012',
    title: 'Operation Pillar of Defense',
    titleAr: 'عامود السحاب',
    dateType: 'period',
    startDate: '2012-11-14',
    endDate: '2012-11-21',
    description: '8-day Israeli military operation in Gaza. 170+ Palestinians killed, hundreds wounded, extensive damage to civilian infrastructure.',
    coordinates: [31.5, 34.47],
    casualties: '170+',
    location: 'Gaza Strip',
    sources: [
      { name: "B'Tselem", url: 'https://www.btselem.org/topic/gaza_strip/pillar_of_defense' },
      { name: 'UN OCHA OPT', url: 'https://www.ochaopt.org/data/casualties' },
      { name: 'Amnesty International', url: 'https://www.amnesty.org/en/location/middle-east-and-north-africa/israel-and-occupied-palestinian-territories/' }
    ]
  },
  {
    id: 'operation-protective-edge-2014',
    title: 'Operation Protective Edge',
    titleAr: 'الجرف الصامد',
    dateType: 'period',
    startDate: '2014-07-08',
    endDate: '2014-08-26',
    description: '50-day Israeli military offensive in Gaza. 2,200+ Palestinians killed, including 550+ children. 18,000+ homes destroyed, 500,000 people displaced.',
    coordinates: [31.5, 34.47],
    casualties: '2,200+',
    refugeesCreated: '500,000 displaced',
    location: 'Gaza Strip',
    sources: [
      { name: 'UN OCHA 2014 Gaza Crisis', url: 'https://www.ochaopt.org/content/2014-gaza-conflict-key-figures' },
      { name: 'Amnesty International Gaza Platform', url: 'https://www.amnesty.org/en/latest/news/2015/07/gaza-platform-launch/' },
      { name: "B'Tselem", url: 'https://www.btselem.org/topic/gaza_strip/protective_edge' }
    ]
  },
  {
    id: 'escalation-2021',
    title: '2021 Gaza Escalation',
    titleAr: 'معركة سيف القدس',
    dateType: 'period',
    startDate: '2021-05-10',
    endDate: '2021-05-21',
    description: '11-day escalation across Gaza, West Bank, and Jerusalem. 250+ Palestinians killed in Gaza, including 66 children. 2,000+ homes destroyed, 72,000 displaced.',
    coordinates: [31.5, 34.47],
    casualties: '250+',
    refugeesCreated: '72,000 displaced',
    location: 'Gaza Strip, West Bank & Jerusalem',
    sources: [
      { name: 'UN OCHA May 2021', url: 'https://www.ochaopt.org/content/response-escalation-opt-situation-report-no-1' },
      { name: 'ICC Palestine', url: 'https://www.icc-cpi.int/palestine' },
      { name: "B'Tselem", url: 'https://www.btselem.org/press_releases/20210523_operation_guardian_of_the_walls' }
    ]
  },
  {
    id: 'gaza-genocide-2023',
    title: 'Gaza Genocide',
    titleAr: 'حرب الإبادة على غزة',
    dateType: 'period',
    startDate: '2023-10-07',
    endDate: '2026-01-19',
    description: 'Israeli military onslaught on Gaza. 73,000+ Palestinians killed. Systematic destruction of civilian infrastructure, health facilities, universities, and cultural heritage. ICJ found plausible risk of genocide. ICC issued arrest warrants. 90%+ of population displaced.',
    coordinates: [31.5, 34.47],
    casualties: '73,000+',
    refugeesCreated: '1.9 million displaced',
    location: 'Gaza Strip',
    sources: [
      { name: 'Gaza Health Ministry', url: 'https://moh.gov.ps/portal/category/data-statistics/' },
      { name: 'UN OCHA OPT', url: 'https://www.ochaopt.org/' },
      { name: 'ICJ South Africa v. Israel', url: 'https://www.icj-cij.org/en/case/192' },
      { name: 'ICC Palestine', url: 'https://www.icc-cpi.int/palestine' },
      { name: 'UNRWA', url: 'https://www.unrwa.org/' },
      { name: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/campaigns/2024/04/israels-war-on-gaza/' }
    ]
  }
]

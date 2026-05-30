import type { Village } from '@/types'

export const villages: Village[] = [
  // === Nakba 1948 ===
  { id: 'deir-yassin', name: 'Deir Yassin', coordinates: [31.7868, 35.1784], year: 1948, fate: 'Massacre', eventId: 'nakba-1948', type: 'village' },
  { id: 'tantura', name: 'Tantura', coordinates: [32.6085, 34.9007], year: 1948, fate: 'Massacre', eventId: 'nakba-1948', type: 'village' },
  { id: 'al-majdal', name: 'Al-Majdal', coordinates: [31.6676, 34.5657], year: 1948, fate: 'Depopulated', eventId: 'nakba-1948', type: 'village' },
  { id: 'lifta', name: 'Lifta', coordinates: [31.7916, 35.1958], year: 1948, fate: 'Depopulated', eventId: 'nakba-1948', type: 'village' },
  { id: 'ein-karem', name: 'Ein Karem', coordinates: [31.7614, 35.1654], year: 1948, fate: 'Depopulated', eventId: 'nakba-1948', type: 'village' },
  { id: 'saffuriyya', name: 'Saffuriyya', coordinates: [32.7469, 35.2788], year: 1948, fate: 'Depopulated', eventId: 'nakba-1948', type: 'village' },
  { id: 'beersheba', name: 'Beersheba', coordinates: [31.2525, 34.7915], year: 1948, fate: 'Depopulated', eventId: 'nakba-1948', type: 'village' },
  { id: 'al-faluja', name: 'Al-Faluja', coordinates: [31.6239, 34.7464], year: 1948, fate: 'Depopulated', eventId: 'nakba-1948', type: 'village' },
  { id: 'al-kabri', name: 'Al-Kabri', coordinates: [33.0259, 35.1506], year: 1948, fate: 'Massacre', eventId: 'nakba-1948', type: 'village' },
  { id: 'abu-shusha', name: 'Abu Shusha', coordinates: [31.8851, 34.9281], year: 1948, fate: 'Massacre', eventId: 'nakba-1948', type: 'village' },
  { id: 'lydda', name: 'Lydda', coordinates: [31.9488, 34.8788], year: 1948, fate: 'Expelled', eventId: 'nakba-1948', type: 'village' },
  { id: 'al-ramla', name: 'Al-Ramla', coordinates: [31.9328, 34.8727], year: 1948, fate: 'Expelled', eventId: 'nakba-1948', type: 'village' },
  { id: 'al-qastal', name: 'Al-Qastal', coordinates: [31.7916, 35.1406], year: 1948, fate: 'Destroyed', eventId: 'nakba-1948', type: 'village' },

  // === Six-Day War 1967 ===
  { id: 'imwas', name: 'Imwas', coordinates: [31.8431, 35.0343], year: 1967, fate: 'Erased', eventId: 'six-day-war-1967', type: 'village' },
  { id: 'yalo', name: 'Yalo', coordinates: [31.8367, 35.0464], year: 1967, fate: 'Erased', eventId: 'six-day-war-1967', type: 'village' },
  { id: 'beit-nuba', name: 'Beit Nuba', coordinates: [31.8542, 35.0375], year: 1967, fate: 'Erased', eventId: 'six-day-war-1967', type: 'village' },

  // === Second Intifada 2000 ===
  { id: 'jenin-camp', name: 'Jenin Camp', coordinates: [32.4601, 35.2861], year: 2002, fate: 'Destroyed', eventId: 'second-intifada-2000', type: 'village' },
  { id: 'nablus-old-city', name: 'Nablus Old City', coordinates: [32.2208, 35.2590], year: 2002, fate: 'Targeted', eventId: 'second-intifada-2000', type: 'village' },
  { id: 'balata-camp', name: 'Balata Camp', coordinates: [32.2119, 35.2901], year: 2002, fate: 'Targeted', eventId: 'second-intifada-2000', type: 'village' },

  // === Gaza Disengagement 2005 ===
  { id: 'gush-katif', name: 'Gush Katif', coordinates: [31.3582, 34.2813], year: 2005, fate: 'Evacuated', eventId: 'gaza-disengagement-2005', type: 'village' },
  { id: 'kfar-darom', name: 'Kfar Darom', coordinates: [31.4013, 34.3541], year: 2005, fate: 'Evacuated', eventId: 'gaza-disengagement-2005', type: 'village' },
  { id: 'netzarim', name: 'Netzarim', coordinates: [31.4675, 34.4129], year: 2005, fate: 'Evacuated', eventId: 'gaza-disengagement-2005', type: 'village' },

  // === Gaza Blockade 2007 ===
  { id: 'beit-hanoun', name: 'Beit Hanoun', coordinates: [31.5350, 34.5314], year: 2007, fate: 'Targeted', eventId: 'gaza-blockade-2007', type: 'village' },
  { id: 'gaza-port', name: 'Gaza Port', coordinates: [31.5279, 34.4362], year: 2007, fate: 'Targeted', eventId: 'gaza-blockade-2007', type: 'village' },

  // === Operation Cast Lead 2008 ===
  { id: 'beit-lahia', name: 'Beit Lahia', coordinates: [31.5500, 34.4978], year: 2008, fate: 'Destroyed', eventId: 'operation-cast-lead-2008', type: 'village' },
  { id: 'al-atatra', name: 'Al-Atatra', coordinates: [31.5610, 34.4805], year: 2008, fate: 'Destroyed', eventId: 'operation-cast-lead-2008', type: 'village' },
  { id: 'izbet-abed-rabbo', name: 'Izbet Abed Rabbo', coordinates: [31.48, 34.48], year: 2008, fate: 'Destroyed', eventId: 'operation-cast-lead-2008', type: 'village' },

  // === Operation Protective Edge 2014 ===
  { id: 'shujaiyya', name: 'Shuja\'iyya', coordinates: [31.5010, 34.4826], year: 2014, fate: 'Destroyed', eventId: 'operation-protective-edge-2014', type: 'village' },
  { id: 'khuzaa', name: 'Khuza\'a', coordinates: [31.3104, 34.3584], year: 2014, fate: 'Destroyed', eventId: 'operation-protective-edge-2014', type: 'village' },

  // === 2021 Gaza Escalation ===
  { id: 'sheikh-jarrah', name: 'Sheikh Jarrah', coordinates: [31.7971, 35.2305], year: 2021, fate: 'Targeted', eventId: 'escalation-2021', type: 'village' },
  { id: 'al-wehda-street', name: 'Al-Wehda Street', coordinates: [31.5018, 34.4703], year: 2021, fate: 'Destroyed', eventId: 'escalation-2021', type: 'village' },

  // === Gaza Genocide 2023 ===
  { id: 'rafah', name: 'Rafah', coordinates: [31.2836, 34.2443], year: 2023, fate: 'Destroyed', eventId: 'gaza-genocide-2023', type: 'village' },
  { id: 'khan-younis', name: 'Khan Younis', coordinates: [31.3468, 34.3161], year: 2023, fate: 'Destroyed', eventId: 'gaza-genocide-2023', type: 'village' },
  { id: 'jabalia-camp', name: 'Jabalia Camp', coordinates: [31.5294, 34.4956], year: 2023, fate: 'Destroyed', eventId: 'gaza-genocide-2023', type: 'village' },
  { id: 'al-rimal', name: 'Al-Rimal', coordinates: [31.5043, 34.4367], year: 2023, fate: 'Destroyed', eventId: 'gaza-genocide-2023', type: 'village' },
]

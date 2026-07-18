import { ScrapItem, Review, FAQItem } from './types';

export const SCRAP_ITEMS: ScrapItem[] = [
  {
    id: 'iron-scrap',
    name: 'Iron Scrap',
    unit: 'kg',
    rate: 28,
    iconName: 'Hammer',
    category: 'Metal',
    description: 'Heavy melting iron, cast iron, pipes, beams, rebars, and sheets.'
  },
  {
    id: 'steel-scrap',
    name: 'Steel Scrap',
    unit: 'kg',
    rate: 38,
    iconName: 'Layers',
    category: 'Metal',
    description: 'Mild steel, carbon steel, structural steel, and industrial cut-offs.'
  },
  {
    id: 'copper-scrap',
    name: 'Copper Scrap',
    unit: 'kg',
    rate: 580,
    iconName: 'Flame',
    category: 'Metal',
    description: 'Bright shiny copper wires, busbars, heavy copper tubes, and utensils.'
  },
  {
    id: 'aluminium-scrap',
    name: 'Aluminium Scrap',
    unit: 'kg',
    rate: 145,
    iconName: 'Disc',
    category: 'Metal',
    description: 'Aluminium utensils, alloy wheels, window frames, conductors, and cans.'
  },
  {
    id: 'brass-scrap',
    name: 'Brass Scrap',
    unit: 'kg',
    rate: 360,
    iconName: 'Crown',
    category: 'Metal',
    description: 'Brass valves, plumbing fixtures, ornamental items, and industrial turnings.'
  },
  {
    id: 'stainless-steel-scrap',
    name: 'Stainless Steel Scrap',
    unit: 'kg',
    rate: 46,
    iconName: 'Utensils',
    category: 'Metal',
    description: 'SS 304, SS 316 grade kitchen utensils, sinks, and industrial pipes.'
  },
  {
    id: 'electric-wire-scrap',
    name: 'Electric Wire Scrap',
    unit: 'kg',
    rate: 110,
    iconName: 'Cable',
    category: 'E-Waste',
    description: 'Household insulated copper wiring, electrical panel wires, and multi-core cables.'
  },
  {
    id: 'cable-scrap',
    name: 'Cable Scrap',
    unit: 'kg',
    rate: 95,
    iconName: 'Link',
    category: 'E-Waste',
    description: 'Thick armoured power cables, telecom cables, and coaxial network wires.'
  },
  {
    id: 'battery-scrap',
    name: 'Battery Scrap',
    unit: 'kg',
    rate: 90,
    iconName: 'Battery',
    category: 'Appliances',
    description: 'Lead-acid batteries from cars, bikes, inverters, and UPS systems.'
  },
  {
    id: 'ac-scrap',
    name: 'AC Scrap',
    unit: 'unit',
    rate: 2500,
    iconName: 'Snowflake',
    category: 'Appliances',
    description: 'Window ACs, split AC outdoor/indoor units, and compressor assemblies.'
  },
  {
    id: 'refrigerator-scrap',
    name: 'Refrigerator Scrap',
    unit: 'unit',
    rate: 1800,
    iconName: 'Server',
    category: 'Appliances',
    description: 'Single door or double door home refrigerators, deep freezers, and water coolers.'
  },
  {
    id: 'washing-machine-scrap',
    name: 'Washing Machine Scrap',
    unit: 'unit',
    rate: 1500,
    iconName: 'WashingMachine',
    category: 'Appliances',
    description: 'Top load, front load, or semi-automatic washing machines and dryers.'
  },
  {
    id: 'computer-e-waste',
    name: 'Computer & E-Waste',
    unit: 'kg',
    rate: 85,
    iconName: 'Monitor',
    category: 'E-Waste',
    description: 'Old desktop PCs, monitors, CPUs, keyboards, laptops, and circuit boards.'
  },
  {
    id: 'old-machinery',
    name: 'Old Machinery Scrap',
    unit: 'kg',
    rate: 32,
    iconName: 'Settings',
    category: 'Machinery',
    description: 'Decommissioned factory machinery, lathes, generators, electric motors, and pumps.'
  }
];

export const BHUBANESWAR_AREAS = [
  'Kharvela Nagar (Unit-3)',
  'Patia',
  'Nayapalli',
  'Jaydev Vihar',
  'Saheed Nagar',
  'Chandrasekharpur',
  'Khandagiri',
  'Acharya Vihar',
  'Rasulgarh',
  'Old Town',
  'Unit-1 / Unit-2 / Unit-4',
  'Damana / Sailashree Vihar',
  'Gajapati Nagar',
  'Laxmisagar',
  'Vani Vihar',
  'Mahanadi Vihar (Cuttack link)',
  'Other Bhubaneswar Area'
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    authorName: 'Ranjan Mohapatra',
    rating: 5,
    comment: 'Very professional. They brought a digital weighing scale and paid me on-the-spot via Google Pay. Best rate in Kharvela Nagar for AC and iron scrap!',
    date: '2026-06-12',
    location: 'Kharvela Nagar, Bhubaneswar'
  },
  {
    id: 'rev-2',
    authorName: 'Priyanka Das',
    rating: 4,
    comment: 'Booked a home pickup for our old refrigerator and pile of newspapers/E-waste. The pickup boys were polite and did the heavy lifting easily. Highly recommended.',
    date: '2026-07-02',
    location: 'Patia, Bhubaneswar'
  },
  {
    id: 'rev-3',
    authorName: 'Sanjay Behera',
    rating: 5,
    comment: 'Got excellent rates for a lot of copper wire and battery scraps from my workshop. Digital scale was accurate. Transparent deal and friendly behaviour.',
    date: '2026-07-15',
    location: 'Rasulgarh, Bhubaneswar'
  },
  {
    id: 'rev-4',
    authorName: 'Subrat Nayak',
    rating: 5,
    comment: 'Prompt service! Called them at 10 AM, and they came by 2 PM the same day. Transparent rates with no hidden deduction. Happy recycling!',
    date: '2026-07-17',
    location: 'Nayapalli, Bhubaneswar'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'How is the scrap weight measured?',
    answer: 'We use certified, high-precision electronic digital weighing scales. The weighing is done right in front of you to ensure 100% transparency. We do not use old manual scales or make guesses.'
  },
  {
    question: 'Is there a minimum weight requirement for door-step pickup?',
    answer: 'For metallic scraps (like Iron, Steel, etc.), we recommend a minimum of 20 kg for a free doorstep pickup. For high-value scrap like copper, brass, batteries, or appliances (AC, Fridge, Washing Machine), we arrange pickup even for single items.'
  },
  {
    question: 'How and when will I get paid?',
    answer: 'You are paid immediately on-the-spot upon completion of the weighing. You can choose to receive your payment in Cash, or digital modes like UPI (GPay, PhonePe, Paytm) or instant Bank Transfer.'
  },
  {
    question: 'Are there any hidden pickup or labor charges?',
    answer: 'No, our pickup service is 100% free. The labor for carrying, loading, and transporting the scrap is fully handled by our team at no extra cost to you.'
  },
  {
    question: 'What happens to the scrap after you buy it?',
    answer: 'We segregating the scrap and transport it directly to authorized metal recycling units and steel mills. We ensure all materials are processed eco-friendly and sustainably.'
  }
];

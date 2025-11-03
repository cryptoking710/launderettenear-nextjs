// UK/ISO 3758 Laundry Care Symbol Images
import wash30 from '@assets/generated_images/Wash_at_30°C_symbol_96793d08.png';
import wash40 from '@assets/generated_images/Wash_at_40°C_symbol_c8935bd5.png';
import wash60 from '@assets/generated_images/Wash_at_60°C_symbol_c7cbd042.png';
import handWash from '@assets/generated_images/Hand_wash_only_symbol_b5730d14.png';
import noWash from '@assets/generated_images/Do_not_wash_symbol_3f04df81.png';
import permPress from '@assets/generated_images/Permanent_press_cycle_symbol_e3c16a4f.png';
import delicate from '@assets/generated_images/Delicate_cycle_symbol_ef566526.png';

import tumbleDry from '@assets/generated_images/Tumble_dry_allowed_symbol_81cf56f7.png';
import noTumbleDry from '@assets/generated_images/Do_not_tumble_dry_symbol_74e9e9a0.png';
import tumbleLow from '@assets/generated_images/Tumble_dry_low_heat_symbol_c9c46440.png';
import tumbleMedium from '@assets/generated_images/Tumble_dry_medium_heat_symbol_19906da7.png';
import tumbleHigh from '@assets/generated_images/Tumble_dry_high_heat_symbol_2d65ada1.png';
import hangDry from '@assets/generated_images/Hang_to_dry_symbol_68508bbc.png';
import dripDry from '@assets/generated_images/Drip_dry_symbol_c5ffc58b.png';
import dryFlat from '@assets/generated_images/Dry_flat_symbol_432b9bd1.png';
import dryShade from '@assets/generated_images/Dry_in_shade_symbol_da0239bd.png';

import ironAllowed from '@assets/generated_images/Iron_allowed_symbol_ac4fc42a.png';
import ironLow from '@assets/generated_images/Iron_low_temp_symbol_e9221ff1.png';
import ironMedium from '@assets/generated_images/Iron_medium_temp_symbol_699dc72c.png';
import ironHigh from '@assets/generated_images/Iron_high_temp_symbol_860c6e46.png';
import noIron from '@assets/generated_images/Do_not_iron_symbol_ddb0bfd4.png';
import noSteam from '@assets/generated_images/No_steam_ironing_symbol_b8a85c21.png';

import bleachAllowed from '@assets/generated_images/Bleach_allowed_symbol_83d3a880.png';
import nonChlorine from '@assets/generated_images/Non-chlorine_bleach_only_symbol_27ca2204.png';
import noBleach from '@assets/generated_images/Do_not_bleach_symbol_1e277252.png';

import dryCleanOnly from '@assets/generated_images/Dry_clean_only_symbol_68a33bc7.png';
import noDryClean from '@assets/generated_images/Do_not_dry_clean_symbol_e9d2b13f.png';
import dryCleanP from '@assets/generated_images/Dry_clean_P_code_symbol_f5ca472b.png';
import dryCleanF from '@assets/generated_images/Dry_clean_F_symbol_61022cda.png';
import wetCleanW from '@assets/generated_images/Wet_clean_W_symbol_68356613.png';

export interface LaundrySymbol {
  id: string;
  image: string;
  name: string;
  description: string;
}

export const washingSymbols: LaundrySymbol[] = [
  {
    id: 'wash-30',
    image: wash30,
    name: '30°C Wash',
    description: 'Machine wash at 30°C (cold wash). Suitable for delicates and colours that may fade.'
  },
  {
    id: 'wash-40',
    image: wash40,
    name: '40°C Wash',
    description: 'Machine wash at 40°C (warm wash). Ideal for synthetics and everyday clothing.'
  },
  {
    id: 'wash-60',
    image: wash60,
    name: '60°C Wash',
    description: 'Machine wash at 60°C (hot wash). For cotton, linen, and heavily soiled items.'
  },
  {
    id: 'hand-wash',
    image: handWash,
    name: 'Hand Wash Only',
    description: 'Hand wash only at 40°C or lower. Do not machine wash. Gentle handling required.'
  },
  {
    id: 'no-wash',
    image: noWash,
    name: 'Do Not Wash',
    description: 'Do not machine wash or hand wash. Professional dry cleaning recommended.'
  },
  {
    id: 'perm-press',
    image: permPress,
    name: 'Permanent Press Cycle',
    description: 'Use permanent press or synthetic cycle with reduced spin speed. One line under tub indicates gentler treatment.'
  },
  {
    id: 'delicate',
    image: delicate,
    name: 'Delicate/Gentle Cycle',
    description: 'Use delicate, gentle, or wool cycle with mild wash action. Two lines under tub indicate extra gentle treatment.'
  }
];

export const dryingSymbols: LaundrySymbol[] = [
  {
    id: 'tumble-dry',
    image: tumbleDry,
    name: 'Tumble Dry Allowed',
    description: 'Tumble drying is permitted. No specific heat setting indicated.'
  },
  {
    id: 'no-tumble',
    image: noTumbleDry,
    name: 'Do Not Tumble Dry',
    description: 'Do not tumble dry. Air dry only to prevent shrinkage or damage.'
  },
  {
    id: 'tumble-low',
    image: tumbleLow,
    name: 'Tumble Dry Low Heat',
    description: 'Tumble dry on low heat (cool setting). One dot indicates delicate fabrics.'
  },
  {
    id: 'tumble-medium',
    image: tumbleMedium,
    name: 'Tumble Dry Medium Heat',
    description: 'Tumble dry on medium heat (warm setting). Two dots for most fabrics.'
  },
  {
    id: 'tumble-high',
    image: tumbleHigh,
    name: 'Tumble Dry High Heat',
    description: 'Tumble dry on high heat (hot setting). Three dots for cotton and linen.'
  },
  {
    id: 'hang-dry',
    image: hangDry,
    name: 'Hang to Dry',
    description: 'Hang on washing line or clothes hanger to air dry naturally.'
  },
  {
    id: 'drip-dry',
    image: dripDry,
    name: 'Drip Dry',
    description: 'Hang wet garment on rack or clothes horse and let water drip off naturally.'
  },
  {
    id: 'dry-flat',
    image: dryFlat,
    name: 'Dry Flat',
    description: 'Lay flat on a surface to dry. Essential for maintaining shape of knits and woolens.'
  },
  {
    id: 'dry-shade',
    image: dryShade,
    name: 'Dry in Shade',
    description: 'Dry away from direct sunlight to prevent fading or sun damage.'
  }
];

export const ironingSymbols: LaundrySymbol[] = [
  {
    id: 'iron-allowed',
    image: ironAllowed,
    name: 'Ironing Allowed',
    description: 'Ironing is permitted at any temperature suitable for the fabric.'
  },
  {
    id: 'iron-low',
    image: ironLow,
    name: 'Iron Low Temperature',
    description: 'Iron at maximum 110°C (cool setting). One dot for nylon, silk, and delicates.'
  },
  {
    id: 'iron-medium',
    image: ironMedium,
    name: 'Iron Medium Temperature',
    description: 'Iron at maximum 150°C (warm setting). Two dots for wool, polyester, and synthetics.'
  },
  {
    id: 'iron-high',
    image: ironHigh,
    name: 'Iron High Temperature',
    description: 'Iron at maximum 200°C (hot setting). Three dots for cotton and linen.'
  },
  {
    id: 'no-iron',
    image: noIron,
    name: 'Do Not Iron',
    description: 'Do not iron. Heat will damage the fabric or finish.'
  },
  {
    id: 'no-steam',
    image: noSteam,
    name: 'No Steam Ironing',
    description: 'Iron without steam. Steam can damage certain fabrics or finishes.'
  }
];

export const bleachingSymbols: LaundrySymbol[] = [
  {
    id: 'bleach-allowed',
    image: bleachAllowed,
    name: 'Bleach Allowed',
    description: 'Bleaching is permitted with diluted household bleach solutions.'
  },
  {
    id: 'non-chlorine',
    image: nonChlorine,
    name: 'Non-Chlorine Bleach Only',
    description: 'Use only oxygen-based or colour-safe bleach. No chlorine bleach.'
  },
  {
    id: 'no-bleach',
    image: noBleach,
    name: 'Do Not Bleach',
    description: 'Do not use any bleach products. Bleach will damage or discolour the fabric.'
  }
];

export const dryCleaningSymbols: LaundrySymbol[] = [
  {
    id: 'dry-clean-only',
    image: dryCleanOnly,
    name: 'Dry Clean Only',
    description: 'Professional dry cleaning required. Do not attempt to wash at home.'
  },
  {
    id: 'no-dry-clean',
    image: noDryClean,
    name: 'Do Not Dry Clean',
    description: 'Do not dry clean. Dry cleaning solvents will damage the fabric.'
  },
  {
    id: 'dry-clean-p',
    image: dryCleanP,
    name: 'Dry Clean P (Perchloroethylene)',
    description: 'Professional dry cleaning with perchloroethylene or equivalent solvents. Letter P is for the dry cleaner.'
  },
  {
    id: 'dry-clean-f',
    image: dryCleanF,
    name: 'Dry Clean F (Petroleum)',
    description: 'Professional dry cleaning with petroleum-based solvents only. Letter F is for the dry cleaner.'
  },
  {
    id: 'wet-clean-w',
    image: wetCleanW,
    name: 'Professional Wet Clean W',
    description: 'Professional wet cleaning process required. Letter W indicates water-based professional cleaning.'
  }
];

export const allSymbols = [
  ...washingSymbols,
  ...dryingSymbols,
  ...ironingSymbols,
  ...bleachingSymbols,
  ...dryCleaningSymbols
];

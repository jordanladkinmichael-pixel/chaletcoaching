export const TOKENS_PER_UNIT = Number(process.env.NEXT_PUBLIC_TOKEN_RATE ?? 100);

export const PREVIEW_COST = 50;
export const REGEN_DAY = 30;
export const REGEN_WEEK = 120;

// Workout types for selection
export const WORKOUT_TYPES = [
  "HIIT (High-Intensity Intervals)",
  "Tabata (20/10 protocol)",
  "EMOM (Every Minute On the Minute)",
  "AMRAP (As Many Rounds/Reps)",
  "Circuit Training",
  "Full-Body Strength",
  "Upper/Lower Split",
  "Push / Pull / Legs (PPL)",
  "Hypertrophy (Bodybuilding)",
  "Powerlifting Fundamentals (SQ/BN/DL)",
  "Olympic-style Technique (light/skill)",
  "Kettlebell Training",
  "Dumbbell-only",
  "Barbell-only",
  "Machines & Cables only",
  "Resistance Bands / Mini-bands",
  "TRX / Suspension",
  "Calisthenics (Bodyweight)",
  "Rings Fundamentals",
  "Plyometrics (Jump Training)",
  "Mobility & Flexibility",
  "Core & Stability",
  "Low-Impact / Joint-friendly",
  "Home Minimal Equipment",
  "Commercial Gym Program",
  "Running Intervals / Sprints",
  "Rowing Erg Intervals",
  "Indoor Cycling Intervals",
  "Boxing / Kickboxing Conditioning",
  "Strongman-Lite (Carries / Sled / Sandbag)",
] as const;

// Muscle groups hierarchy for multi-select
export const MUSCLE_GROUPS = [
  {
    group: "Chest",
    items: [
      { id: "upper_chest", label: "Upper chest (clavicular pec major)", aliases: ["upper pecs", "clavicular"] },
      { id: "mid_chest",   label: "Mid chest (sternal pec major)",     aliases: ["middle chest"] },
      { id: "lower_chest", label: "Lower chest (inferior sternal)",    aliases: ["lower pecs"] },
      { id: "pec_minor",   label: "Pectoralis minor" },
      { id: "serratus",    label: "Serratus anterior" }
    ]
  },
  {
    group: "Back",
    items: [
      { id: "lats",        label: "Latissimus dorsi", "aliases": ["lats"] },
      { id: "upper_traps", "label": "Upper trapezius" },
      { id: "mid_traps",   "label": "Mid trapezius" },
      { id: "lower_traps", "label": "Lower trapezius" },
      { id: "rhomboids",   "label": "Rhomboids" },
      { id: "teres_major", "label": "Teres major" },
      { id: "teres_minor", "label": "Teres minor" },
      { id: "infraspinatus","label": "Infraspinatus" },
      { id: "erectors",    "label": "Erector spinae (lower back)", "aliases": ["spinal erectors", "lower back"] }
    ]
  },
  {
    group: "Shoulders",
    items: [
      { id: "front_delts", "label": "Anterior deltoid" },
      { id: "side_delts",  "label": "Lateral deltoid" },
      { id: "rear_delts",  "label": "Posterior deltoid" },
      { id: "rotator_cuff","label": "Rotator cuff (SSP/ISP/TM/SUB)", "aliases": ["supraspinatus","infraspinatus","teres minor","subscapularis"] }
    ]
  },
  {
    group: "Arms",
    items: [
      { id: "biceps_long",    "label": "Biceps (long head)" },
      { id: "biceps_short",   "label": "Biceps (short head)" },
      { id: "brachialis",     "label": "Brachialis" },
      { id: "brachioradialis","label": "Brachioradialis" },
      { id: "triceps_long",   "label": "Triceps (long head)" },
      { id: "triceps_lateral","label": "Triceps (lateral head)" },
      { id: "triceps_medial", "label": "Triceps (medial head)" },
      { id: "forearm_flexors","label": "Forearm flexors" },
      { id: "forearm_extensors","label": "Forearm extensors" }
    ]
  },
  {
    group: "Core",
    items: [
      { id: "upper_abs",   "label": "Rectus abdominis — upper" },
      { id: "lower_abs",   "label": "Rectus abdominis — lower" },
      { id: "obliques_ext","label": "External obliques" },
      { id: "obliques_int","label": "Internal obliques" },
      { id: "transverse",  "label": "Transverse abdominis" },
      { id: "multifidus",  "label": "Multifidus / deep spinal stabilizers" }
    ]
  },
  {
    group: "Hips & Glutes",
    items: [
      { id: "glute_max", "label": "Gluteus maximus" },
      { id: "glute_med", "label": "Gluteus medius" },
      { id: "glute_min", "label": "Gluteus minimus" },
      { id: "tfl",       "label": "Tensor fasciae latae (TFL)" },
      { id: "hip_flexors","label": "Hip flexors (iliopsoas)" },
      { id: "adductors", "label": "Adductors (longus/brevis/magnus)" },
      { id: "abductors", "label": "Abductors (glute med/min, TFL)" }
    ]
  },
  {
    group: "Legs",
    items: [
      { id: "quads_rf",   "label": "Quadriceps — rectus femoris" },
      { id: "quads_vl",   "label": "Quadriceps — vastus lateralis" },
      { id: "quads_vm",   "label": "Quadriceps — vastus medialis" },
      { id: "quads_vi",   "label": "Quadriceps — vastus intermedius" },
      { id: "hams_bf",    "label": "Hamstrings — biceps femoris" },
      { id: "hams_st",    "label": "Hamstrings — semitendinosus" },
      { id: "hams_sm",    "label": "Hamstrings — semimembranosus" },
      { id: "calf_gastroc_med","label": "Calves — gastrocnemius (medial head)" },
      { id: "calf_gastroc_lat","label": "Calves — gastrocnemius (lateral head)" },
      { id: "calf_soleus","label": "Calves — soleus" },
      { id: "tib_ant",    "label": "Tibialis anterior" }
    ]
  },
  {
    group: "Neck",
    items: [
      { id: "scm",     "label": "Sternocleidomastoid" },
      { id: "neck_ext","label": "Deep neck extensors" }
    ]
  }
] as const;

export const numberFmt = new Intl.NumberFormat("en-US");
export const formatNumber = (n: number) => numberFmt.format(n);

export type GeneratorOpts = {
  weeks?: number;
  sessionsPerWeek?: number;
  injurySafe?: boolean;
  specialEquipment?: boolean;
  nutritionTips?: boolean;
  pdf?: "none" | "text" | "illustrated";
  images?: number;
  videoPlan?: boolean;
  gender?: "male" | "female";
  workoutTypes?: string[];
  targetMuscles?: string[];
};

export function calcFullCourseTokens(opts: GeneratorOpts) {
  const {
    weeks = 4,
    sessionsPerWeek = 4,
    injurySafe = false,
    specialEquipment = false,
    nutritionTips = false,
    pdf = "none",
    images = 0,
    videoPlan = false,
    gender: _gender = "male",
    workoutTypes = [],
    targetMuscles = [],
  } = opts;

  let total = Math.round((400 + weeks * 120 + sessionsPerWeek * weeks * 8) * 1.3);
  if (injurySafe) total += Math.round(120 * 1.3);
  if (specialEquipment) total += Math.round(80 * 1.3);
  if (nutritionTips) total += Math.round(100 * 1.3);
  if (videoPlan) total += Math.round(250 * 1.3);

  if (pdf === "text") total += Math.round(60 * 1.3);
  if (pdf === "illustrated") total += Math.round((60 + images * 10) * 1.3);

  // Additional costs for new options
  if (workoutTypes.length > 0) total += Math.round(workoutTypes.length * 15 * 1.3);
  if (targetMuscles.length > 0) total += Math.round(targetMuscles.length * 8 * 1.3);

  return Math.max(0, total);
}

export const BASELINE_TOKENS = Math.round(1068 * 1.3); // 4w/4d + PDF(text) with 30% increase

export function tokensToApproxWeeks(tokens: number) {
  if (tokens <= 0) return 0;
  return Math.floor((tokens / BASELINE_TOKENS) * 4);
}

export function currencyForRegion(region: "EU" | "UK" | "US") {
  if (region === "UK") {
    return { symbol: "£", unitLabel: "GBP" };
  } else if (region === "EU") {
    return { symbol: "€", unitLabel: "EUR" };
  } else {
    return { symbol: "$", unitLabel: "USD" };
  }
}

// Функция для генерации осмысленных названий курсов
export function generateCourseTitle(opts: GeneratorOpts): string {
  const { weeks = 4, sessionsPerWeek = 4, workoutTypes = [], targetMuscles = [], gender = "male", injurySafe = false, specialEquipment = false, nutritionTips = false } = opts;
  
  // Базовое название
  let title = `${weeks}-Week Fitness Program`;
  
  // Добавляем информацию о частоте тренировок
  if (sessionsPerWeek > 0) {
    title += ` (${sessionsPerWeek} sessions/week)`;
  }
  
  // Добавляем типы тренировок
  if (workoutTypes.length > 0) {
    const workoutType = workoutTypes[0]; // Берем первый тип как основной
    title += ` - ${workoutType}`;
  }
  
  // Добавляем целевые мышцы
  if (targetMuscles.length > 0) {
    const muscleCount = targetMuscles.length;
    if (muscleCount === 1) {
      title += ` for ${targetMuscles[0]}`;
    } else if (muscleCount <= 3) {
      title += ` for ${targetMuscles.slice(0, -1).join(', ')} and ${targetMuscles[targetMuscles.length - 1]}`;
    } else {
      title += ` for ${targetMuscles.slice(0, 2).join(', ')} and ${muscleCount - 2} more`;
    }
  }
  
  // Добавляем специальные характеристики
  const features = [];
  if (injurySafe) features.push("Injury-Safe");
  if (specialEquipment) features.push("Special Equipment");
  if (nutritionTips) features.push("Nutrition Tips");
  
  if (features.length > 0) {
    title += ` - ${features.join(', ')}`;
  }
  
  // Добавляем пол
  title += ` (${gender === 'male' ? 'Men' : 'Women'})`;
  
  return title;
}

// Альтернативная функция для более коротких названий
export function generateShortCourseTitle(opts: GeneratorOpts): string {
  const { weeks = 4, workoutTypes = [], targetMuscles = [] } = opts;
  
  let title = `${weeks}W`;
  
  if (workoutTypes.length > 0) {
    const workoutType = workoutTypes[0].split(' ')[0]; // Берем первое слово
    title += ` ${workoutType}`;
  }
  
  if (targetMuscles.length > 0) {
    const muscle = targetMuscles[0].split('_')[0]; // Берем первое слово до подчеркивания
    title += ` ${muscle.charAt(0).toUpperCase() + muscle.slice(1)}`;
  }
  
  return title;
}

/**
 * Calculate distance walked based on step count
 * Average stride length is approximately 2.5 feet per step
 * Formula: steps * stride_length_feet / feet_per_mile
 * 
 * @param steps - Number of steps taken
 * @param strideLength - Stride length in feet (default: 2.5)
 * @returns Distance in miles
 */
export const calculateDistance = (steps: number, strideLength: number = 2.5): number => {
  const FEET_PER_MILE = 5280;
  const distance = (steps * strideLength) / FEET_PER_MILE;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate calories burned based on step count
 * Uses METs (Metabolic Equivalent of Task) formula
 * Formula: steps * 0.04 * body_weight_kg
 * 
 * @param steps - Number of steps taken
 * @param weightKg - User's body weight in kilograms (default: 70kg / ~154lbs)
 * @returns Calories burned (kcal)
 */
export const calculateCalories = (steps: number, weightKg: number = 70): number => {
  const CALORIES_PER_STEP_PER_KG = 0.04;
  const calories = steps * CALORIES_PER_STEP_PER_KG * weightKg;
  return Math.round(calories);
};

/**
 * Calculate active minutes based on step count
 * Assumes average walking pace of 100 steps per minute
 * Only counts as "active" when pace exceeds threshold (60 steps/min)
 * 
 * @param steps - Number of steps taken
 * @param stepsPerMinute - Average steps per minute (default: 100)
 * @returns Active minutes
 */
export const calculateActiveMinutes = (
  steps: number,
  stepsPerMinute: number = 100
): number => {
  const minutes = steps / stepsPerMinute;
  return Math.round(minutes);
};

/**
 * Calculate progress percentage towards daily goal
 * 
 * @param currentSteps - Current step count
 * @param goalSteps - Daily step goal
 * @returns Progress percentage (0-100)
 */
export const calculateProgress = (currentSteps: number, goalSteps: number): number => {
  if (goalSteps === 0) return 0;
  const percentage = (currentSteps / goalSteps) * 100;
  return Math.min(Math.round(percentage * 10) / 10, 100); // Cap at 100%, round to 1 decimal
};

/**
 * Format step count with thousands separator
 * 
 * @param steps - Number of steps
 * @returns Formatted string (e.g., "7,342")
 */
export const formatStepCount = (steps: number): string => {
  return steps.toLocaleString();
};

/**
 * Format distance for display
 * 
 * @param miles - Distance in miles
 * @returns Formatted string (e.g., "3.2 mi")
 */
export const formatDistance = (miles: number): string => {
  return `${miles.toFixed(1)} mi`;
};

/**
 * Format calories for display
 * 
 * @param calories - Calories burned
 * @returns Formatted string (e.g., "245 kcal")
 */
export const formatCalories = (calories: number): string => {
  return `${calories} kcal`;
};

/**
 * Format active minutes for display
 * 
 * @param minutes - Active minutes
 * @returns Formatted string (e.g., "52 min")
 */
export const formatActiveMinutes = (minutes: number): string => {
  return `${minutes} min`;
};

/**
 * Determine achievement level based on goal completion
 * 
 * @param currentSteps - Current step count
 * @param goalSteps - Daily step goal
 * @returns Achievement level
 */
export const getAchievementLevel = (
  currentSteps: number,
  goalSteps: number
): 'none' | 'bronze' | 'silver' | 'gold' => {
  const percentage = (currentSteps / goalSteps) * 100;
  
  if (percentage < 100) return 'none';
  if (percentage >= 150) return 'gold';   // 150%+ of goal
  if (percentage >= 125) return 'silver'; // 125-149% of goal
  return 'bronze';                         // 100-124% of goal
};

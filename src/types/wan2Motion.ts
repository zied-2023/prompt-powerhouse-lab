export interface MotionKeyframe {
  pct: number;
  duration: number;
  action: string;
  camera: string;
  fx: string;
}

export interface Wan2VideoConfig {
  character: string;
  item: string;
  sign: string;
  place: string;
  time: string;
  kelvin: number;
  motion: MotionKeyframe[];
  cameraPreset: string;
  shakeIntensity: number;
  shakeFreq: number;
  shakeAmp: number;
  smoothing: boolean;
  dust: number;
  haze: number;
  lensRain: boolean;
  neonFlicker: boolean;
  negative: string;
  seed: number;
  seedEnd: number;
  varyStrength: number;
  appendHash: boolean;
  sceneDescription?: string;
}

export const ACTOR_ACTIONS = [
  "walksForward(steps)",
  "walksBackward(steps)",
  "turnHead(dir,angle)",
  "liftHand(side)",
  "adjustMask()",
  "exhaleFog()",
  "stepAside(dir,steps)",
  "drawWeapon()",
  "holsterWeapon()",
  "crossArms()",
  "point(dir)",
  "lookOverShoulder()",
  "crouch()",
  "standUp()",
  "idle(emotion)",
  "nod()",
  "shakeHead()",
  "breathe(intensity)",
  "lean(dir,angle)",
  "turn(dir,angle)",
] as const;

export const CAMERA_ACTIONS = [
  "static",
  "pan(dir,angle)",
  "tilt(dir,angle)",
  "dolly(dir,dist)",
  "truck(dir,dist)",
  "orbit(dir,angle)",
  "whipPan(dir,angle)",
  "crashZoom(factor)",
  "rackFocus(dist)",
  "handheld(intensity)",
  "pedestal(dir,dist)",
  "zoom(factor)",
] as const;

export const FX_EVENTS = [
  "none",
  "dustPuff",
  "breathFog",
  "lensFlare",
  "spark",
  "paperFly",
  "revealSilhouette",
  "lightsFlicker",
  "neonBuzz",
  "rainDrop",
  "smokeWaft",
  "glassBreak",
  "fadeBlack",
  "fadeWhite",
] as const;

export const CAMERA_PRESETS = [
  "static",
  "handheld",
  "steadicam",
  "crane",
  "dolly",
  "orbit",
  "tracking",
  "aerial",
  "dutch",
  "whipPan",
  "crashZoom",
  "rackFocus",
] as const;

export const SIGN_EXPRESSIONS = [
  "confident-stance",
  "cautious-glance",
  "determined-walk",
  "relaxed-pose",
  "tense-readiness",
  "thoughtful-pause",
  "aggressive-posture",
  "defensive-stance",
  "curious-lean",
  "tired-slouch",
] as const;

export const TIME_OPTIONS = [
  "dawn",
  "sunrise",
  "morning",
  "noon",
  "afternoon",
  "golden-hour",
  "sunset",
  "dusk",
  "night",
  "midnight",
] as const;

export const KELVIN_PRESETS = {
  "candlelight": 1800,
  "tungsten": 2700,
  "warm-white": 3200,
  "fluorescent": 4000,
  "daylight": 5600,
  "overcast": 6500,
  "shade": 7500,
  "blue-hour": 9000,
} as const;

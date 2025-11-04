type Language = 'en' | 'fr' | 'ar';

export const translateActorAction = (action: string, lang: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    'walksForward(steps)': {
      en: 'Walks Forward (steps)',
      fr: 'Marche en Avant (pas)',
      ar: 'يمشي للأمام (خطوات)'
    },
    'walksBackward(steps)': {
      en: 'Walks Backward (steps)',
      fr: 'Marche en Arrière (pas)',
      ar: 'يمشي للخلف (خطوات)'
    },
    'turnHead(dir,angle)': {
      en: 'Turn Head (dir, angle)',
      fr: 'Tourne la Tête (dir, angle)',
      ar: 'يدير الرأس (اتجاه، زاوية)'
    },
    'liftHand(side)': {
      en: 'Lift Hand (side)',
      fr: 'Lève la Main (côté)',
      ar: 'يرفع اليد (جانب)'
    },
    'adjustMask()': {
      en: 'Adjust Mask',
      fr: 'Ajuste le Masque',
      ar: 'يعدل القناع'
    },
    'exhaleFog()': {
      en: 'Exhale Fog',
      fr: 'Exhale de la Brume',
      ar: 'يزفر ضباب'
    },
    'stepAside(dir,steps)': {
      en: 'Step Aside (dir, steps)',
      fr: 'Pas de Côté (dir, pas)',
      ar: 'يتنحى جانباً (اتجاه، خطوات)'
    },
    'drawWeapon()': {
      en: 'Draw Weapon',
      fr: 'Dégaine l\'Arme',
      ar: 'يسحب السلاح'
    },
    'holsterWeapon()': {
      en: 'Holster Weapon',
      fr: 'Range l\'Arme',
      ar: 'يغمد السلاح'
    },
    'crossArms()': {
      en: 'Cross Arms',
      fr: 'Croise les Bras',
      ar: 'يتشابك الذراعين'
    },
    'point(dir)': {
      en: 'Point (dir)',
      fr: 'Pointe (dir)',
      ar: 'يشير (اتجاه)'
    },
    'lookOverShoulder()': {
      en: 'Look Over Shoulder',
      fr: 'Regarde par-dessus l\'Épaule',
      ar: 'ينظر من فوق الكتف'
    },
    'crouch()': {
      en: 'Crouch',
      fr: 'S\'Accroupit',
      ar: 'ينحني'
    },
    'standUp()': {
      en: 'Stand Up',
      fr: 'Se Lève',
      ar: 'يقف'
    },
    'idle(emotion)': {
      en: 'Idle (emotion)',
      fr: 'Immobile (émotion)',
      ar: 'ثابت (عاطفة)'
    },
    'nod()': {
      en: 'Nod',
      fr: 'Hochement de Tête',
      ar: 'يومئ بالرأس'
    },
    'shakeHead()': {
      en: 'Shake Head',
      fr: 'Secoue la Tête',
      ar: 'يهز الرأس'
    },
    'breathe(intensity)': {
      en: 'Breathe (intensity)',
      fr: 'Respire (intensité)',
      ar: 'يتنفس (شدة)'
    },
    'lean(dir,angle)': {
      en: 'Lean (dir, angle)',
      fr: 'Se Penche (dir, angle)',
      ar: 'يميل (اتجاه، زاوية)'
    },
    'turn(dir,angle)': {
      en: 'Turn (dir, angle)',
      fr: 'Tourne (dir, angle)',
      ar: 'يستدير (اتجاه، زاوية)'
    },
  };

  return translations[action]?.[lang] || action;
};

export const translateCameraAction = (action: string, lang: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    'static': {
      en: 'Static',
      fr: 'Statique',
      ar: 'ثابتة'
    },
    'pan(dir,angle)': {
      en: 'Pan (dir, angle)',
      fr: 'Panoramique (dir, angle)',
      ar: 'بان (اتجاه، زاوية)'
    },
    'tilt(dir,angle)': {
      en: 'Tilt (dir, angle)',
      fr: 'Inclinaison (dir, angle)',
      ar: 'إمالة (اتجاه، زاوية)'
    },
    'dolly(dir,dist)': {
      en: 'Dolly (dir, dist)',
      fr: 'Dolly (dir, dist)',
      ar: 'دولي (اتجاه، مسافة)'
    },
    'truck(dir,dist)': {
      en: 'Truck (dir, dist)',
      fr: 'Travelling (dir, dist)',
      ar: 'تراك (اتجاه، مسافة)'
    },
    'orbit(dir,angle)': {
      en: 'Orbit (dir, angle)',
      fr: 'Orbite (dir, angle)',
      ar: 'مدار (اتجاه، زاوية)'
    },
    'whipPan(dir,angle)': {
      en: 'Whip Pan (dir, angle)',
      fr: 'Panoramique Rapide (dir, angle)',
      ar: 'بان سريع (اتجاه، زاوية)'
    },
    'crashZoom(factor)': {
      en: 'Crash Zoom (factor)',
      fr: 'Zoom Brutal (facteur)',
      ar: 'زوم قوي (معامل)'
    },
    'rackFocus(dist)': {
      en: 'Rack Focus (dist)',
      fr: 'Point de Mise au Point (dist)',
      ar: 'تغيير بؤرة (مسافة)'
    },
    'handheld(intensity)': {
      en: 'Handheld (intensity)',
      fr: 'Caméra Portée (intensité)',
      ar: 'كاميرا يدوية (شدة)'
    },
    'pedestal(dir,dist)': {
      en: 'Pedestal (dir, dist)',
      fr: 'Pied de Caméra (dir, dist)',
      ar: 'قاعدة (اتجاه، مسافة)'
    },
    'zoom(factor)': {
      en: 'Zoom (factor)',
      fr: 'Zoom (facteur)',
      ar: 'تكبير (معامل)'
    },
  };

  return translations[action]?.[lang] || action;
};

export const translateFxEvent = (fx: string, lang: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    'none': {
      en: 'No FX',
      fr: 'Aucun FX',
      ar: 'بدون تأثيرات'
    },
    'dustPuff': {
      en: 'Dust Puff',
      fr: 'Nuage de Poussière',
      ar: 'نفخة غبار'
    },
    'breathFog': {
      en: 'Breath Fog',
      fr: 'Buée Respiratoire',
      ar: 'ضباب التنفس'
    },
    'lensFlare': {
      en: 'Lens Flare',
      fr: 'Flare d\'Objectif',
      ar: 'توهج العدسة'
    },
    'spark': {
      en: 'Spark',
      fr: 'Étincelle',
      ar: 'شرارة'
    },
    'paperFly': {
      en: 'Paper Fly',
      fr: 'Papier Volant',
      ar: 'ورق طائر'
    },
    'revealSilhouette': {
      en: 'Reveal Silhouette',
      fr: 'Révèle Silhouette',
      ar: 'إظهار الصورة الظلية'
    },
    'lightsFlicker': {
      en: 'Lights Flicker',
      fr: 'Lumières Scintillent',
      ar: 'وميض الأضواء'
    },
    'neonBuzz': {
      en: 'Neon Buzz',
      fr: 'Bourdonnement Néon',
      ar: 'طنين النيون'
    },
    'rainDrop': {
      en: 'Rain Drop',
      fr: 'Goutte de Pluie',
      ar: 'قطرة مطر'
    },
    'smokeWaft': {
      en: 'Smoke Waft',
      fr: 'Fumée Flottante',
      ar: 'دخان متصاعد'
    },
    'glassBreak': {
      en: 'Glass Break',
      fr: 'Bris de Verre',
      ar: 'كسر زجاج'
    },
    'fadeBlack': {
      en: 'Fade to Black',
      fr: 'Fondu au Noir',
      ar: 'تلاشي للأسود'
    },
    'fadeWhite': {
      en: 'Fade to White',
      fr: 'Fondu au Blanc',
      ar: 'تلاشي للأبيض'
    },
  };

  return translations[fx]?.[lang] || fx;
};

export const translateCameraPreset = (preset: string, lang: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    'static': {
      en: 'Static',
      fr: 'Statique',
      ar: 'ثابتة'
    },
    'handheld': {
      en: 'Handheld',
      fr: 'Caméra Portée',
      ar: 'كاميرا يدوية'
    },
    'steadicam': {
      en: 'Steadicam',
      fr: 'Steadicam',
      ar: 'ستيديكام'
    },
    'crane': {
      en: 'Crane',
      fr: 'Grue',
      ar: 'رافعة'
    },
    'dolly': {
      en: 'Dolly',
      fr: 'Dolly',
      ar: 'دولي'
    },
    'orbit': {
      en: 'Orbit',
      fr: 'Orbite',
      ar: 'مدار'
    },
    'tracking': {
      en: 'Tracking',
      fr: 'Suivi',
      ar: 'تتبع'
    },
    'aerial': {
      en: 'Aerial',
      fr: 'Aérien',
      ar: 'جوي'
    },
    'dutch': {
      en: 'Dutch Angle',
      fr: 'Angle Néerlandais',
      ar: 'زاوية هولندية'
    },
    'whipPan': {
      en: 'Whip Pan',
      fr: 'Panoramique Rapide',
      ar: 'بان سريع'
    },
    'crashZoom': {
      en: 'Crash Zoom',
      fr: 'Zoom Brutal',
      ar: 'زوم قوي'
    },
    'rackFocus': {
      en: 'Rack Focus',
      fr: 'Point de Mise au Point',
      ar: 'تغيير بؤرة'
    },
  };

  return translations[preset]?.[lang] || preset;
};

export const translateSignExpression = (sign: string, lang: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    'confident-stance': {
      en: 'Confident Stance',
      fr: 'Posture Confiante',
      ar: 'وقفة واثقة'
    },
    'cautious-glance': {
      en: 'Cautious Glance',
      fr: 'Regard Prudent',
      ar: 'نظرة حذرة'
    },
    'determined-walk': {
      en: 'Determined Walk',
      fr: 'Marche Déterminée',
      ar: 'مشية حازمة'
    },
    'relaxed-pose': {
      en: 'Relaxed Pose',
      fr: 'Pose Détendue',
      ar: 'وضعية مسترخية'
    },
    'tense-readiness': {
      en: 'Tense Readiness',
      fr: 'Vigilance Tendue',
      ar: 'استعداد متوتر'
    },
    'thoughtful-pause': {
      en: 'Thoughtful Pause',
      fr: 'Pause Réfléchie',
      ar: 'توقف متأمل'
    },
    'aggressive-posture': {
      en: 'Aggressive Posture',
      fr: 'Posture Agressive',
      ar: 'وضعية عدوانية'
    },
    'defensive-stance': {
      en: 'Defensive Stance',
      fr: 'Posture Défensive',
      ar: 'وقفة دفاعية'
    },
    'curious-lean': {
      en: 'Curious Lean',
      fr: 'Inclinaison Curieuse',
      ar: 'ميل فضولي'
    },
    'tired-slouch': {
      en: 'Tired Slouch',
      fr: 'Posture Fatiguée',
      ar: 'انحناء متعب'
    },
  };

  return translations[sign]?.[lang] || sign.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export const translateTimeOption = (time: string, lang: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    'dawn': {
      en: 'Dawn',
      fr: 'Aube',
      ar: 'فجر'
    },
    'sunrise': {
      en: 'Sunrise',
      fr: 'Lever du Soleil',
      ar: 'شروق'
    },
    'morning': {
      en: 'Morning',
      fr: 'Matin',
      ar: 'صباح'
    },
    'noon': {
      en: 'Noon',
      fr: 'Midi',
      ar: 'ظهيرة'
    },
    'afternoon': {
      en: 'Afternoon',
      fr: 'Après-midi',
      ar: 'عصر'
    },
    'golden-hour': {
      en: 'Golden Hour',
      fr: 'Heure Dorée',
      ar: 'الساعة الذهبية'
    },
    'sunset': {
      en: 'Sunset',
      fr: 'Coucher du Soleil',
      ar: 'غروب'
    },
    'dusk': {
      en: 'Dusk',
      fr: 'Crépuscule',
      ar: 'شفق'
    },
    'night': {
      en: 'Night',
      fr: 'Nuit',
      ar: 'ليل'
    },
    'midnight': {
      en: 'Midnight',
      fr: 'Minuit',
      ar: 'منتصف الليل'
    },
  };

  return translations[time]?.[lang] || time.charAt(0).toUpperCase() + time.slice(1);
};

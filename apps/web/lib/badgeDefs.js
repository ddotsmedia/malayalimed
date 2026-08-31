// badgeDefs.js — client-safe badge catalog (no server imports).
export const BADGES = {
  first_appointment: { label: 'First Step', description: 'Book your first appointment', icon: '🏥' },
  health_streak_7: { label: 'Tracker', description: '7 days of health tracking', icon: '📊' },
  prescription_uploaded: { label: 'Health Record', description: 'Upload a prescription', icon: '💊' },
  qa_answered: { label: 'Asked a Doctor', description: 'Ask a Q&A question', icon: '🤔' },
  review_posted: { label: 'Reviewer', description: 'Post a review', icon: '⭐' },
  consultation_completed: { label: 'Connected', description: 'Complete a consultation', icon: '📞' },
};
export const BADGE_ORDER = ['first_appointment', 'health_streak_7', 'prescription_uploaded', 'qa_answered', 'review_posted', 'consultation_completed'];

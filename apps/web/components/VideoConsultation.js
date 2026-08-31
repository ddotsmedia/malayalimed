'use client';

// VideoConsultation — Jitsi Meet embed (iframe, no package). The room is derived
// from the appointment and shared by doctor + patient.

import { useState } from 'react';

export default function VideoConsultation({ room, domain = 'meet.jit.si', displayName = '', locale = 'ml' }) {
  const [joined, setJoined] = useState(false);
  const ml = locale === 'ml';
  const src = `https://${domain}/${encodeURIComponent(room)}#userInfo.displayName="${encodeURIComponent(displayName)}"&config.prejoinPageEnabled=false`;

  if (!joined) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
        <div className="text-4xl">🎥</div>
        <h3 className="mt-2 font-semibold text-slate-900">{ml ? 'വീഡിയോ കൺസൾട്ടേഷൻ' : 'Video consultation'}</h3>
        <p className="mt-1 text-sm text-slate-500">{ml ? 'ഡോക്ടറുമായി സുരക്ഷിത വീഡിയോ കോൾ.' : 'Secure video call with your doctor.'}</p>
        <button onClick={() => setJoined(true)} className="mt-3 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          {ml ? 'കോളിൽ ചേരുക' : 'Join call'}
        </button>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
      <iframe title="Video consultation" src={src} allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="h-[70vh] w-full" style={{ border: 0 }} />
    </div>
  );
}

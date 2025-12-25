/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;

const getCtx = () => {
    if (!audioCtx) {
        const Ctor = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctor) audioCtx = new Ctor();
    }
    return audioCtx;
};

export const playSound = (type: 'shoot' | 'pop' | 'match' | 'click' | 'hover') => {
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    const t = ctx.currentTime;

    switch (type) {
        case 'shoot': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.exponentialRampToValueAtTime(600, t + 0.25);
            
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.linearRampToValueAtTime(0, t + 0.25);
            
            osc.start(t);
            osc.stop(t + 0.3);
            break;
        }
        case 'pop': {
            // Short high pitched pop
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);

            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

            osc.start(t);
            osc.stop(t + 0.1);
            break;
        }
        case 'match': {
            // Pleasant chord
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.value = freq;
                
                gain.gain.setValueAtTime(0, t + i * 0.05);
                gain.gain.linearRampToValueAtTime(0.1, t + i * 0.05 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.4);

                osc.start(t + i * 0.05);
                osc.stop(t + i * 0.05 + 0.5);
            });
            break;
        }
        case 'click': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(1200, t);
            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            
            osc.start(t);
            osc.stop(t + 0.05);
            break;
        }
    }
};

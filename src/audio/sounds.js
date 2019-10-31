import UIfx from 'audio/UIFx'
import soundtrack from 'audio/soundtrack.mp3';
import womanLaugh from 'audio/woman-laugh.mp3';
import laughShort from 'audio/laugh-short.mp3';
import bahumbug from 'audio/bahumbug.mp3';
import letMeAtHim from 'audio/let-me-at-him.mp3';
import shhhh from 'audio/shhhh.mp3';
import butter from 'audio/butter.mp3';
import somethingsHappening from 'audio/somethings-happening.mp3';
import gdayMate from 'audio/gday-mate.mp3';
import panic from 'audio/panic.mp3';
import manCough from 'audio/man-couph.mp3';

export default {
  intro: new UIfx(soundtrack, { volume: 0.4, throttleMs: 100 }),
  ladyRed: new UIfx(womanLaugh, { volume: 0.4, throttleMs: 100 }),
  asia: new UIfx(laughShort, { volume: 0.4, throttleMs: 100 }),
  midge: new UIfx(bahumbug, { volume: 0.4, throttleMs: 100 }),
  officerDope: new UIfx(letMeAtHim, { volume: 0.4, throttleMs: 100 }),
  dahlia: new UIfx(shhhh, { volume: 0.4, throttleMs: 100 }),
  dudeManGuy: new UIfx(butter, { volume: 0.4, throttleMs: 100 }),
  jawbone: new UIfx(somethingsHappening, { volume: 0.4, throttleMs: 100 }),
  mike: new UIfx(gdayMate, { volume: 0.4, throttleMs: 100 }),
  roger: new UIfx(manCough, { volume: 0.4, throttleMs: 100 }),
  tom: new UIfx(panic, { volume: 0.4, throttleMs: 100 })
};

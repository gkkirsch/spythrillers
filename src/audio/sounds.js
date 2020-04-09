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
import tick from 'audio/tick.mp3';
import tock from 'audio/tock.mp3';

export default {
  tick: new UIfx(tick, { volume: 1, throttleMs: 100 }),
  tock: new UIfx(tock, { volume: 1, throttleMs: 100 }),
  intro: new UIfx(soundtrack, { volume: 1, throttleMs: 60000 }),
  ladyRed: new UIfx(womanLaugh, { volume: 1, throttleMs: 600000 }),
  asia: new UIfx(laughShort, { volume: 1, throttleMs: 600000 }),
  midge: new UIfx(bahumbug, { volume: 1, throttleMs: 600000 }),
  officerDope: new UIfx(letMeAtHim, { volume: 1, throttleMs: 600000 }),
  dahlia: new UIfx(shhhh, { volume: 1, throttleMs: 600000 }),
  dudeManGuy: new UIfx(butter, { volume: 1, throttleMs: 600000 }),
  jawbone: new UIfx(somethingsHappening, { volume: 1, throttleMs: 600000 }),
  mike: new UIfx(gdayMate, { volume: 1, throttleMs: 600000 }),
  roger: new UIfx(manCough, { volume: 1, throttleMs: 600000 }),
  tom: new UIfx(panic, { volume: 1, throttleMs: 600000 })
};

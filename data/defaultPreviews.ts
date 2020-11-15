import { darkCirclesRepository } from './previews/darkCirclesRepository';
import { darkCirclesSystem } from './previews/darkCirclesSystem';
import { darkSquaresRepository } from './previews/darkSquaresRepository';
import { darkSquaresSystem } from './previews/darkSquaresSystem';
import { legacyPreview } from './previews/legacy';
import { lightCirclesRepository } from './previews/lightCirclesRepository';
import { lightCirclesSystem } from './previews/lightCirclesSystem';
import { lightSquaresRepository } from './previews/lightSquaresRepository';
import { lightSquaresSystem } from './previews/lightSquaresSystem';

export const previews = {
  light: {
    circles: {
      repository: lightCirclesRepository,
      system: lightCirclesSystem,
    },
    squares: {
      repository: lightSquaresRepository,
      system: lightSquaresSystem,
    },
  },
  dark: {
    circles: {
      repository: darkCirclesRepository,
      system: darkCirclesSystem,
    },
    squares: {
      repository: darkSquaresRepository,
      system: darkSquaresSystem,
    },
  },

  legacy: legacyPreview,
};

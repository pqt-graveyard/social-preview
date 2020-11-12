import { Octokit } from '@octokit/rest';
import Jimp from 'jimp';
import { NextApiRequest, NextApiResponse } from 'next';
import seedrandom from 'seedrandom';
import YAML from 'yaml';
import { errorMessages, generateQueryParameterErrorMessage } from '../../../data/errorMessages';

const fromAWS = (path: string) => 'https://s3.ca-central-1.amazonaws.com/austinpaquette.com'.concat(path);

/* eslint-disable unicorn/no-for-loop */
const weightedRandom = (items: [string, number][], randomizer: () => number = Math.random) => {
  // First, we loop the main dataset to count up the total weight. We're starting the counter at one because the upper boundary of Math.random() is exclusive.
  let total = 1;
  for (let i = 0; i < items.length; ++i) {
    total += items[i][1];
  }

  // Total in hand, we can now pick a random value akin to our
  // random index from before.
  const threshold = Math.floor(randomizer() * total);

  // Now we just need to loop through the main data one more time
  // until we discover which value would live within this
  // particular threshold. We need to keep a running count of
  // weights as we go, so let's just reuse the "total" variable
  // since it was already declared.
  total = 0;
  for (let i = 0; i < items.length; ++i) {
    // Add the weight to our running total.
    total += items[i][1];

    // If this value falls within the threshold, we're done!
    if (total >= threshold) {
      return items[i][0];
    }
  }
};
/* eslint-enable unicorn/no-for-loop */

const hexToRgb = (hex: string): Nullable<RGB> => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([\da-f])([\da-f])([\da-f])$/i;
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  return result
    ? {
        red: Number.parseInt(result[1], 16),
        green: Number.parseInt(result[2], 16),
        blue: Number.parseInt(result[3], 16),
      }
    : null;
};

const acceptableParameters = {
  dots: ['circle', 'square'],
  display: ['dark', 'light'],
  responseType: ['image', 'json'],
};

export default async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  try {
    /**
     * Incoming Endpoint Parameters
     */
    const [owner, repo] = (request.query.repo as string[]) || ['pqt', 'social-preview'];

    /**
     * Incoming Query Parameter: GitHub Personal Access Token
     * ! (DO NOT STORE THIS ANYWHERE. EVER. USE IT, THEN LOSE IT.)
     */
    const token: Nullable<string> = (request.query.token as string) || null;

    /**
     * Incoming Query Parameter: Custom Seed String for the randomizer function
     */
    const seed: Nullable<string> = (request.query.seed as string) || null;

    /**
     * Comma-separate values of hexidecimal colors that will be used on the generated image
     */
    // const colors: Nullable<string> = (request.query.colors as string) || null;

    /**
     * Incoming Query Parameter: Determines whether the base is dark or light (and the foreground is the opposite)
     */
    const displayParameter = (request.query.display as string) || 'light';
    console.log(displayParameter);
    /**
     * Immediately throw if an invalid image type is requested
     */
    if (!acceptableParameters.display.includes(displayParameter)) {
      throw generateQueryParameterErrorMessage('display', acceptableParameters.display, 'light');
    }

    /**
     * Incoming Query Parameter: Determines whether the dots are squares or circles
     */
    const dotTypeParameter = (request.query.dots as string) || 'circle';

    /**
     * Immediately throw if an invalid parameter value is requested
     */
    if (!acceptableParameters.dots.includes(dotTypeParameter)) {
      throw generateQueryParameterErrorMessage('dots', acceptableParameters.dots, 'circle');
    }

    /**
     * Incoming Query Parameter: Determines how the API responds to the request. JSON or Image
     */
    const responseTypeParameter = (request.query.responseType as string) || 'json';

    /**
     * Immediately throw if an invalid parameter value is requested
     */
    if (!acceptableParameters.responseType.includes(responseTypeParameter)) {
      throw generateQueryParameterErrorMessage('responseType', acceptableParameters.responseType, 'json');
    }

    /**
     * Instantiate the GitHub API Client
     */
    const octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    });

    /**
     * Fetch the GitHub Repository
     */
    const { data: repository } = await octokit.repos.get({
      owner,
      repo,
    });

    /**
     * Fetch the GitHub Respository Language Data
     */
    const { data: languages } = await octokit.repos.listLanguages({
      owner,
      repo,
    });

    /**
     * Fetch the GitHub language colors source-of-truth
     */
    const { data: linguistInitial } = await octokit.repos.getContents({
      owner: 'github',
      repo: 'linguist',
      path: 'lib/linguist/languages.yml',
      mediaType: {
        format: 'base64',
      },
    });

    /**
     * Create a Buffer for the linguistInitial content
     * Parse the YML file so we can extract the colors we need from it later
     */
    const linguistContent = linguistInitial as { content: string };
    const linguistBuffer = Buffer.from(linguistContent.content as string, 'base64');
    const linguist = YAML.parse(linguistBuffer.toString('utf-8'));

    /**
     * Initialize the random function with a custom seed so it's consistent
     * This accepts the query param and will otherwise fallback on the unique repository ID
     */
    const random = seedrandom(seed || repository.id.toString());

    /**
     * Remote Template Images
     */
    const template = {
      base:
        displayParameter === 'light'
          ? await Jimp.read(fromAWS('/meta/base.png'))
          : await Jimp.read(fromAWS('/meta/base_dark.png')),
      dot:
        dotTypeParameter === 'circle'
          ? await Jimp.read(fromAWS('/meta/dot_black.png'))
          : await Jimp.read(fromAWS('/meta/square_black.png')),

      circle: await Jimp.read(fromAWS('/meta/dot_black.png')),
      square: await Jimp.read(fromAWS('/meta/square_black.png')),

      githubLogo:
        displayParameter === 'light'
          ? await Jimp.read(fromAWS('/meta/github_black.png'))
          : await Jimp.read(fromAWS('/meta/github_white.png')),
    };

    /**
     * Font family used for writing
     */
    const font =
      displayParameter === 'light'
        ? await Jimp.loadFont(
            'https://unpkg.com/@jimp/plugin-print@0.10.3/fonts/open-sans/open-sans-64-black/open-sans-64-black.fnt'
          )
        : await Jimp.loadFont(
            'https://unpkg.com/@jimp/plugin-print@0.10.3/fonts/open-sans/open-sans-64-white/open-sans-64-white.fnt'
          );
    // const fontSm = await Jimp.loadFont(
    //   'https://unpkg.com/@jimp/plugin-print@0.10.3/fonts/open-sans/open-sans-32-black/open-sans-32-black.fnt'
    // );

    /**
     * Required Image Dimensions
     */
    const width = 1280;
    const height = 640;

    /**
     * Total Count of Squares (Dimensions)
     */
    const horizontal = width / 20;
    const vertical = height / 20;

    /**
     * Spacing
     */
    const spacing = 40;

    /**
     * Base Image
     */
    const dots = [...new Array(horizontal * vertical)];
    const image = template.base.clone().resize(width, height);

    /**
     * Protected Area Coordinates
     */
    const protectedArea = {
      x: { min: 185, max: 1085 },
      y: { min: 185, max: 445 },
    };

    /**
     * Positional and Location Helper Functions
     */
    const getXPosition = (index: number): number => {
      return 5 + (index % horizontal) * 20;
    };

    const getYPosition = (index: number): number => {
      return 5 + 20 * Math.floor(index / horizontal);
    };

    const isInnerRing = (index: number, rows = 1): boolean => {
      if (
        getXPosition(index) > protectedArea.x.min - rows * 20 &&
        getXPosition(index) < protectedArea.x.max + rows * 20 &&
        getYPosition(index) > protectedArea.y.min - rows * 20 &&
        getYPosition(index) < protectedArea.y.max + rows * 20
      ) {
        return true;
      }

      return false;
    };

    const isProtectedArea = (index: number): boolean => {
      if (
        getXPosition(index) > protectedArea.x.min &&
        getXPosition(index) < protectedArea.x.max &&
        getYPosition(index) > protectedArea.y.min &&
        getYPosition(index) < protectedArea.y.max
      ) {
        return true;
      }

      return false;
    };

    const generateOpacity = (index: number, opacityStart: number): number => {
      const opacityBoost = 0.45;
      const opacity = opacityStart + opacityBoost > 1 ? 1 : opacityStart + opacityBoost;

      // if (isInnerRing(index, 1)) return 0.05 * opacity;
      // if (isInnerRing(index, 2)) return 0.1 * opacity;
      // if (isInnerRing(index, 3)) return 0.15 * opacity;
      // if (isInnerRing(index, 4)) return 0.2 * opacity;
      // if (isInnerRing(index, 5)) return 0.25 * opacity;
      // if (isInnerRing(index, 6)) return 0.3 * opacity;
      // if (isInnerRing(index, 7)) return 0.35 * opacity;
      // if (isInnerRing(index, 8)) return 0.4 * opacity;
      // if (isInnerRing(index, 9)) return 0.45 * opacity;
      // if (isInnerRing(index, 10)) return 0.5 * opacity;

      if (isInnerRing(index, 1)) return 0.4 * opacity;
      if (isInnerRing(index, 2)) return 0.4 * opacity;
      if (isInnerRing(index, 3)) return 0.5 * opacity;
      if (isInnerRing(index, 4)) return 0.5 * opacity;
      if (isInnerRing(index, 5)) return 0.6 * opacity;

      // if (isInnerRing(index, 6)) return 0.3 * opacity;
      // if (isInnerRing(index, 7)) return 0.4 * opacity;
      // if (isInnerRing(index, 8)) return 0.4 * opacity;
      // if (isInnerRing(index, 9)) return 0.5 * opacity;
      // if (isInnerRing(index, 10)) return 0.5 * opacity;

      return opacity;
    };

    /**
     * Reducer Function for applying the dynamic generation logic to each dot
     */
    const dotReducer = (_: unknown, __: unknown, index: number): void => {
      /**
       * If the index is within a protected area we already know to stop.
       * Nothing will be added in the protected region.
       */
      if (isProtectedArea(index)) return;

      /**
       * If we randomly generate a number between 1 and 100 and it's 80 or greater, let's just skip.
       * This reduces needlessly large amounts of squares from being added in a somewhat controlled way.
       * This basically gives us a percentage of reduction.
       */
      const reduction = 80;
      // const reduction = 0;
      if (Math.floor(random() * 100) + 1 >= 100 - reduction) return;

      /**
       * If we haven't returned already, we're ready to proceed.
       */
      const dot = template.dot.clone();

      /**
       * Randomly select the language key we want to use to fetch our color.
       * Provide preference to the language-byte-counter provided by GitHub.
       */
      const colorLanguageKey = weightedRandom(Object.entries(languages), random) as string;

      /**
       * If it exists, pluck the Hexidecimal code we need for the language key randomly picked
       */
      let { color: hexColor } = linguist[colorLanguageKey] as { color: string | undefined };

      /**
       * Fix the hex color to a sensible default if it's undefined
       */
      if (hexColor === undefined) {
        hexColor = 'cccccc';
      }

      /**
       * Convert the Hexidecimal value to a Jimp compatible RGB
       */
      let color = hexToRgb(hexColor);

      /**
       * Fix the color to a sensible default if it's null
       */
      if (color === null) {
        color = hexToRgb('cccccc') as RGB;
      }

      /**
       * Destructure the color and apply it to the square
       */
      const { red, green, blue } = color;
      dot.color([
        { apply: 'red', params: [red] },
        { apply: 'green', params: [green] },
        { apply: 'blue', params: [blue] },
      ]);

      /**
       * Randomly generate (and validate) the opacity of our square.
       * The generateOpacity function adds the fade out effect towards to the center
       */
      const opacity = generateOpacity(index, random());
      dot.opacity(opacity);

      /**
       * Our Square is not ready let's finally apply it to our image
       */
      image.composite(dot, getXPosition(index), getYPosition(index));
    };
    dots.reduce(dotReducer, dots[0]);

    /**
     * Generate a secondary image to place on the protected area
     */
    const protectedAreaImageWidth = protectedArea.x.max - protectedArea.x.min - 20;
    const protectedAreaImageHeight = protectedArea.y.max - protectedArea.y.min - 20;
    const protectedAreaImage = template.base.clone().resize(protectedAreaImageWidth, protectedAreaImageHeight);

    /**
     * Find the Boundaries of the text that's about to be written on the image
     */
    const textWidth = Jimp.measureText(font, repository.full_name);
    const textHeight = Jimp.measureTextHeight(font, repository.full_name, protectedAreaImageWidth);

    /**
     * Apply Title
     */
    protectedAreaImage.print(
      font,
      protectedAreaImageWidth / 2 - textWidth / 2 + (128 + 40) / 2,
      protectedAreaImageHeight / 2 - textHeight / 2,
      {
        text: repository.full_name,
        // alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentX: 0,
      },
      width - spacing * 2,
      height - spacing * 2
    );

    /**
     * Place the protected area image onto the protected area
     */
    protectedAreaImage.composite(
      template.githubLogo,
      450 - 128 / 2 - textWidth / 2 - 40,
      protectedAreaImageHeight / 2 - 128 / 2
    );
    image.composite(protectedAreaImage, 200, 200);

    if (responseTypeParameter === 'image') {
      /**
       * Set the Content-Type header so the browser knows we're directly returning an image
       */
      response.setHeader('Content-Type', 'image/png');
      return response.end(await image.getBufferAsync(Jimp.MIME_PNG));
    } else {
      return response.status(200).json({
        data: {
          id: repository.id,
          image: await image.getBase64Async(Jimp.MIME_PNG),
        },
      });
    }
  } catch (error) {
    console.log(error);

    if (!error.status) {
      return response.json({
        data: {
          error,
        },
      });
    }

    return response.status(error.status).json({
      data: {
        error: errorMessages[error.status],
      },
    });
  }
};

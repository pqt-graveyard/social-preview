import Jimp from 'Jimp';
import { Octokit } from '@octokit/rest';
import { NextApiRequest, NextApiResponse } from 'next';
import { defaultColors } from '../../../data/defaultColors';
import { generateQueryParameterErrorMessage } from '../../../data/errorMessages';
import seedrandom from 'seedrandom';
import { languageColors } from '../../../data/languageColors';

type Nullable<T> = T | null;

type RGB = {
  red: number;
  green: number;
  blue: number;
};

function hexToRgb(hex: string): Nullable<RGB> {
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
}

function getColors(colorSourceParameter: string, colorsParameter: string[], languageKeys: string[]): RGB[] {
  if (colorSourceParameter === 'repositoryLanguages') {
    return (Object.entries(languageColors) as [string, string][])
      .filter((entry) => languageKeys.includes(entry[0]))
      .map(([, value]) => hexToRgb(value)) as RGB[];
  }

  return defaultColors
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
    .map((value) => hexToRgb(value)) as RGB[];

  // colorsParameter !== undefined ? colorsParameter.map((color) => hexToRgb(color)) : undefined
}

export default async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  try {
    /**
     * Incoming Endpoint Parameters
     */
    const [owner, repo] = (request.query.repo as string[]) || ['pqt', 'social-preview'];

    /**
     * Incoming Query Parameter: GitHub Personal Access Token
     * ! (DO NOT STORE THIS ANYWHERE. EVER.)
     */
    const token: string | null = (request.query.token as string) || null;

    /**
     * Incoming Query Parameter: Array of colors to pick from when placing squares on the meta image
     */
    const colorsParameter =
      typeof request.query.colors !== 'undefined'
        ? (request.query.colors as string).split(',')
        : defaultColors.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);

    /**
     * Incoming Query Parameter: Requested color source type of the response, determines which color palette to use
     */
    const colorSourceParameter = (request.query.colorSource as string) || 'tailwind';

    /**
     * Immediately throw if an invalid color type is requested
     */
    if (!['repositoryLanguages', 'tailwind'].includes(colorSourceParameter)) {
      throw generateQueryParameterErrorMessage('colorSource', ['repositoryLanguages', 'tailwind'], 'tailwind');
    }

    /**
     * Incoming Query Parameter: Requested format type of the response, determines whether a pure image or JSON API with Base64 value is returned.
     *
     * Acceptable values: base64 | image
     */
    const imageTypeParameter = (request.query.type as string) || 'image';

    /**
     * Immediately throw if an invalid image type is requested
     */
    if (!['image', 'base64'].includes(imageTypeParameter)) {
      throw generateQueryParameterErrorMessage('type', ['image', 'base64'], 'image');
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
    const { data: initialLanguagesData } = await octokit.repos.listLanguages({
      owner,
      repo,
    });

    /**
     * Convert the Returned Language Data (object) into an array of arrays
     */
    const intialLanguagesDataArray = Object.entries(initialLanguagesData);

    /**
     * Create a reference to the total number of bytes in the repository
     */
    const totalLanguageCounter = intialLanguagesDataArray
      .map(([, value]) => value)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    /**
     * Convert the languages byte count value into a relative percentage
     */
    const languages: [string, number][] = intialLanguagesDataArray.map(([languageKey, value]) => {
      return [languageKey, Math.floor((value / totalLanguageCounter) * 100)];
    });

    /**
     * Seeded Random
     */
    const random = seedrandom(repository.id.toString());

    /**
     * Remote Template Images
     */
    const backgroundTemplate = await Jimp.read(
      'https://s3.ca-central-1.amazonaws.com/austinpaquette.com/meta/base.png'
    );
    const squareTemplate = await Jimp.read(
      'https://s3.ca-central-1.amazonaws.com/austinpaquette.com/meta/square_black.png'
    );

    const githubLogo = await Jimp.read('https://s3-us-west-2.amazonaws.com/s.cdpn.io/209282/github-logo.png');

    /**
     * Font family used for writing
     */
    const font = await Jimp.loadFont(
      'https://unpkg.com/@jimp/plugin-print@0.10.3/fonts/open-sans/open-sans-64-black/open-sans-64-black.fnt'
    );
    const fontSm = await Jimp.loadFont(
      'https://unpkg.com/@jimp/plugin-print@0.10.3/fonts/open-sans/open-sans-32-black/open-sans-32-black.fnt'
    );

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
    const options = [...new Array(horizontal * vertical)];
    const image = backgroundTemplate.clone().resize(width, height);

    /**
     * Protected Area Coordinates
     */
    const protectedArea = {
      x: { min: 185, max: 1085 },
      y: { min: 185, max: 445 },
    };

    /**
     * Helper Functions
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

      if (isInnerRing(index, 1)) return 0.05 * opacity;
      if (isInnerRing(index, 2)) return 0.1 * opacity;
      if (isInnerRing(index, 3)) return 0.15 * opacity;
      if (isInnerRing(index, 4)) return 0.2 * opacity;
      if (isInnerRing(index, 5)) return 0.25 * opacity;
      if (isInnerRing(index, 6)) return 0.3 * opacity;
      if (isInnerRing(index, 7)) return 0.35 * opacity;
      if (isInnerRing(index, 8)) return 0.4 * opacity;
      if (isInnerRing(index, 9)) return 0.45 * opacity;
      if (isInnerRing(index, 10)) return 0.5 * opacity;

      return opacity;
    };

    /**
     * Apply Generation Magic
     */
    const reducer = (_: unknown, __: unknown, index: number): void => {
      if (isProtectedArea(index)) return;
      if (Math.floor(random() * 16) + 1 >= 10) return;

      const square = squareTemplate.clone();

      let color: Nullable<RGB>;
      const colors = getColors(
        colorSourceParameter,
        colorsParameter,
        languages.map(([languageKey]) => languageKey)
      );
      // const colors = [{ red: 0, green: 0, blue: 0 }];

      if (colors !== undefined) {
        const randomColorIndex = Math.floor(random() * colors.length);
        color = colors[randomColorIndex];
      } else {
        const randomColorIndex = Math.floor(random() * defaultColors.length);
        const randomColorDarkness = Math.floor(random() * defaultColors[randomColorIndex].length);
        color = hexToRgb(defaultColors[randomColorIndex][randomColorDarkness]);
      }

      if (color !== null) {
        const { red, green, blue } = color;
        square.color([
          { apply: 'red', params: [red] },
          { apply: 'green', params: [green] },
          { apply: 'blue', params: [blue] },
        ]);
      }

      const opacity = generateOpacity(index, random());

      square.opacity(opacity);

      image.composite(square, getXPosition(index), getYPosition(index));
    };
    options.reduce(reducer, options[0]);

    // const textWidth = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then((font) => {
    //   return Jimp.measureText(
    //     font,
    //     repository.full_name
    //     // {
    //     //   // text: ,
    //     //   text: ,
    //     //   alignmentX: 0,
    //     //   alignmentY: 0,
    //     // }
    //   );
    // });
    const textWidth = Jimp.measureText(font, repository.full_name);
    const textHeight = Jimp.measureTextHeight(font, repository.full_name, 900 - 40 - 128 - 20);
    const metaImage = backgroundTemplate.clone().resize(900 - 40, 260);

    metaImage.composite(githubLogo, 450 - 128 / 2 - textWidth / 2 - 20, 130 - 128 / 2);
    // metaImage.resize(textWidth + 250, 300);
    // const metaImage = githubLogo;
    // console.log(repository.full_name);
    // console.log();
    // console.log(Jimp.measureTextHeight(font, 'pqt/social-preview', 1280));

    /**
     * Apply Title
     */
    metaImage.print(
      font,
      450 - textWidth / 2 + (128 + 20) / 2,
      130 - textHeight / 2,
      {
        text: repository.full_name,
        // alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentX: 0,
      },
      width - spacing * 2,
      height - spacing * 2
    );

    /**
     * Apply Description
     */
    // image.print(
    //   fontSm,
    //   width * 0.175,
    //   350,
    //   {
    //     text: repository.description,
    //     alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
    //   },
    //   width * 0.65,
    //   height - spacing * 2
    // );

    image.composite(metaImage, 200, 200);

    if (imageTypeParameter === 'image') {
      /**
       * Provide Response with a Unique Image
       */
      response.setHeader('Content-Type', 'image/png');
      return response.end(await image.getBufferAsync(Jimp.MIME_PNG));
    } else {
      return response.status(200).json({
        data: {
          image: await image.getBase64Async(Jimp.MIME_PNG),
        },
      });
    }

    /**
     * Dev Debug Return Object
     */
    response.status(200).json({
      data: {
        owner,
        repo,
        colorsParameter,
        imageTypeParameter,
        github: { languages, ...repository },
      },
    });
  } catch (error) {
    response.json({
      data: {
        error,
      },
    });

    // response.status(error.status).json({
    //   data: {
    //     error: errorMessages[error.status],
    //   },
    // });
  }
};

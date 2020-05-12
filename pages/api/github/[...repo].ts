import Jimp from 'jimp';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  /**
   * Repository owner and name
   */
  const [repoOwner, repoName] = request.query.repo;

  /**
   * Preferred colors to use
   */
  const colors = request.query.colors as string[];

  /**
   * Output Location
   */
  const output = path.join(path.join(process.cwd(), 'public', 'generated', 'github', repoOwner, `${repoName}.jpg`));

  /**
   * Base Image Template
   */
  const image = await Jimp.read(path.join(process.cwd(), 'public', 'generated', 'base.jpg'));

  /**
   * Font family used for writing
   */
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

  /**
   * Dimensions
   */
  const WIDTH = 1280;
  const HEIGHT = 640;

  /**
   * Spacing
   */
  const PADDING = 40;

  const generatedImage = await image
    .resize(WIDTH, HEIGHT)
    .print(font, PADDING, 140 + PADDING, repoName, WIDTH - PADDING * 2);

  generatedImage.writeAsync(output);

  response.status(200).json(output);
};

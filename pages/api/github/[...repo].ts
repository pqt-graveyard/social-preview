import Jimp from 'jimp';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  const [repoOwner, repoName] = request.query.repo;

  const output = path.join(path.join(process.cwd(), 'public', 'generated', repoOwner, `${repoName}.jpg`));

  const image = await Jimp.read(path.join(process.cwd(), 'public', 'generated', 'base.jpg'));

  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

  const WIDTH = 1280;
  const HEIGHT = 640;
  const PADDING = 40;

  const generatedImage = await image
    .resize(WIDTH, HEIGHT)
    .print(font, PADDING, 140 + PADDING, repoName, WIDTH - PADDING * 2);

  generatedImage.writeAsync(output);

  response.status(200).json(output);
};

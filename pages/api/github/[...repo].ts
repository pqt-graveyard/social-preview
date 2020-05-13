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
  // const colors = request.query.colors as string[];

  /**
   * Output Location
   */
  const output = path.join(path.join(process.cwd(), 'public', 'generated', 'github', repoOwner, `${repoName}.jpg`));

  /**
   * Image Templates
   */
  const baseImage = await Jimp.read(path.join(process.cwd(), 'public', 'generated', 'base.png'));
  const githubLogo = await Jimp.read(path.join(process.cwd(), 'public', 'generated', 'github-logo.png'));
  // const codercat = await (await Jimp.read(path.join(process.cwd(), 'public', 'generated', 'codercat.png'))).resize(
  //   300,
  //   300
  // );

  /**
   * Font family used for writing
   */
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

  /**
   * Dimensions
   */
  const WIDTH = 1280;
  const HEIGHT = 640;

  /**
   * Spacing
   */
  const PADDING = 40;

  const generatedImage = baseImage
    .resize(WIDTH, HEIGHT)
    .print(
      font,
      PADDING,
      368,
      {
        text: repoName,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      },
      WIDTH - PADDING * 2,
      HEIGHT - PADDING * 2
    )
    .composite(githubLogo, 576, 190);

  generatedImage.writeAsync(output);

  response.status(200).json({ data: await generatedImage.getBase64Async(Jimp.MIME_PNG) });
};

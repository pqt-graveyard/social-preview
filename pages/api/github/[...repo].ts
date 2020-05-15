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
   * GitHub Repository API Response
   */
  const repo = await (await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`)).json();

  /**
   * Description, remove GitHub-enabled emojis and actual emojis, the follow up with removing unnecessary whitespace
   */
  const description = repo.description
    .replace(new RegExp(/:.+:/, 'gi'), '')
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    )
    .trim();

  /**
   * Image Templates
   */
  const baseImage = await Jimp.read(path.join(process.cwd(), 'static/github/base.png'));
  const githubLogo = await Jimp.read(path.join(process.cwd(), 'static/github/github-logo.png'));

  /**
   * Font family used for writing
   */
  const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
  const fontSm = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

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
      350,
      {
        text: repoName,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      },
      WIDTH - PADDING * 2,
      HEIGHT - PADDING * 2
    )
    .print(
      fontSm,
      WIDTH / 4,
      450,
      {
        text: description,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      },
      WIDTH / 2,
      HEIGHT - PADDING * 2
    )
    .composite(githubLogo, 576, 190);

  response.status(200).json({
    data: {
      description,
      repo,
      image: await generatedImage.getBase64Async(Jimp.MIME_PNG),
    },
  });
};

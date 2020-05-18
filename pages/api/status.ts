import { NextApiRequest, NextApiResponse } from 'next';

export default (_: NextApiRequest, response: NextApiResponse): void => {
  response.status(200).json({ status: 'online' });
};

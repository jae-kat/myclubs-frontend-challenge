export default async function workouts(req, res) {
  if (req.method === 'GET') {
    try {
      // get the info from the api endpoint
      const response = await fetch(
        'https://s3.eu-west-1.amazonaws.com/dev-challenges.myclubs.com/frontend/frontend_challenge_activities.json',
      );
      // this will be sent to the frontend
      res.status(200).json({ body: await response.json() });
      return;
    } catch (err) {
      res.status(404).json({
        errors: [{ message: 'Failed to fetch' }],
      });
      return;
    }
  }
  // can't use anything other than a get request
  res.status(405).json({
    errors: [{ message: 'Method not supported' }],
  });
}

import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {
  const { hashtag } = req.query;

  if (!hashtag) {
    return res.status(400).json({ error: 'Hashtag parameter is required' });
  }

  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    const recentTweets = await client.v2.search(`#${hashtag} -is:retweet`, {
      'tweet.fields': ['created_at', 'author_id'],
      'user.fields': ['name', 'username', 'profile_image_url'],
      expansions: ['author_id'],
      max_results: 5
    });

    const tweets = recentTweets.data.data.map(tweet => {
      const user = recentTweets.includes.users.find(u => u.id === tweet.author_id);
      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          profile_image_url: user.profile_image_url.replace('_normal', '') // Higher res image
        }
      };
    });

    res.status(200).json({ tweets });
  } catch (error) {
    console.error('Twitter API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tweets',
      details: error.message
    });
  }
}
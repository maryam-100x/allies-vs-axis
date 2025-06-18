// src/components/TwitterFeed.jsx
import React, { useState, useEffect } from 'react';

const TwitterFeed = ({ hashtag, color }) => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        // Use a mock endpoint for development if you haven't set up the backend yet
        const apiUrl = process.env.NODE_ENV === 'development' 
          ? `https://api.example.com/tweets?hashtag=${encodeURIComponent(hashtag)}` // Replace with your actual API URL
          : `/api/tweets?hashtag=${encodeURIComponent(hashtag)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error("Response wasn't JSON");
        }
        
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setTweets(data.tweets || []);
        }
      } catch (err) {
        console.error('Error fetching tweets:', err);
        setError(`Failed to load tweets. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
    const interval = setInterval(fetchTweets, 60000);
    return () => clearInterval(interval);
  }, [hashtag]);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: color
      }}>
        Loading tweets...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#ff6666'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      height: '300px',
      overflowY: 'auto',
      padding: '15px',
      marginTop: '20px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      border: `1px solid ${color}40`
    }}>
      <h3 style={{
        color: color,
        marginBottom: '15px',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        Latest #{hashtag} Tweets
      </h3>
      
      {tweets.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#aaa' }}>
          No tweets found
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {tweets.map((tweet) => (
            <div 
              key={tweet.id} 
              style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                borderLeft: `3px solid ${color}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <img 
                  src={tweet.user.profile_image_url} 
                  alt={tweet.user.name}
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }} 
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{tweet.user.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>@{tweet.user.username}</div>
                </div>
              </div>
              <div style={{ marginBottom: '8px' }}>{tweet.text}</div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '12px',
                opacity: 0.7
              }}>
                <span>{new Date(tweet.created_at).toLocaleString()}</span>
                <a 
                  href={`https://twitter.com/${tweet.user.username}/status/${tweet.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: color }}
                >
                  View on X
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TwitterFeed;
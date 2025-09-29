import { useState, useEffect } from 'react';
import { useSubscribeDev } from '@subscribe.dev/react';

type VideoMetadata = {
  url: string;
  prompt: string;
  aspectRatio: string;
  timestamp: number;
};

type GenerationHistory = {
  videos: VideoMetadata[];
};

type ThemePreference = {
  theme: 'purple' | 'white';
};

export function RatVideoGenerator() {
  const { client, user, usage, subscribe, subscriptionStatus, signOut, useStorage } = useSubscribeDev();

  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [loading, setLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use storage for generation history - guaranteed to be available when authenticated
  const [history, setHistory, syncStatus] = useStorage!<GenerationHistory>('rat-video-history', {
    videos: []
  });

  // Use storage for theme preference - guaranteed to be available when authenticated
  const [themePreference, setThemePreference] = useStorage!<ThemePreference>('theme-preference', {
    theme: 'purple'
  });

  // Apply theme to document
  useEffect(() => {
    if (themePreference.theme === 'white') {
      document.documentElement.setAttribute('data-theme', 'white');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [themePreference.theme]);

  const toggleTheme = () => {
    setThemePreference({
      theme: themePreference.theme === 'purple' ? 'white' : 'purple'
    });
  };

  const handleGenerate = async () => {
    if (!client || !prompt.trim()) return;

    setLoading(true);
    setError(null);
    setCurrentVideo(null);

    try {
      const response = await client.run('wan-video/wan-2.2-5b-fast', {
        input: {
          prompt: `A rat ${prompt}`,
          aspect_ratio: aspectRatio
        }
      });

      const videoUrl = response.output[0] as string;
      setCurrentVideo(videoUrl);

      // Save to history
      const newVideo: VideoMetadata = {
        url: videoUrl,
        prompt: `A rat ${prompt}`,
        aspectRatio,
        timestamp: Date.now()
      };

      setHistory({
        videos: [newVideo, ...history.videos.slice(0, 9)] // Keep last 10
      });

    } catch (err: any) {
      if (err.type === 'insufficient_credits') {
        setError('Insufficient credits. Please upgrade your plan to continue generating videos.');
      } else if (err.type === 'rate_limit_exceeded') {
        const retryAfter = Math.ceil(err.retryAfter / 1000);
        setError(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
      } else {
        setError('Failed to generate video. Please try again.');
        console.error('Generation error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && prompt.trim()) {
      handleGenerate();
    }
  };

  return (
    <div className="generator-container">
      <header className="generator-header">
        <div className="header-content">
          <h1 className="app-title">🐀 AI Rat Video Generator</h1>
          <div className="user-section">
            <div className="usage-info">
              <span className="credits">
                💳 {usage?.remainingCredits ?? 0} credits
              </span>
              <span className="plan">
                {subscriptionStatus?.plan?.name ?? 'Free Plan'}
              </span>
              {syncStatus === 'syncing' && (
                <span className="sync-status">Syncing...</span>
              )}
            </div>
            <div className="user-actions">
              <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle theme">
                {themePreference.theme === 'purple' ? '☀️' : '🎨'}
              </button>
              <button onClick={subscribe!} className="manage-btn">
                Manage Plan
              </button>
              <button onClick={signOut} className="sign-out-btn">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="generator-main">
        <div className="generator-card">
          <h2>Generate Rat Video</h2>

          <div className="input-section">
            <label htmlFor="prompt">What should the rat do?</label>
            <input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., dancing in a disco, eating cheese, running through a maze"
              disabled={loading}
              className="prompt-input"
            />

            <div className="aspect-ratio-selector">
              <label>Aspect Ratio:</label>
              <div className="ratio-buttons">
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`ratio-btn ${aspectRatio === '16:9' ? 'active' : ''}`}
                  disabled={loading}
                >
                  16:9 Landscape
                </button>
                <button
                  onClick={() => setAspectRatio('1:1')}
                  className={`ratio-btn ${aspectRatio === '1:1' ? 'active' : ''}`}
                  disabled={loading}
                >
                  1:1 Square
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`ratio-btn ${aspectRatio === '9:16' ? 'active' : ''}`}
                  disabled={loading}
                >
                  9:16 Portrait
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="generate-btn"
            >
              {loading ? 'Generating Video...' : 'Generate Video'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
              {error.includes('Insufficient credits') && (
                <button onClick={subscribe!} className="upgrade-link">
                  Upgrade Now
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Generating your rat video... This may take a minute.</p>
            </div>
          )}

          {currentVideo && !loading && (
            <div className="video-result">
              <h3>Generated Video</h3>
              <video
                src={currentVideo}
                controls
                autoPlay
                loop
                className="generated-video"
              >
                Your browser does not support video playback.
              </video>
              <a href={currentVideo} download className="download-btn">
                Download Video
              </a>
            </div>
          )}
        </div>

        {history.videos.length > 0 && (
          <div className="history-section">
            <h2>Recent Generations</h2>
            <div className="history-grid">
              {history.videos.map((video, index) => (
                <div key={index} className="history-item">
                  <video
                    src={video.url}
                    className="history-video"
                    onClick={() => setCurrentVideo(video.url)}
                  >
                    Your browser does not support video playback.
                  </video>
                  <div className="history-details">
                    <p className="history-prompt">{video.prompt}</p>
                    <span className="history-meta">
                      {video.aspectRatio} • {new Date(video.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
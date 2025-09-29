interface SignInScreenProps {
  signIn: () => void;
}

export function SignInScreen({ signIn }: SignInScreenProps) {
  return (
    <div className="sign-in-screen">
      <div className="sign-in-content">
        <div className="logo-section">
          <h1 className="app-title">🐀 AI Rat Video Generator</h1>
          <p className="app-subtitle">
            Create amazing AI-generated rat videos with the power of advanced video generation models
          </p>
        </div>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">🎬</span>
            <h3>AI-Powered</h3>
            <p>Generate unique rat videos using state-of-the-art AI models</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Fast & Easy</h3>
            <p>Simple prompts turn into engaging video content in seconds</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🎨</span>
            <h3>Customizable</h3>
            <p>Control aspect ratio and style with detailed prompts</p>
          </div>
        </div>

        <button onClick={signIn} className="sign-in-button">
          Sign In to Start Creating
        </button>

        <p className="sign-in-note">
          Sign in to access AI video generation and start creating rat videos
        </p>
      </div>
    </div>
  );
}
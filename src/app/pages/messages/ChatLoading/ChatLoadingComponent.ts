import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-loading',
  template: `
    <div class="chat-loading-container">
      <div class="loading-content">
        <!-- Main spinner -->
        <div class="spinner-container">
          <div class="main-spinner"></div>
          <div class="spinner-dots">
            <div class="dot dot-1"></div>
            <div class="dot dot-2"></div>
            <div class="dot dot-3"></div>
          </div>
        </div>
        
        <!-- Loading text -->
        <div class="loading-text">
          <h4>Loading conversation...</h4>
          <p>Please wait while we prepare your chat</p>
        </div>
        
        <!-- Skeleton boxes -->
        <!-- <div class="skeleton-preview">
          <div class="skeleton-box skeleton-chat"></div>
          <div class="skeleton-box skeleton-reservation"></div>
        </div> -->
      </div>
    </div>
  `,
  styles: [`
    .chat-loading-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
      position: relative;
      overflow: hidden;
    }

    .chat-loading-container::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      /* background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%); */
      animation: rotateBackground 15s linear infinite;
    }

    @keyframes rotateBackground {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-content {
      text-align: center;
      position: relative;
      z-index: 2;
      /* background: rgba(255, 255, 255, 0.95); */
      padding: 3rem 2rem;
      border-radius: 20px;
      /* box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2); */
      backdrop-filter: blur(10px);
      max-width: 400px;
      width: 90%;
    }

    .spinner-container {
      position: relative;
      margin-bottom: 2rem;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .main-spinner {
      width: 60px;
      height: 60px;
      border: 4px solid #ff385c;
      border-top: 4px solid #e00050;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      position: relative;
      z-index: 2;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .spinner-dots {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .dot {
      position: absolute;
      width: 8px;
      height: 8px;
      background: linear-gradient(45deg, #ff385c, #e00050);
      border-radius: 50%;
      animation: orbit 2s linear infinite;
    }

    .dot-1 {
      animation-delay: 0s;
    }

    .dot-2 {
      animation-delay: 0.66s;
    }

    .dot-3 {
      animation-delay: 1.33s;
    }

    @keyframes orbit {
      0% {
        transform: rotate(0deg) translateX(40px) rotate(0deg);
      }
      100% {
        transform: rotate(360deg) translateX(40px) rotate(-360deg);
      }
    }

    .loading-text h4 {
      color: #333;
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      background: linear-gradient(45deg, #ff385c, #e00050);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .loading-text p {
      color: #666;
      font-size: 0.95rem;
      margin-bottom: 2rem;
    }

    .skeleton-preview {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .skeleton-box {
      height: 60px;
      border-radius: 8px;
      background: linear-gradient(90deg, #ff385c 25%, #e00050 50%, #ff385c 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      position: relative;
      overflow: hidden;
    }

    .skeleton-chat {
      width: 180px;
    }

    .skeleton-reservation {
      width: 120px;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    .skeleton-box::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      /* background: rgba(102, 126, 234, 0.3); */
      border-radius: 4px;
      animation: pulse 1s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.3;
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        opacity: 0.6;
        transform: translate(-50%, -50%) scale(1.1);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .loading-content {
        padding: 2rem 1.5rem;
      }
      
      .loading-text h4 {
        font-size: 1.2rem;
      }
      
      .skeleton-preview {
        flex-direction: column;
        align-items: center;
      }
      
      .skeleton-chat,
      .skeleton-reservation {
        width: 200px;
      }
    }
  `]
})
export class ChatLoadingComponent {
}
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-placeholder',
  template: `
    <div class="chat-placeholder-container">
      <div class="placeholder-content">
        <div class="placeholder-image">
          <div class="message-bubbles">
            <div class="bubble bubble-1"></div>
            <div class="bubble bubble-2"></div>
            <div class="bubble bubble-3"></div>
          </div>
          <div class="chat-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 10.5H8.51M12 10.5H12.01M15.5 10.5H15.51M21 12C21 16.418 16.97 20 12 20C10.89 20 9.84 19.81 8.87 19.46L3 21L4.54 15.13C4.19 14.16 4 13.11 4 12C4 7.582 8.03 4 12 4C16.97 4 21 7.582 21 12Z"
                stroke="#e00050"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <h3 class="placeholder-title">Welcome to Messages</h3>
        <p class="placeholder-subtitle">Your conversations will appear here</p>
      </div>
    </div>
  `,
  styles: [
    `
      .chat-placeholder-container {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
        position: relative;
        overflow: hidden;
      }

      .chat-placeholder-container::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        /* background: radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%); */
        animation: rotate 20s linear infinite;
      }

      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .placeholder-content {
        text-align: center;
        padding: 3rem;
        max-width: 400px;
        position: relative;
        z-index: 2;
        /* background: rgba(255, 255, 255, 0.9); */
        border-radius: 20px;
        /* box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); */
        backdrop-filter: blur(10px);
      }

      .placeholder-image {
        position: relative;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
      }

      .chat-icon {
        position: relative;
        z-index: 2;
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .message-bubbles {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .bubble {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(45deg, #e00050, #ff385c);
        animation: bubble 2s ease-in-out infinite;
      }

      .bubble-1 {
        width: 12px;
        height: 12px;
        top: -50px;
        left: -30px;
        animation-delay: 0s;
      }

      .bubble-2 {
        width: 8px;
        height: 8px;
        top: -20px;
        right: -50px;
        animation-delay: 0.5s;
      }

      .bubble-3 {
        width: 6px;
        height: 6px;
        bottom: -30px;
        left: -40px;
        animation-delay: 1s;
      }

      @keyframes bubble {
        0%,
        100% {
          transform: scale(1);
          opacity: 0.7;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
      }

      .placeholder-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 0.8rem;
        background: linear-gradient(45deg, #ff385c, #e00050);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .placeholder-subtitle {
        font-size: 1.1rem;
        color: #7f8c8d;
        margin: 0;
        line-height: 1.6;
        font-weight: 400;
      }

      @media (max-width: 768px) {
        .chat-placeholder-container {
          height: 60vh;
          padding: 1rem;
        }

        .placeholder-content {
          padding: 2rem 1.5rem;
        }

        .placeholder-title {
          font-size: 1.5rem;
        }

        .placeholder-subtitle {
          font-size: 1rem;
        }

        .placeholder-image {
          height: 100px;
          margin-bottom: 1.5rem;
        }
      }
    `,
  ],
})
export class ChatPlaceholderComponent { }
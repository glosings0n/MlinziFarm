# MlinziFarm 🇰🇪 🌾

**MlinziFarm** is a climate-smart agriculture platform designed to protect smallholder farmers in Kenya from the devastating impacts of seasonal flooding. By combining real-time weather data, satellite imagery analysis, and Google's Gemini AI, the platform provides localized, actionable advice to safeguard crops and livestock.

![MlinziFarm Dashboard](https://picsum.photos/seed/farming/1200/600)

## 🌟 Key Features

- **📍 Regional Risk Monitoring**: Real-time flood risk assessment for high-risk Kenyan zones including Nairobi (Mathare), Kisumu (Nyando), Tana River, Nakuru, Mombasa, and more.
- **🤖 AI-Powered Analysis**: Leverages Google Gemini to interpret complex weather patterns and simulated satellite data to provide human-readable risk statuses.
- **🗣️ Multilingual Alerts**: Critical warnings and advice delivered in both **English** and **Sheng/Swahili** to ensure no farmer is left behind.
- **🚜 Extension Advice**: Specialized guidance for:
  - **Crop Actions**: Drainage management, early harvesting, and soil protection.
  - **Livestock Safety**: Relocation strategies and disease prevention.
- **📅 Smart Planting Schedule**: A dynamic 7-day outlook that helps farmers time their planting and harvesting around predicted rainfall.
- **📊 Data Visualization**: Interactive charts showing daily precipitation (mm) and river levels (m) to help visualize upcoming threats.
- **📥 Exportable Reports**: Generate and download CSV reports of the current analysis for offline use or sharing with local cooperatives.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/) via `@google/genai`
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key (Get one at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/mlinzifarm.git
   cd mlinzifarm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📖 How It Works

MlinziFarm uses a "Grounding" approach with the Gemini API. It fetches the latest regional news and combines it with satellite descriptions and weather metrics to generate a comprehensive risk profile. The AI acts as a digital agricultural extension officer, translating technical data into practical steps for the Kenyan context.

## 🤝 Contributing

Contributions are welcome! Whether it's adding more regions, improving the AI prompts, or enhancing the UI, feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built to empower the resilient farmers of Kenya. 🇰🇪*

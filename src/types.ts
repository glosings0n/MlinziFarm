export type RiskStatus = 'CRITICAL' | 'ALERT' | 'STABLE';

export interface ExtensionAdvice {
  Crop_Actions: string;
  Livestock_Safety: string;
}

export interface MultilingualAlert {
  English: string;
  "Sheng/Swahili": string;
}

export interface FarmAnalysisResponse {
  risk_status: RiskStatus;
  impact_analysis: string;
  extension_advice: ExtensionAdvice;
  multilingual_alert: MultilingualAlert;
  planting_schedule: string;
}

export interface WeatherData {
  date: string;
  precipitation: number;
  river_level: number;
}

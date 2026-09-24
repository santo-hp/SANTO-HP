type JobMeta = {
  area: string[];        // areaOptions keys
  line: string[];        // lineOptions keys
  jobType: string[];     // jobTypeOptions keys
  hourlyMin: number;     // 時給下限（円）
  salaryTypes: string[]; // 支給区分（hourly/daily/monthly）
  employment: string[];  // 雇用形態
  period: string[];      // 勤務期間
  features: string[];    // 特徴
};

export const JOB_META: Record<number, JobMeta> = {
  1:  { area: ["koto"], line: ["jr_east"], jobType: ["assembly"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  2:  { area: ["atsugi"], line: ["odakyu"], jobType: ["forklift"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation"] },
  3:  { area: ["ota"], line: ["keikyu"], jobType: ["inspection"], hourlyMin: 1800, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  4:  { area: ["ota"], line: ["keikyu"], jobType: ["assembly","inspection"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  5:  { area: ["hadano"], line: ["odakyu"], jobType: ["press"], hourlyMin: 1300, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  6:  { area: ["ota"], line: ["keikyu"], jobType: ["press"], hourlyMin: 1300, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  7:  { area: ["atsugi"], line: ["odakyu","sagami"], jobType: ["plc"], hourlyMin: 2300, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation"] },
  8:  { area: ["atsugi"], line: ["odakyu","sagami"], jobType: ["press","assembly"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  9:  { area: ["ota"], line: ["keikyu"], jobType: ["press","assembly"], hourlyMin: 1350, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  10: { area: ["atsugi"], line: ["odakyu"], jobType: ["assembly"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience","dormitory"] },
  11: { area: ["sagamihara"], line: ["jr_east"], jobType: ["line"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  12: { area: ["sagamihara"], line: ["jr_east"], jobType: ["machine","line"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  13: { area: ["sagamihara"], line: ["jr_east"], jobType: ["machine","line"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  14: { area: ["sagamihara"], line: ["jr_east"], jobType: ["machine","line"], hourlyMin: 1600, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  15: { area: ["ayase"], line: ["sagami"], jobType: ["welding","assembly"], hourlyMin: 1400, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation","no_experience"] },
  16: { area: ["samukawa"], line: ["jr_east"], jobType: ["inspection","line"], hourlyMin: 1900, salaryTypes: ["hourly","monthly"], employment: ["dispatch"], period: ["long"], features: ["transportation"] },
};

// 現在掲載中の求人を勤務時間帯で分類する。
// 記載がない求人は日勤のみとして扱い、交替勤務には日勤帯と夜勤帯の両方を含める。
export const JOB_WORK_SCHEDULE: Record<number, string[]> = {
  10: ["day", "night"],
  11: ["day", "night"],
  16: ["day", "night"],
};


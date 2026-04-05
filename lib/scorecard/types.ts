// src/lib/scorecard/types.ts
export interface ScorecardSchool {
  id: number;

  school?: {
    name?: string;
    city?: string;
    state?: string;
    school_url?: string;
    ownership?: number;
    degrees_awarded?: {
      highest?: number;
    };
    minority_serving?: {
      historically_black?: number;
    };
  };

  latest?: {
    student?: {
      size?: number;
      share_25_older?: number;
      demographics?: {
        race_ethnicity?: {
          black?: number;
          white?: number;
          hispanic?: number;
          asian?: number;
          aian?: number;
          nhpi?: number;
          two_or_more?: number;
          non_resident_alien?: number;
          unknown?: number;
        };
      };
    };

    admissions?: {
      admission_rate?: {
        overall?: number;
      };
    };

    cost?: {
      avg_net_price?: {
        public?: number;
        private?: number;
      };
    };

    completion?: {
      completion_rate_4yr_150nt?: number;
      completion_rate_less_than_4yr_150nt?: number;
    };

    academics?: {
      program_percentage?: {
        business_marketing?: number;
        health?: number;
        computer?: number;
        engineering?: number;
        education?: number;
        biological?: number;
      };
    };
  };
}
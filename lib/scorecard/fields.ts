// src/lib/scorecard/fields.ts
export const MVP_FIELDS = [
    "id",
    "school.name",
    "school.city",
    "school.state",
    "school.school_url",
    "school.ownership",
    "school.degrees_awarded.highest",
    "school.minority_serving.historically_black",   
    "latest.student.size",
    "latest.student.share_25_older",   
    "latest.admissions.admission_rate.overall",    
    "latest.cost.avg_net_price.public",
    "latest.cost.avg_net_price.private",   
    "latest.completion.completion_rate_4yr_150nt",
    "latest.completion.completion_rate_less_than_4yr_150nt",   
    
    // race/ethnicity split (for demographics)
    "latest.student.demographics.race_ethnicity.white",
    "latest.student.demographics.race_ethnicity.black",
    "latest.student.demographics.race_ethnicity.hispanic",
    "latest.student.demographics.race_ethnicity.asian",
    "latest.student.demographics.race_ethnicity.aian",
    "latest.student.demographics.race_ethnicity.nhpi",
    "latest.student.demographics.race_ethnicity.two_or_more",
    "latest.student.demographics.race_ethnicity.non_resident_alien",
    "latest.student.demographics.race_ethnicity.unknown", 
    
    // “program mix” (fast substitute for “top degrees”)
    "latest.academics.program_percentage.business_marketing",
    "latest.academics.program_percentage.health",
    "latest.academics.program_percentage.computer",
    "latest.academics.program_percentage.engineering",
    "latest.academics.program_percentage.education",
    "latest.academics.program_percentage.biological",
] as const;
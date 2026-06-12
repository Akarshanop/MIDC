import raw from "@/data/midc.json";

export type Investor = {
  Investor_ID: string;
  Company_Name: string;
  Target_Sector: string;
  Industry_Sub_Type: string;
  District: string;
  Proposed_Investment_Cr: number;
  Proposed_Employment: number;
  MAITRI_Reg_Status: string;
  Growth_Indicator_Score: number;
  KYC_Status: string;
  Priority_Sector_Flag: string;
  Grievance_Status: string;
  Last_Activity_Date: string;
  Notes: string;
  EMD_Paid_Cr: number;
};

export type Plot = {
  Plot_ID: string;
  Industrial_Area: string;
  District: string;
  Zone_Class: string;
  Plot_Area_Acres: number;
  Allotment_Status: string;
  Sector_Reserved: string;
  GIS_Lat: number;
  GIS_Lon: number;
  Plot_Rate_Per_SqM_INR: number;
  Queue_Applicants: number;
};

export type Compliance = {
  Compliance_ID: string;
  Investor_ID: string;
  Compliance_Type: string;
  Issuing_Authority: string;
  Status: string;
  Renewal_Pending: string;
  Sector_Applicability: string;
  Expiry_Date: string;
};

export type Doc = {
  Doc_ID: string;
  Investor_ID: string;
  Plot_ID: string;
  Document_Type: string;
  Source_System: string;
  Current_Status: string;
  Queue_Position: number;
  In_Queue_Flag: string;
  Scrutiny_Officer: string;
  Remarks_by_Officer: string;
  Deficiency_Count: number;
  Submission_Date: string;
  Expected_Closure_Date: string;
  Approval_Auth: string;
};

export type Scenario = {
  Scenario_ID: string;
  Category: string;
  Sub_Category: string;
  Complexity_Level: string;
  Target_Platform: string;
  Industry: string;
  User_Query_EN: string;
  Investor_ID_Ref: string;
  Agent_Intent: string;
  Departments_Involved: string;
  AI_Resolution_Summary: string;
  Resolution_Status: string;
  SLA_Hours: number;
  Escalated_Flag: string;
  Feedback_Score: number;
};

const data = raw as unknown as {
  Investor_Entity_Profiles: Investor[];
  Land_Infrastructure_KB: Plot[];
  Regulatory_Compliance_KB: Compliance[];
  Documents_Approvals_KB: Doc[];
  AI_Query_Scenarios_210: Scenario[];
  Resolution_Mapping_Engine: any[];
};

export const investors = data.Investor_Entity_Profiles;
export const plots = data.Land_Infrastructure_KB;
export const compliances = data.Regulatory_Compliance_KB;
export const docs = data.Documents_Approvals_KB;
export const scenarios = data.AI_Query_Scenarios_210;

export const fmtCr = (n: number) =>
  n >= 1000 ? `₹${(n / 1000).toFixed(2)}K Cr` : `₹${Math.round(n)} Cr`;

export const fmtNum = (n: number) =>
  new Intl.NumberFormat("en-IN").format(Math.round(n));

// District coordinates for the map (approximate, normalized within Maharashtra bounds)
export const districtCoords: Record<string, { x: number; y: number }> = {
  Mumbai: { x: 12, y: 60 },
  Pune: { x: 24, y: 62 },
  Nashik: { x: 24, y: 38 },
  Aurangabad: { x: 42, y: 44 },
  Nagpur: { x: 82, y: 38 },
  Raigad: { x: 16, y: 64 },
  Thane: { x: 14, y: 56 },
  Satara: { x: 26, y: 72 },
  Solapur: { x: 44, y: 70 },
  Kolhapur: { x: 24, y: 82 },
  Jalgaon: { x: 42, y: 32 },
  Latur: { x: 52, y: 64 },
  Nanded: { x: 60, y: 56 },
  Amravati: { x: 70, y: 38 },
  Akola: { x: 64, y: 40 },
  Chandrapur: { x: 80, y: 54 },
  Sangli: { x: 30, y: 78 },
  Ahmednagar: { x: 32, y: 52 },
  Wardha: { x: 76, y: 44 },
  Yavatmal: { x: 72, y: 48 },
  Beed: { x: 46, y: 56 },
  Osmanabad: { x: 50, y: 68 },
  Parbhani: { x: 56, y: 52 },
  Hingoli: { x: 60, y: 48 },
  Buldhana: { x: 58, y: 38 },
  Washim: { x: 64, y: 44 },
  Gondia: { x: 88, y: 36 },
  Gadchiroli: { x: 86, y: 52 },
  Bhandara: { x: 84, y: 38 },
  Sindhudurg: { x: 16, y: 88 },
  Ratnagiri: { x: 14, y: 76 },
  Dhule: { x: 32, y: 30 },
  Nandurbar: { x: 28, y: 24 },
  Palghar: { x: 10, y: 50 },
};

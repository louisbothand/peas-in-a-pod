export type Team = {
  id: number;
  team_name: string;
  team_code: string;
  active: boolean;
  sort_order: number;
};

export type TeamMember = {
  id: number;
  full_name: string;
  email: string;
  team_id: number;
  role_name?: string;
  default_sprint_capacity_hours: number;
  active: boolean;
};

export type Account = {
  id: number;
  account_name: string;
  account_code?: string;
  active: boolean;
  sort_order?: number;
  color_tag?: string;
};

export type Sprint = {
  id: number;
  sprint_name: string;
  start_date: string;
  end_date: string;
  status: "active" | "planned" | "closed";
};

export type CapacityPlan = {
  id?: number;
  sprint_id: number;
  team_member_id: number;
  account_id: number;
  budget_hours: number;
  notes?: string;
};

export type WorkloadSnapshot = {
  id?: number;
  sprint_id: number;
  team_member_id: number;
  account_id: number;
  projects_task_count: number;
  projects_estimated_hours: number;
  desk_ticket_count: number;
  desk_estimated_hours: number;
  logged_projects_hours: number;
  logged_desk_hours: number;
};
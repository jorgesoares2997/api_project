import { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface Team {
  id: number;
  name: string;
  description: string | null;
  privacy: string;
  permission: string;
  members_count: number;
  repos_count: number;
}

export interface TeamMember {
  id: number;
  login: string;
  avatar_url: string;
  role: "admin" | "member" | "maintainer";
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  collaborators_count: number;
}

export interface RepositoryMember {
  id: number;
  login: string;
  avatar_url: string;
  role: "admin" | "maintainer" | "push" | "pull" | "triage";
}

export interface UserSettings {
  language: string;
  timezone: string;
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    teams: boolean;
    repositories: boolean;
  };
  security: {
    twoFactor: boolean;
    emailNotifications: boolean;
    loginNotifications: boolean;
  };
  apiKeys: {
    id: string;
    name: string;
    lastUsed: string;
  }[];
}

export const githubService = {
  // Teams
  async getTeams(): Promise<Team[]> {
    const { data: teams } = await octokit.teams.list({
      org: process.env.GITHUB_ORG || "",
    });

    return teams.map((team: RestEndpointMethodTypes["teams"]["list"]["response"]["data"][0]) => ({
      id: team.id,
      name: team.name,
      description: team.description,
      privacy: team.privacy || "closed",
      permission: team.permission,
      members_count: 0, // This would come from a separate API call
      repos_count: 0, // This would come from a separate API call
    }));
  },

  async getTeam(teamId: number): Promise<Team> {
    const { data: team } = await octokit.teams.getByName({
      org: process.env.GITHUB_ORG || "",
      team_slug: teamId.toString(),
    });

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      privacy: team.privacy || "closed",
      permission: team.permission,
      members_count: 0, // This would come from a separate API call
      repos_count: 0, // This would come from a separate API call
    };
  },

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    const { data: members } = await octokit.teams.listMembersInOrg({
      org: process.env.GITHUB_ORG || "",
      team_slug: teamId.toString(),
    });

    return members.map((member: RestEndpointMethodTypes["teams"]["listMembersInOrg"]["response"]["data"][0]) => ({
      id: member.id,
      login: member.login,
      avatar_url: member.avatar_url,
      role: "member", // Default role since the API doesn't provide it
    }));
  },

  async addTeamMember(teamId: number, username: string, role: "member" | "maintainer" = "member"): Promise<void> {
    await octokit.teams.addOrUpdateMembershipForUserInOrg({
      org: process.env.GITHUB_ORG || "",
      team_slug: teamId.toString(),
      username,
      role,
    });
  },

  async removeTeamMember(teamId: number, username: string): Promise<void> {
    await octokit.teams.removeMembershipForUserInOrg({
      org: process.env.GITHUB_ORG || "",
      team_slug: teamId.toString(),
      username,
    });
  },

  // Repositories
  async getTeamRepositories(teamId: number): Promise<Repository[]> {
    const { data: repos } = await octokit.teams.listReposInOrg({
      org: process.env.GITHUB_ORG || "",
      team_slug: teamId.toString(),
    });

    return repos.map((repo: RestEndpointMethodTypes["teams"]["listReposInOrg"]["response"]["data"][0]) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      private: repo.private,
      html_url: repo.html_url,
      collaborators_count: 0, // This would come from a separate API call
    }));
  },

  async getRepositoryCollaborators(repoName: string): Promise<RepositoryMember[]> {
    const { data: collaborators } = await octokit.repos.listCollaborators({
      owner: process.env.GITHUB_ORG || "",
      repo: repoName,
    });

    return collaborators.map((collaborator: RestEndpointMethodTypes["repos"]["listCollaborators"]["response"]["data"][0]) => ({
      id: collaborator.id,
      login: collaborator.login,
      avatar_url: collaborator.avatar_url,
      role: collaborator.role_name as "admin" | "maintainer" | "push" | "pull" | "triage",
    }));
  },

  async addRepositoryCollaborator(repoName: string, username: string, role: "admin" | "maintainer" | "push" | "pull" | "triage" = "push"): Promise<void> {
    await octokit.repos.addCollaborator({
      owner: process.env.GITHUB_ORG || "",
      repo: repoName,
      username,
      permission: role,
    });
  },

  async removeRepositoryCollaborator(repoName: string, username: string): Promise<void> {
    await octokit.repos.removeCollaborator({
      owner: process.env.GITHUB_ORG || "",
      repo: repoName,
      username,
    });
  },

  // User Settings
  async getUserSettings(): Promise<UserSettings> {
    await octokit.users.getAuthenticated();
    return {
      language: "pt-BR", // This would come from your app's database
      timezone: "America/Sao_Paulo", // This would come from your app's database
      theme: "system", // This would come from your app's database
      notifications: {
        email: true, // This would come from your app's database
        push: true, // This would come from your app's database
        teams: true, // This would come from your app's database
        repositories: true, // This would come from your app's database
      },
      security: {
        twoFactor: false, // This would come from your app's database
        emailNotifications: true, // This would come from your app's database
        loginNotifications: true, // This would come from your app's database
      },
      apiKeys: [], // This would come from your app's database
    };
  },

  async updateUserSettings(settings: UserSettings): Promise<void> {
    // This would update your app's database
    console.log("Updating user settings:", settings);
  },
}; 
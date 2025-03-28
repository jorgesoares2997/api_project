import { Octokit } from "@octokit/rest";

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
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
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

    const teamsWithCounts = await Promise.all(
      teams.map(async (team) => {
        const { data: members } = await octokit.teams.listMembersInOrg({
          org: process.env.GITHUB_ORG || "",
          team_slug: team.slug,
        });

        const { data: repos } = await octokit.teams.listReposInOrg({
          org: process.env.GITHUB_ORG || "",
          team_slug: team.slug,
        });

        return {
          id: team.id,
          name: team.name,
          description: team.description,
          privacy: team.privacy || "closed",
          permission: team.permission,
          members_count: members.length,
          repos_count: repos.length,
        };
      })
    );

    return teamsWithCounts;
  },

  async getTeam(teamId: number): Promise<Team> {
    const { data: team } = await octokit.teams.getByName({
      org: process.env.GITHUB_ORG || "",
      team_slug: teamId.toString(),
    });

    const { data: members } = await octokit.teams.listMembersInOrg({
      org: process.env.GITHUB_ORG || "",
      team_slug: team.slug,
    });

    const { data: repos } = await octokit.teams.listReposInOrg({
      org: process.env.GITHUB_ORG || "",
      team_slug: team.slug,
    });

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      privacy: team.privacy || "closed",
      permission: team.permission,
      members_count: members.length,
      repos_count: repos.length,
    };
  },

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    const { data: members } = await octokit.teams.listMembersInOrg({
      org: process.env.GITHUB_ORG || "",
      team_slug: teamId.toString(),
    });

    return members.map((member) => ({
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

    const reposWithDetails = await Promise.all(
      repos.map(async (repo) => {
        const { data: collaborators } = await octokit.repos.listCollaborators({
          owner: process.env.GITHUB_ORG || "",
          repo: repo.name,
        });

        return {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          private: repo.private,
          html_url: repo.html_url,
          collaborators_count: collaborators.length,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          open_issues_count: repo.open_issues_count,
          updated_at: repo.updated_at,
        };
      })
    );

    return reposWithDetails.map(repo => ({
      ...repo,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0, 
      open_issues_count: repo.open_issues_count || 0,
      updated_at: repo.updated_at || new Date().toISOString()
    }));
  },

  async getRepositoryCollaborators(repoName: string): Promise<RepositoryMember[]> {
    const { data: collaborators } = await octokit.repos.listCollaborators({
      owner: process.env.GITHUB_ORG || "",
      repo: repoName,
    });

    return collaborators.map((collaborator) => ({
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
    // Get user's email settings
    const { data: emails } = await octokit.users.listEmailsForAuthenticated();
    const primaryEmail = emails.find(email => email.primary)?.email;

    // Get user's notification settings
    const { data: notifications } = await octokit.activity.listNotificationsForAuthenticatedUser();

    return {
      language: "pt-BR", // This would come from your app's database
      timezone: "America/Sao_Paulo", // This would come from your app's database
      theme: "system", // This would come from your app's database
      notifications: {
        email: !!primaryEmail,
        push: true, // This would come from your app's database
        teams: notifications.some(n => n.reason === "team_mention"),
        repositories: notifications.some(n => n.reason === "mention"),
      },
      security: {
        twoFactor: false, // GitHub Enterprise API doesn't expose 2FA status
        emailNotifications: !!primaryEmail,
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
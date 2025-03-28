import { createAxiosInstance } from './axios';
import axios from 'axios';

export const createTeam = async (token: string, org: string, teamName: string, description?: string) => {
  try {
    console.log('Creating team with params:', { org, teamName, description });
    const api = createAxiosInstance(token);
    
    // Log the request details
    console.log('Request URL:', `/orgs/${org}/teams`);
    console.log('Request headers:', api.defaults.headers);
    
    const response = await api.post(`/orgs/${org}/teams`, {
      name: teamName,
      description,
      privacy: "closed",
      permission: "pull",
    });
    
    console.log('Team creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating team:", error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        }
      });
    }
    throw error;
  }
};

export const createRepository = async (
  token: string,
  org: string,
  repoName: string,
  description?: string,
  isPrivate: boolean = true
) => {
  try {
    console.log('Creating repository with params:', { org, repoName, description, isPrivate });
    const api = createAxiosInstance(token);
    const response = await api.post(`/orgs/${org}/repos`, {
      name: repoName,
      description,
      private: isPrivate,
      auto_init: true,
      visibility: isPrivate ? 'private' : 'public',
    });
    console.log('Repository creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating repository:", error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

export const addTeamToRepository = async (
  token: string,
  org: string,
  teamSlug: string,
  repo: string
) => {
  try {
    console.log('Adding team to repository with params:', { org, teamSlug, repo });
    const api = createAxiosInstance(token);
    const response = await api.put(`/orgs/${org}/teams/${teamSlug}/repos/${org}/${repo}`, {
      permission: "push",
    });
    console.log('Add team to repository response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding team to repository:", error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

export type TeamRole = 'member' | 'maintainer';
export type RepositoryPermission = 'pull' | 'push' | 'admin' | 'maintain' | 'triage';

export const addTeamMember = async (
  token: string,
  org: string,
  teamSlug: string,
  username: string,
  role: TeamRole = 'member'
) => {
  try {
    console.log('Adding team member with params:', { org, teamSlug, username, role });
    const api = createAxiosInstance(token);
    const response = await api.put(`/orgs/${org}/teams/${teamSlug}/memberships/${username}`, {
      role,
    });
    console.log('Add team member response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding team member:", error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

export interface TeamMember {
  login: string;
  role: TeamRole;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export const getTeamMembers = async (
  token: string,
  org: string,
  teamSlug: string
) => {
  try {
    console.log('Getting team members with params:', { org, teamSlug });
    const api = createAxiosInstance(token);
    const response = await api.get(`/orgs/${org}/teams/${teamSlug}/members`);
    console.log('Get team members response:', response.data);
    return response.data as TeamMember[];
  } catch (error) {
    console.error("Error getting team members:", error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

export const updateTeamMemberRole = async (
  token: string,
  org: string,
  teamSlug: string,
  username: string,
  role: TeamRole
) => {
  try {
    console.log('Updating team member role with params:', { org, teamSlug, username, role });
    const api = createAxiosInstance(token);
    const response = await api.patch(`/orgs/${org}/teams/${teamSlug}/memberships/${username}`, {
      role,
    });
    console.log('Update team member role response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating team member role:", error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

export const removeTeamMember = async (
  token: string,
  org: string,
  teamSlug: string,
  username: string
) => {
  try {
    console.log('Removing team member with params:', { org, teamSlug, username });
    const api = createAxiosInstance(token);
    const response = await api.delete(`/orgs/${org}/teams/${teamSlug}/memberships/${username}`);
    console.log('Remove team member response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error removing team member:", error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
};

export const updateTeamRepositoryPermission = async (
  token: string,
  org: string,
  teamSlug: string,
  repo: string,
  permission: RepositoryPermission
) => {
  try {
    console.log('Updating team repository permission with params:', { org, teamSlug, repo, permission });
    const api = createAxiosInstance(token);
    const response = await api.put(`/orgs/${org}/teams/${teamSlug}/repos/${org}/${repo}`, {
      permission,
    });
    console.log('Update team repository permission response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating team repository permission:", error);
    if (axios.isAxiosError(error)) {
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
}; 
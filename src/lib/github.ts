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
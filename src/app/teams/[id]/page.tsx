"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Team, TeamMember, Repository, githubService } from "@/services/github";

export default function TeamDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const teamId = Number(params.id);

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showAddRepoForm, setShowAddRepoForm] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [newRepoName, setNewRepoName] = useState("");

  useEffect(() => {
    async function fetchTeamData() {
      if (!session) return;

      setIsLoading(true);
      setError(null);

      try {
        const [teamData, membersData, reposData] = await Promise.all([
          githubService.getTeam(teamId),
          githubService.getTeamMembers(teamId),
          githubService.getTeamRepositories(teamId),
        ]);

        setTeam(teamData);
        setMembers(membersData);
        setRepositories(reposData);
      } catch (err) {
        setError("Failed to fetch team data. Please try again later.");
        console.error("Error fetching team data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTeamData();
  }, [session, teamId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberUsername.trim() || !team) return;

    try {
      await githubService.addTeamMember(team.id, newMemberUsername);
      const updatedMembers = await githubService.getTeamMembers(team.id);
      setMembers(updatedMembers);
      setNewMemberUsername("");
      setShowAddMemberForm(false);
    } catch (err) {
      console.error("Error adding team member:", err);
    }
  };

  const handleRemoveMember = async (username: string) => {
    if (!team) return;

    try {
      await githubService.removeTeamMember(team.id, username);
      const updatedMembers = await githubService.getTeamMembers(team.id);
      setMembers(updatedMembers);
    } catch (err) {
      console.error("Error removing team member:", err);
    }
  };

  const handleAddRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim() || !team) return;

    try {
      await githubService.addRepositoryCollaborator(newRepoName, team.name);
      const updatedRepos = await githubService.getTeamRepositories(team.id);
      setRepositories(updatedRepos);
      setNewRepoName("");
      setShowAddRepoForm(false);
    } catch (err) {
      console.error("Error adding repository:", err);
    }
  };

  const handleRemoveRepository = async (repoName: string) => {
    if (!team) return;

    try {
      await githubService.removeRepositoryCollaborator(repoName, team.name);
      const updatedRepos = await githubService.getTeamRepositories(team.id);
      setRepositories(updatedRepos);
    } catch (err) {
      console.error("Error removing repository:", err);
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in to view team details</h1>
          <p className="mt-2 text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Team not found</h1>
          <p className="mt-2 text-gray-600">The requested team could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
            <p className="mt-1 text-gray-600">{team.description || "No description"}</p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {team.members_count} members
              </span>
              <span className="flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {team.repos_count} repositories
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                {team.privacy}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Members</h3>
            <button
              onClick={() => setShowAddMemberForm(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add Member
            </button>
          </div>

          {showAddMemberForm && (
            <form onSubmit={handleAddMember} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="GitHub username"
                  value={newMemberUsername}
                  onChange={(e) => setNewMemberUsername(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMemberForm(false)}
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={member.avatar_url}
                    alt={member.login}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.login}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {member.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.login)}
                  className="text-red-600 hover:text-red-900"
                  aria-label={`Remove ${member.login} from team`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Repositories</h3>
            <button
              onClick={() => setShowAddRepoForm(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add Repository
            </button>
          </div>

          {showAddRepoForm && (
            <form onSubmit={handleAddRepository} className="mb-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Repository name"
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRepoForm(false)}
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-gray-900 hover:text-primary"
                    >
                      {repo.name}
                    </a>
                    <p className="text-xs text-gray-500">
                      {repo.description || "No description"}
                    </p>
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        {repo.forks_count}
                      </span>
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {repo.open_issues_count}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveRepository(repo.name)}
                  className="text-red-600 hover:text-red-900"
                  aria-label={`Remove ${repo.name} from team`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  UserGroupIcon,
  FolderIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
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
    if (!newMemberUsername.trim()) return;

    try {
      await githubService.addTeamMember(teamId, newMemberUsername);
      const updatedMembers = await githubService.getTeamMembers(teamId);
      setMembers(updatedMembers);
      setNewMemberUsername("");
      setShowAddMemberForm(false);
    } catch (err) {
      console.error("Error adding team member:", err);
    }
  };

  const handleRemoveMember = async (username: string) => {
    try {
      await githubService.removeTeamMember(teamId, username);
      const updatedMembers = await githubService.getTeamMembers(teamId);
      setMembers(updatedMembers);
    } catch (err) {
      console.error("Error removing team member:", err);
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
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <UserGroupIcon className="h-8 w-8 text-gray-400" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
            <p className="mt-1 text-gray-600">{team.description || "No description"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Members Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Members</h2>
            <button
              onClick={() => setShowAddMemberForm(!showAddMemberForm)}
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
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
              </div>
            </form>
          )}

          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={member.avatar_url}
                    alt={member.login}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{member.login}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.login)}
                  className="text-red-600 hover:text-red-900"
                  aria-label={`Remove ${member.login} from team`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Repositories Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Repositories</h2>
            <button
              onClick={() => setShowAddRepoForm(!showAddRepoForm)}
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Repository
            </button>
          </div>

          {showAddRepoForm && (
            <form className="mb-4">
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
              </div>
            </form>
          )}

          <div className="space-y-4">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center space-x-3">
                  <FolderIcon className="h-6 w-6 text-gray-400" />
                  <div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-900 hover:text-primary"
                    >
                      {repo.name}
                    </a>
                    <p className="text-sm text-gray-500">{repo.description || "No description"}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {repo.collaborators_count} collaborators
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
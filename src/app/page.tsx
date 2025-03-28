"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { createTeam, createRepository, addTeamToRepository, addTeamMember, TeamRole, RepositoryPermission } from "@/lib/github";
import Link from "next/link";

const Tooltip = ({ text }: { text: string }) => (
  <span className="group relative inline-block">
    <span className="cursor-help text-gray-600 hover:text-gray-900 ml-2">?</span>
    <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64">
      <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 relative">
        {text}
        <div className="absolute right-4 top-full border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  </span>
);

export default function Home() {
  const { data: session, status } = useSession();
  const [org, setOrg] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [teamMembers, setTeamMembers] = useState<Array<{ username: string; role: TeamRole }>>([]);
  const [newMemberUsername, setNewMemberUsername] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<TeamRole>('member');
  const [repoPermission, setRepoPermission] = useState<RepositoryPermission>('push');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingMember, setEditingMember] = useState<{ index: number; member: { username: string; role: TeamRole } } | null>(null);

  const handleSignIn = async () => {
    try {
      const result = await signIn("github", {
        callbackUrl: "/",
      });
      if (result?.error) {
        setError(`Erro de autenticação: ${result.error}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro durante o login");
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberUsername.trim()) {
      if (editingMember) {
        const updatedMembers = [...teamMembers];
        updatedMembers[editingMember.index] = { username: newMemberUsername.trim(), role: newMemberRole };
        setTeamMembers(updatedMembers);
        setEditingMember(null);
      } else {
        setTeamMembers([...teamMembers, { username: newMemberUsername.trim(), role: newMemberRole }]);
      }
      setNewMemberUsername("");
      setNewMemberRole('member');
    }
  };

  const handleEditMember = (index: number) => {
    const member = teamMembers[index];
    setNewMemberUsername(member.username);
    setNewMemberRole(member.role);
    setEditingMember({ index, member });
  };

  const handleCancelEdit = () => {
    setNewMemberUsername("");
    setNewMemberRole('member');
    setEditingMember(null);
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!session?.accessToken) {
        throw new Error("Não autenticado. Por favor, faça login novamente.");
      }

      console.log('Starting creation process with token:', session.accessToken.substring(0, 10) + '...');

      // Create team
      const team = await createTeam(session.accessToken, org, teamName, teamDescription);
      console.log('Team created:', team);
      
      // Add team members
      for (const member of teamMembers) {
        await addTeamMember(session.accessToken, org, team.slug, member.username, member.role);
        console.log(`Added member ${member.username} to team`);
      }
      
      // Create repository
      const repo = await createRepository(session.accessToken, org, repoName, repoDescription, isPrivate);
      console.log('Repository created:', repo);
      
      // Add team to repository with specified permission
      await addTeamToRepository(session.accessToken, org, team.slug, repo.name);
      console.log('Team added to repository');

      setSuccess("Time, membros e repositório criados com sucesso!");
      setTeamMembers([]);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      if (err instanceof Error) {
        setError(`Erro: ${err.message}`);
      } else {
        setError("Ocorreu um erro ao criar o time e o repositório. Verifique o console para mais detalhes.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Gerenciador de Times e Repositórios do GitHub</h1>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md" role="alert">
              {error}
            </div>
          )}
          <button
            onClick={handleSignIn}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
            aria-label="Entrar com GitHub"
          >
            Entrar com GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciador de Repositórios</h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/team-members"
                className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                Gerenciar Membros do Time
              </Link>
              <button
                onClick={() => signOut()}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Sair
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="org" className="block text-sm font-medium text-gray-700 mb-1">
                Organização
                <Tooltip text="Nome da organização do GitHub onde você deseja criar o time e o repositório. Você precisa ter permissões de administrador nesta organização." />
              </label>
              <input
                id="org"
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="Digite o nome da organização"
                required
              />
            </div>

            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Time
                <Tooltip text="Nome que será dado ao novo time. Este nome deve ser único dentro da organização e será usado para identificar o time em todas as operações." />
              </label>
              <input
                id="teamName"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="Digite o nome do time"
                required
              />
            </div>

            <div>
              <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Time
                <Tooltip text="Descrição opcional que explica o propósito e responsabilidades do time. Ajuda outros membros da organização a entenderem o papel deste time." />
              </label>
              <textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200 resize-none"
                rows={3}
                placeholder="Digite a descrição do time"
              />
            </div>

            <div>
              <label htmlFor="repoName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Repositório
                <Tooltip text="Nome que será dado ao novo repositório. Este nome deve ser único dentro da organização e será usado na URL do repositório." />
              </label>
              <input
                id="repoName"
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                placeholder="Digite o nome do repositório"
                required
              />
            </div>

            <div>
              <label htmlFor="repoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Repositório
                <Tooltip text="Descrição opcional que explica o propósito do repositório. Esta descrição aparecerá na página principal do repositório no GitHub." />
              </label>
              <textarea
                id="repoDescription"
                value={repoDescription}
                onChange={(e) => setRepoDescription(e.target.value)}
                className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200 resize-none"
                rows={3}
                placeholder="Digite a descrição do repositório"
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                id="isPrivate"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
              />
              <label htmlFor="isPrivate" className="flex-1 text-sm text-gray-700">
                Repositório Privado
                <Tooltip text="Se marcado, o repositório será privado e apenas membros da organização com permissão poderão acessá-lo. Se desmarcado, o repositório será público e acessível a qualquer pessoa." />
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Membros do Time</h3>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMemberUsername}
                    onChange={(e) => setNewMemberUsername(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                    placeholder="Nome de usuário do GitHub"
                  />
                </div>
                <div className="w-40">
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as TeamRole)}
                    className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                    aria-label="Função do membro"
                  >
                    <option value="member">Membro</option>
                    <option value="maintainer">Mantenedor</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="mt-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    {editingMember ? 'Atualizar' : 'Adicionar'}
                  </button>
                  {editingMember && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="mt-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>

              {teamMembers.length > 0 && (
                <div className="mt-4 space-y-2">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{member.username}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({member.role === 'maintainer' ? 'Mantenedor' : 'Membro'})
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditMember(index)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(index)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Permissões do Time no Repositório</h3>
              
              <div>
                <select
                  value={repoPermission}
                  onChange={(e) => setRepoPermission(e.target.value as RepositoryPermission)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                  aria-label="Permissão do time no repositório"
                >
                  <option value="pull">Leitura (Pull)</option>
                  <option value="push">Escrita (Push)</option>
                  <option value="admin">Administrador (Admin)</option>
                  <option value="maintain">Manutenção (Maintain)</option>
                  <option value="triage">Triagem (Triage)</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  {repoPermission === 'pull' && 'Permite apenas leitura do código e clonagem do repositório'}
                  {repoPermission === 'push' && 'Permite leitura, clonagem e push de código'}
                  {repoPermission === 'admin' && 'Permite todas as operações, incluindo gerenciamento de configurações'}
                  {repoPermission === 'maintain' && 'Permite gerenciar issues e pull requests, além de push de código'}
                  {repoPermission === 'triage' && 'Permite gerenciar issues e pull requests, mas não permite push de código'}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg" role="alert">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label={loading ? "Criando time e repositório..." : "Criar time e repositório"}
            >
              {loading ? "Criando..." : "Criar Time e Repositório"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

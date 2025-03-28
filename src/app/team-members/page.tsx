"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { getTeamMembers, updateTeamMemberRole, removeTeamMember, updateTeamRepositoryPermission, TeamMember, TeamRole, RepositoryPermission } from "@/lib/github";
import Link from "next/link";

export default function TeamMembersPage() {
  const { data: session } = useSession();
  const [org, setOrg] = useState("");
  const [teamSlug, setTeamSlug] = useState("");
  const [repo, setRepo] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingMember, setEditingMember] = useState<{ member: TeamMember; newRole: TeamRole } | null>(null);
  const [editingPermission, setEditingPermission] = useState<{ member: TeamMember; permission: RepositoryPermission } | null>(null);

  const handleLoadMembers = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!session?.accessToken) {
        throw new Error("Não autenticado. Por favor, faça login novamente.");
      }

      const teamMembers = await getTeamMembers(session.accessToken, org, teamSlug);
      setMembers(teamMembers);
      setSuccess("Membros do time carregados com sucesso!");
    } catch (err) {
      console.error('Error loading team members:', err);
      if (err instanceof Error) {
        setError(`Erro: ${err.message}`);
      } else {
        setError("Ocorreu um erro ao carregar os membros do time. Verifique o console para mais detalhes.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (member: TeamMember, newRole: TeamRole) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Não autenticado. Por favor, faça login novamente.");
      }

      await updateTeamMemberRole(session.accessToken, org, teamSlug, member.login, newRole);
      
      // Atualiza o estado local
      setMembers(members.map(m => 
        m.login === member.login ? { ...m, role: newRole } : m
      ));
      
      setSuccess(`Função de ${member.login} atualizada para ${newRole}`);
      setEditingMember(null);
    } catch (err) {
      console.error('Error updating member role:', err);
      if (err instanceof Error) {
        setError(`Erro: ${err.message}`);
      } else {
        setError("Ocorreu um erro ao atualizar a função do membro. Verifique o console para mais detalhes.");
      }
    }
  };

  const handleUpdatePermission = async (member: TeamMember, permission: RepositoryPermission) => {
    try {
      if (!session?.accessToken) {
        throw new Error("Não autenticado. Por favor, faça login novamente.");
      }

      if (!repo) {
        throw new Error("Por favor, especifique o nome do repositório.");
      }

      await updateTeamRepositoryPermission(session.accessToken, org, teamSlug, repo, permission);
      
      setSuccess(`Permissão de ${member.login} atualizada para ${permission}`);
      setEditingPermission(null);
    } catch (err) {
      console.error('Error updating member permission:', err);
      if (err instanceof Error) {
        setError(`Erro: ${err.message}`);
      } else {
        setError("Ocorreu um erro ao atualizar a permissão do membro. Verifique o console para mais detalhes.");
      }
    }
  };

  const handleRemoveMember = async (member: TeamMember) => {
    if (!confirm(`Tem certeza que deseja remover ${member.login} do time?`)) {
      return;
    }

    try {
      if (!session?.accessToken) {
        throw new Error("Não autenticado. Por favor, faça login novamente.");
      }

      await removeTeamMember(session.accessToken, org, teamSlug, member.login);
      
      // Atualiza o estado local
      setMembers(members.filter(m => m.login !== member.login));
      
      setSuccess(`${member.login} removido do time com sucesso!`);
    } catch (err) {
      console.error('Error removing team member:', err);
      if (err instanceof Error) {
        setError(`Erro: ${err.message}`);
      } else {
        setError("Ocorreu um erro ao remover o membro do time. Verifique o console para mais detalhes.");
      }
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Gerenciador de Membros do Time</h1>
          <p className="text-gray-600">Por favor, faça login para gerenciar os membros do time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciador de Membros do Time</h1>
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              Voltar para a Página Principal
            </Link>
          </div>

          <form onSubmit={handleLoadMembers} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="org" className="block text-sm font-medium text-gray-700 mb-1">
                  Organização
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
                <label htmlFor="teamSlug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug do Time
                </label>
                <input
                  id="teamSlug"
                  type="text"
                  value={teamSlug}
                  onChange={(e) => setTeamSlug(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                  placeholder="Digite o slug do time"
                  required
                />
              </div>

              <div>
                <label htmlFor="repo" className="block text-sm font-medium text-gray-700 mb-1">
                  Repositório
                </label>
                <input
                  id="repo"
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                  placeholder="Digite o nome do repositório"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Carregando..." : "Carregar Membros do Time"}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg mb-6" role="alert">
              {success}
            </div>
          )}

          {members.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Membros do Time</h2>
              <div className="grid gap-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={member.avatar_url}
                        alt={member.login}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <a
                          href={member.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          {member.login}
                        </a>
                        <p className="text-sm text-gray-500">
                          {editingMember?.member.login === member.login ? (
                            <div className="flex items-center space-x-2">
                              <select
                                value={editingMember.newRole}
                                onChange={(e) => setEditingMember({
                                  member,
                                  newRole: e.target.value as TeamRole
                                })}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                                aria-label="Selecione a função do membro"
                              >
                                <option value="member">Membro</option>
                                <option value="maintainer">Mantenedor</option>
                              </select>
                              <button
                                onClick={() => handleUpdateRole(member, editingMember.newRole)}
                                className="text-sm text-green-600 hover:text-green-800"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={() => setEditingMember(null)}
                                className="text-sm text-gray-600 hover:text-gray-800"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <span>
                              {member.role === 'maintainer' ? 'Mantenedor' : 'Membro'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {editingMember?.member.login !== member.login && (
                        <>
                          <button
                            onClick={() => setEditingMember({ member, newRole: member.role })}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                          >
                            Editar Função
                          </button>
                          <button
                            onClick={() => setEditingPermission({ member, permission: 'pull' })}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                          >
                            Editar Permissão
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            Remover
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {editingPermission && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Editar Permissão de {editingPermission.member.login}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="permission" className="block text-sm font-medium text-gray-700 mb-1">
                      Permissão no Repositório
                    </label>
                    <select
                      id="permission"
                      value={editingPermission.permission}
                      onChange={(e) => setEditingPermission({
                        ...editingPermission,
                        permission: e.target.value as RepositoryPermission
                      })}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                    >
                      <option value="pull">Leitura (Pull)</option>
                      <option value="push">Escrita (Push)</option>
                      <option value="admin">Administrador (Admin)</option>
                      <option value="maintain">Manutenção (Maintain)</option>
                      <option value="triage">Triagem (Triage)</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingPermission(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleUpdatePermission(editingPermission.member, editingPermission.permission)}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
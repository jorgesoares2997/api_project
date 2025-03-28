"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  FolderIcon,
  UserIcon,
  PlusIcon,
  TrashIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface RepositoryMember {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "admin" | "member";
  joinedAt: string;
}

interface Branch {
  id: string;
  name: string;
  isDefault: boolean;
  lastCommit: {
    message: string;
    author: string;
    date: string;
  };
}

interface ProtectionRule {
  id: string;
  branch: string;
  requiresApproval: boolean;
  requiresStatusChecks: boolean;
  requiresStrictStatusChecks: boolean;
  allowsForcePush: boolean;
}

const mockRepository = {
  id: "1",
  name: "projeto-web",
  description: "Repositório principal do projeto web",
  visibility: "private",
  createdAt: "2024-03-01T10:00:00Z",
  updatedAt: "2024-03-20T15:30:00Z",
  stars: 12,
  forks: 3,
  issues: 5,
  pullRequests: 2,
};

const mockMembers: RepositoryMember[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@exemplo.com",
    image: "https://avatars.githubusercontent.com/u/1234567",
    role: "admin",
    joinedAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@exemplo.com",
    image: "https://avatars.githubusercontent.com/u/7654321",
    role: "member",
    joinedAt: "2024-03-02T09:00:00Z",
  },
  {
    id: "3",
    name: "Pedro Oliveira",
    email: "pedro@exemplo.com",
    image: "https://avatars.githubusercontent.com/u/9876543",
    role: "member",
    joinedAt: "2024-03-03T11:00:00Z",
  },
];

const mockBranches: Branch[] = [
  {
    id: "1",
    name: "main",
    isDefault: true,
    lastCommit: {
      message: "feat: adiciona sistema de autenticação",
      author: "João Silva",
      date: "2024-03-20T15:30:00Z",
    },
  },
  {
    id: "2",
    name: "develop",
    isDefault: false,
    lastCommit: {
      message: "fix: corrige bug no formulário de login",
      author: "Maria Santos",
      date: "2024-03-19T14:20:00Z",
    },
  },
  {
    id: "3",
    name: "feature/auth",
    isDefault: false,
    lastCommit: {
      message: "feat: implementa autenticação com GitHub",
      author: "Pedro Oliveira",
      date: "2024-03-18T16:45:00Z",
    },
  },
];

const mockProtectionRules: ProtectionRule[] = [
  {
    id: "1",
    branch: "main",
    requiresApproval: true,
    requiresStatusChecks: true,
    requiresStrictStatusChecks: true,
    allowsForcePush: false,
  },
  {
    id: "2",
    branch: "develop",
    requiresApproval: true,
    requiresStatusChecks: true,
    requiresStrictStatusChecks: false,
    allowsForcePush: true,
  },
];

export default function RepositoryDetailsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [showAddBranchForm, setShowAddBranchForm] = useState(false);
  const [showAddProtectionRuleForm, setShowAddProtectionRuleForm] = useState(false);
  const [newMember, setNewMember] = useState({
    username: "",
    role: "member" as "admin" | "member",
  });
  const [newBranch, setNewBranch] = useState({
    name: "",
    isDefault: false,
  });
  const [newProtectionRule, setNewProtectionRule] = useState({
    branch: "",
    requiresApproval: true,
    requiresStatusChecks: true,
    requiresStrictStatusChecks: false,
    allowsForcePush: false,
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Detalhes do Repositório</h1>
          <p className="text-gray-600">Por favor, faça login para acessar os detalhes do repositório.</p>
        </div>
      </div>
    );
  }

  const handleAddMember = () => {
    // TODO: Implementar adição de membro
    console.log("Add member:", newMember);
    setShowAddMemberForm(false);
    setNewMember({ username: "", role: "member" });
  };

  const handleAddBranch = () => {
    // TODO: Implementar adição de branch
    console.log("Add branch:", newBranch);
    setShowAddBranchForm(false);
    setNewBranch({ name: "", isDefault: false });
  };

  const handleAddProtectionRule = () => {
    // TODO: Implementar adição de regra de proteção
    console.log("Add protection rule:", newProtectionRule);
    setShowAddProtectionRuleForm(false);
    setNewProtectionRule({
      branch: "",
      requiresApproval: true,
      requiresStatusChecks: true,
      requiresStrictStatusChecks: false,
      allowsForcePush: false,
    });
  };

  const handleUpdateMemberRole = (memberId: string, newRole: "admin" | "member") => {
    // TODO: Implementar atualização de função
    console.log("Update member role:", memberId, newRole);
  };

  const handleRemoveMember = (memberId: string) => {
    // TODO: Implementar remoção de membro
    console.log("Remove member:", memberId);
  };

  const handleUpdateProtectionRule = (
    ruleId: string,
    updates: Partial<ProtectionRule>
  ) => {
    // TODO: Implementar atualização de regra de proteção
    console.log("Update protection rule:", ruleId, updates);
  };

  const handleRemoveProtectionRule = (ruleId: string) => {
    // TODO: Implementar remoção de regra de proteção
    console.log("Remove protection rule:", ruleId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{mockRepository.name}</h1>
        <p className="mt-1 text-sm text-gray-500">{mockRepository.description}</p>
        <div className="mt-4 flex space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <FolderIcon className="h-5 w-5 mr-1" />
            {mockRepository.visibility === "private" ? "Privado" : "Público"}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CodeBracketIcon className="h-5 w-5 mr-1" />
            {mockRepository.stars} estrelas
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <UserIcon className="h-5 w-5 mr-1" />
            {mockRepository.forks} forks
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "members"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <UserIcon className="h-5 w-5 inline-block mr-2" />
            Membros
          </button>
          <button
            onClick={() => setActiveTab("branches")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "branches"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <CodeBracketIcon className="h-5 w-5 inline-block mr-2" />
            Branches
          </button>
          <button
            onClick={() => setActiveTab("protection")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "protection"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <ShieldCheckIcon className="h-5 w-5 inline-block mr-2" />
            Proteção
          </button>
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Issues Abertas</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {mockRepository.issues}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Pull Requests</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {mockRepository.pullRequests}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Estrelas</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {mockRepository.stars}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Forks</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {mockRepository.forks}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Membros do Repositório</h2>
                <button
                  onClick={() => setShowAddMemberForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Adicionar Membro
                </button>
              </div>

              {showAddMemberForm && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Adicionar Novo Membro
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Nome de Usuário
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={newMember.username}
                        onChange={(e) =>
                          setNewMember({ ...newMember, username: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Função
                      </label>
                      <select
                        id="role"
                        value={newMember.role}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            role: e.target.value as "admin" | "member",
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        aria-label="Selecionar função do membro"
                      >
                        <option value="member">Membro</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowAddMemberForm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddMember}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {mockMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={member.image}
                        alt=""
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <p className="text-xs text-gray-400">
                          Membro desde {new Date(member.joinedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleUpdateMemberRole(member.id, e.target.value as "admin" | "member")
                        }
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        aria-label="Selecionar função do membro"
                      >
                        <option value="member">Membro</option>
                        <option value="admin">Administrador</option>
                      </select>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remover membro"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "branches" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Branches</h2>
                <button
                  onClick={() => setShowAddBranchForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Nova Branch
                </button>
              </div>

              {showAddBranchForm && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Criar Nova Branch
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="branch-name" className="block text-sm font-medium text-gray-700">
                        Nome da Branch
                      </label>
                      <input
                        type="text"
                        id="branch-name"
                        value={newBranch.name}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is-default"
                        checked={newBranch.isDefault}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, isDefault: e.target.checked })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is-default" className="ml-2 block text-sm text-gray-700">
                        Definir como branch padrão
                      </label>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowAddBranchForm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddBranch}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Criar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {mockBranches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">{branch.name}</h3>
                        {branch.isDefault && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Padrão
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Último commit: {branch.lastCommit.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {branch.lastCommit.author} -{" "}
                        {new Date(branch.lastCommit.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "protection" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Regras de Proteção</h2>
                <button
                  onClick={() => setShowAddProtectionRuleForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Nova Regra
                </button>
              </div>

              {showAddProtectionRuleForm && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Adicionar Nova Regra de Proteção
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                        Branch
                      </label>
                      <select
                        id="branch"
                        value={newProtectionRule.branch}
                        onChange={(e) =>
                          setNewProtectionRule({ ...newProtectionRule, branch: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        aria-label="Selecionar branch"
                      >
                        <option value="">Selecione uma branch</option>
                        {mockBranches.map((branch) => (
                          <option key={branch.id} value={branch.name}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProtectionRule.requiresApproval}
                          onChange={(e) =>
                            setNewProtectionRule({
                              ...newProtectionRule,
                              requiresApproval: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          aria-label="Requer aprovação de pull requests"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Requer aprovação de pull requests
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProtectionRule.requiresStatusChecks}
                          onChange={(e) =>
                            setNewProtectionRule({
                              ...newProtectionRule,
                              requiresStatusChecks: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          aria-label="Requer verificações de status"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Requer verificações de status
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProtectionRule.requiresStrictStatusChecks}
                          onChange={(e) =>
                            setNewProtectionRule({
                              ...newProtectionRule,
                              requiresStrictStatusChecks: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          aria-label="Requer verificações de status estritas"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Requer verificações de status estritas
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProtectionRule.allowsForcePush}
                          onChange={(e) =>
                            setNewProtectionRule({
                              ...newProtectionRule,
                              allowsForcePush: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          aria-label="Permite force push"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Permite force push
                        </span>
                      </label>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowAddProtectionRuleForm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddProtectionRule}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {mockProtectionRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{rule.branch}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={rule.requiresApproval}
                            onChange={(e) =>
                              handleUpdateProtectionRule(rule.id, {
                                requiresApproval: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            aria-label="Requer aprovação de pull requests"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Requer aprovação de pull requests
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={rule.requiresStatusChecks}
                            onChange={(e) =>
                              handleUpdateProtectionRule(rule.id, {
                                requiresStatusChecks: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            aria-label="Requer verificações de status"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Requer verificações de status
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={rule.requiresStrictStatusChecks}
                            onChange={(e) =>
                              handleUpdateProtectionRule(rule.id, {
                                requiresStrictStatusChecks: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            aria-label="Requer verificações de status estritas"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Requer verificações de status estritas
                          </span>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={rule.allowsForcePush}
                            onChange={(e) =>
                              handleUpdateProtectionRule(rule.id, {
                                allowsForcePush: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            aria-label="Permite force push"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Permite force push
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveProtectionRule(rule.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Remover regra de proteção"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
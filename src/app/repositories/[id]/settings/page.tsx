"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Cog6ToothIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BellIcon,
  ArchiveBoxIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface RepositorySettings {
  name: string;
  description: string;
  visibility: "private" | "public";
  allowForking: boolean;
  allowIssues: boolean;
  allowProjects: boolean;
  allowWiki: boolean;
  allowDiscussions: boolean;
  allowSponsorship: boolean;
  defaultBranch: string;
  squashMerge: boolean;
  rebaseMerge: boolean;
  mergeCommit: boolean;
  autoDeleteHeadBranches: boolean;
  webhooks: {
    id: string;
    url: string;
    events: string[];
    active: boolean;
  }[];
}

const mockSettings: RepositorySettings = {
  name: "projeto-web",
  description: "Repositório principal do projeto web",
  visibility: "private",
  allowForking: true,
  allowIssues: true,
  allowProjects: true,
  allowWiki: true,
  allowDiscussions: false,
  allowSponsorship: false,
  defaultBranch: "main",
  squashMerge: true,
  rebaseMerge: true,
  mergeCommit: true,
  autoDeleteHeadBranches: true,
  webhooks: [
    {
      id: "1",
      url: "https://api.exemplo.com/webhook",
      events: ["push", "pull_request"],
      active: true,
    },
  ],
};

export default function RepositorySettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(mockSettings);
  const [showAddWebhookForm, setShowAddWebhookForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    url: "",
    events: [] as string[],
  });

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Configurações do Repositório</h1>
          <p className="text-gray-600">Por favor, faça login para acessar as configurações do repositório.</p>
        </div>
      </div>
    );
  }

  const handleUpdateSettings = (updates: Partial<RepositorySettings>) => {
    setSettings({ ...settings, ...updates });
  };

  const handleAddWebhook = () => {
    // TODO: Implementar adição de webhook
    console.log("Add webhook:", newWebhook);
    setShowAddWebhookForm(false);
    setNewWebhook({ url: "", events: [] });
  };

  const handleUpdateWebhook = (webhookId: string, updates: Partial<RepositorySettings["webhooks"][0]>) => {
    // TODO: Implementar atualização de webhook
    console.log("Update webhook:", webhookId, updates);
  };

  const handleRemoveWebhook = (webhookId: string) => {
    // TODO: Implementar remoção de webhook
    console.log("Remove webhook:", webhookId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações do Repositório</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie as configurações e preferências do repositório
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("general")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "general"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <Cog6ToothIcon className="h-5 w-5 inline-block mr-2" />
            Geral
          </button>
          <button
            onClick={() => setActiveTab("collaboration")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "collaboration"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <UserGroupIcon className="h-5 w-5 inline-block mr-2" />
            Colaboração
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "security"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <ShieldCheckIcon className="h-5 w-5 inline-block mr-2" />
            Segurança
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "notifications"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <BellIcon className="h-5 w-5 inline-block mr-2" />
            Notificações
          </button>
          <button
            onClick={() => setActiveTab("archives")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "archives"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <ArchiveBoxIcon className="h-5 w-5 inline-block mr-2" />
            Arquivos
          </button>
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Configurações Gerais</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure as opções básicas do repositório
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome do Repositório
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleUpdateSettings({ name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    value={settings.description}
                    onChange={(e) => handleUpdateSettings({ description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                    Visibilidade
                  </label>
                  <select
                    id="visibility"
                    value={settings.visibility}
                    onChange={(e) =>
                      handleUpdateSettings({
                        visibility: e.target.value as "private" | "public",
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Selecionar visibilidade do repositório"
                  >
                    <option value="private">Privado</option>
                    <option value="public">Público</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="default-branch" className="block text-sm font-medium text-gray-700">
                    Branch Padrão
                  </label>
                  <select
                    id="default-branch"
                    value={settings.defaultBranch}
                    onChange={(e) => handleUpdateSettings({ defaultBranch: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Selecionar branch padrão"
                  >
                    <option value="main">main</option>
                    <option value="develop">develop</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "collaboration" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Configurações de Colaboração</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure as opções de colaboração do repositório
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-forking"
                    checked={settings.allowForking}
                    onChange={(e) => handleUpdateSettings({ allowForking: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir forking"
                  />
                  <label htmlFor="allow-forking" className="ml-2 block text-sm text-gray-700">
                    Permitir forking
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-issues"
                    checked={settings.allowIssues}
                    onChange={(e) => handleUpdateSettings({ allowIssues: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir issues"
                  />
                  <label htmlFor="allow-issues" className="ml-2 block text-sm text-gray-700">
                    Permitir issues
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-projects"
                    checked={settings.allowProjects}
                    onChange={(e) => handleUpdateSettings({ allowProjects: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir projetos"
                  />
                  <label htmlFor="allow-projects" className="ml-2 block text-sm text-gray-700">
                    Permitir projetos
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-wiki"
                    checked={settings.allowWiki}
                    onChange={(e) => handleUpdateSettings({ allowWiki: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir wiki"
                  />
                  <label htmlFor="allow-wiki" className="ml-2 block text-sm text-gray-700">
                    Permitir wiki
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-discussions"
                    checked={settings.allowDiscussions}
                    onChange={(e) => handleUpdateSettings({ allowDiscussions: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir discussões"
                  />
                  <label htmlFor="allow-discussions" className="ml-2 block text-sm text-gray-700">
                    Permitir discussões
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-sponsorship"
                    checked={settings.allowSponsorship}
                    onChange={(e) => handleUpdateSettings({ allowSponsorship: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir patrocínio"
                  />
                  <label htmlFor="allow-sponsorship" className="ml-2 block text-sm text-gray-700">
                    Permitir patrocínio
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Configurações de Segurança</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure as opções de segurança do repositório
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="squash-merge"
                    checked={settings.squashMerge}
                    onChange={(e) => handleUpdateSettings({ squashMerge: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir squash merge"
                  />
                  <label htmlFor="squash-merge" className="ml-2 block text-sm text-gray-700">
                    Permitir squash merge
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rebase-merge"
                    checked={settings.rebaseMerge}
                    onChange={(e) => handleUpdateSettings({ rebaseMerge: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir rebase merge"
                  />
                  <label htmlFor="rebase-merge" className="ml-2 block text-sm text-gray-700">
                    Permitir rebase merge
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="merge-commit"
                    checked={settings.mergeCommit}
                    onChange={(e) => handleUpdateSettings({ mergeCommit: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir merge commit"
                  />
                  <label htmlFor="merge-commit" className="ml-2 block text-sm text-gray-700">
                    Permitir merge commit
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-delete-head-branches"
                    checked={settings.autoDeleteHeadBranches}
                    onChange={(e) =>
                      handleUpdateSettings({ autoDeleteHeadBranches: e.target.checked })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Excluir automaticamente branches de head"
                  />
                  <label htmlFor="auto-delete-head-branches" className="ml-2 block text-sm text-gray-700">
                    Excluir automaticamente branches de head
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Webhooks</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure os webhooks para notificações
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddWebhookForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Adicionar Webhook
                </button>
              </div>

              {showAddWebhookForm && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Adicionar Novo Webhook
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700">
                        URL do Webhook
                      </label>
                      <input
                        type="text"
                        id="webhook-url"
                        value={newWebhook.url}
                        onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Eventos
                      </label>
                      <div className="space-y-2">
                        {["push", "pull_request", "issues", "discussions"].map((event) => (
                          <label key={event} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newWebhook.events.includes(event)}
                              onChange={(e) => {
                                const events = e.target.checked
                                  ? [...newWebhook.events, event]
                                  : newWebhook.events.filter((e) => e !== event);
                                setNewWebhook({ ...newWebhook, events });
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              aria-label={`Incluir evento ${event}`}
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">{event}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowAddWebhookForm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleAddWebhook}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {settings.webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{webhook.url}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={webhook.active}
                          onChange={(e) =>
                            handleUpdateWebhook(webhook.id, { active: e.target.checked })
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          aria-label="Ativar webhook"
                        />
                        <span className="ml-2 text-sm text-gray-700">Ativo</span>
                      </div>
                      <button
                        onClick={() => handleRemoveWebhook(webhook.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remover webhook"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "archives" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Arquivar Repositório</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Arquivar este repositório para que ele fique somente leitura
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ArchiveBoxIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Aviso de Arquivamento
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Ao arquivar este repositório, ele se tornará somente leitura. Nenhuma
                        alteração poderá ser feita até que ele seja desarquivado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Arquivar Repositório
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
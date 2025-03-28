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

interface TeamSettings {
  name: string;
  description: string;
  privacy: "secret" | "closed" | "visible";
  allowMemberInvites: boolean;
  allowMemberRemoval: boolean;
  allowRepositoryCreation: boolean;
  allowRepositoryDeletion: boolean;
  defaultMemberRole: "admin" | "member";
  webhooks: {
    id: string;
    url: string;
    events: string[];
    active: boolean;
  }[];
}

const mockSettings: TeamSettings = {
  name: "Frontend Developers",
  description: "Equipe responsável pelo desenvolvimento frontend",
  privacy: "closed",
  allowMemberInvites: true,
  allowMemberRemoval: true,
  allowRepositoryCreation: true,
  allowRepositoryDeletion: false,
  defaultMemberRole: "member",
  webhooks: [
    {
      id: "1",
      url: "https://api.exemplo.com/webhook",
      events: ["member_added", "member_removed", "repository_added"],
      active: true,
    },
  ],
};

export default function TeamSettingsPage() {
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
          <h1 className="text-2xl font-bold mb-4">Configurações da Equipe</h1>
          <p className="text-gray-600">Por favor, faça login para acessar as configurações da equipe.</p>
        </div>
      </div>
    );
  }

  const handleUpdateSettings = (updates: Partial<TeamSettings>) => {
    setSettings({ ...settings, ...updates });
  };

  const handleAddWebhook = () => {
    // TODO: Implementar adição de webhook
    console.log("Add webhook:", newWebhook);
    setShowAddWebhookForm(false);
    setNewWebhook({ url: "", events: [] });
  };

  const handleUpdateWebhook = (webhookId: string, updates: Partial<TeamSettings["webhooks"][0]>) => {
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
        <h1 className="text-2xl font-bold text-gray-900">Configurações da Equipe</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie as configurações e preferências da equipe
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
            <UserGroupIcon className="h-5 w-5 inline-block mr-2" />
            Membros
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
                  Configure as opções básicas da equipe
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome da Equipe
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
                  <label htmlFor="privacy" className="block text-sm font-medium text-gray-700">
                    Privacidade
                  </label>
                  <select
                    id="privacy"
                    value={settings.privacy}
                    onChange={(e) =>
                      handleUpdateSettings({
                        privacy: e.target.value as "secret" | "closed" | "visible",
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Selecionar privacidade da equipe"
                  >
                    <option value="secret">Secreta</option>
                    <option value="closed">Fechada</option>
                    <option value="visible">Visível</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Configurações de Membros</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Configure as opções relacionadas aos membros da equipe
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="default-role" className="block text-sm font-medium text-gray-700">
                    Função Padrão
                  </label>
                  <select
                    id="default-role"
                    value={settings.defaultMemberRole}
                    onChange={(e) =>
                      handleUpdateSettings({
                        defaultMemberRole: e.target.value as "admin" | "member",
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Selecionar função padrão dos membros"
                  >
                    <option value="member">Membro</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-invites"
                    checked={settings.allowMemberInvites}
                    onChange={(e) => handleUpdateSettings({ allowMemberInvites: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir convites de membros"
                  />
                  <label htmlFor="allow-invites" className="ml-2 block text-sm text-gray-700">
                    Permitir convites de membros
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-removal"
                    checked={settings.allowMemberRemoval}
                    onChange={(e) => handleUpdateSettings({ allowMemberRemoval: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir remoção de membros"
                  />
                  <label htmlFor="allow-removal" className="ml-2 block text-sm text-gray-700">
                    Permitir remoção de membros
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
                  Configure as opções de segurança da equipe
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-repo-creation"
                    checked={settings.allowRepositoryCreation}
                    onChange={(e) =>
                      handleUpdateSettings({ allowRepositoryCreation: e.target.checked })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir criação de repositórios"
                  />
                  <label htmlFor="allow-repo-creation" className="ml-2 block text-sm text-gray-700">
                    Permitir criação de repositórios
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow-repo-deletion"
                    checked={settings.allowRepositoryDeletion}
                    onChange={(e) =>
                      handleUpdateSettings({ allowRepositoryDeletion: e.target.checked })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    aria-label="Permitir exclusão de repositórios"
                  />
                  <label htmlFor="allow-repo-deletion" className="ml-2 block text-sm text-gray-700">
                    Permitir exclusão de repositórios
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
                        {["member_added", "member_removed", "repository_added", "repository_removed"].map(
                          (event) => (
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
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {event.replace(/_/g, " ")}
                              </span>
                            </label>
                          )
                        )}
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
                            {event.replace(/_/g, " ")}
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
                <h2 className="text-lg font-medium text-gray-900">Arquivar Equipe</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Arquivar esta equipe para que ela fique somente leitura
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
                        Ao arquivar esta equipe, ela se tornará somente leitura. Nenhuma
                        alteração poderá ser feita até que ela seja desarquivada.
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
                  Arquivar Equipe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
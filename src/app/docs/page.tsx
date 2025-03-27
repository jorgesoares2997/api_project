"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Endpoint {
  name: string;
  description: string;
  method: string;
  endpoint: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  example: {
    request: string;
    response: string;
  };
}

const endpoints: Endpoint[] = [
  {
    name: "Criar Time",
    description: "Cria um novo time em uma organização do GitHub",
    method: "POST",
    endpoint: "/orgs/{org}/teams",
    parameters: [
      {
        name: "org",
        type: "string",
        required: true,
        description: "Nome da organização",
      },
      {
        name: "name",
        type: "string",
        required: true,
        description: "Nome do time",
      },
      {
        name: "description",
        type: "string",
        required: false,
        description: "Descrição do time",
      },
      {
        name: "privacy",
        type: "string",
        required: false,
        description: "Nível de privacidade do time (closed ou secret)",
      },
    ],
    example: {
      request: `{
  "name": "desenvolvedores",
  "description": "Time principal de desenvolvimento",
  "privacy": "closed"
}`,
      response: `{
  "id": 1,
  "node_id": "MDQ6VGVhbTE=",
  "url": "https://api.github.com/teams/1",
  "html_url": "https://github.com/orgs/github/teams/desenvolvedores",
  "name": "desenvolvedores",
  "slug": "desenvolvedores",
  "description": "Time principal de desenvolvimento",
  "privacy": "closed",
  "permission": "pull",
  "members_url": "https://api.github.com/teams/1/members{/member}",
  "repositories_url": "https://api.github.com/teams/1/repos",
  "parent": null
}`,
    },
  },
  {
    name: "Criar Repositório",
    description: "Cria um novo repositório em uma organização do GitHub",
    method: "POST",
    endpoint: "/orgs/{org}/repos",
    parameters: [
      {
        name: "org",
        type: "string",
        required: true,
        description: "Nome da organização",
      },
      {
        name: "name",
        type: "string",
        required: true,
        description: "Nome do repositório",
      },
      {
        name: "description",
        type: "string",
        required: false,
        description: "Descrição do repositório",
      },
      {
        name: "private",
        type: "boolean",
        required: false,
        description: "Se o repositório deve ser privado",
      },
      {
        name: "auto_init",
        type: "boolean",
        required: false,
        description: "Se o repositório deve ser inicializado com um README",
      },
    ],
    example: {
      request: `{
  "name": "nome-do-projeto",
  "description": "Descrição do projeto",
  "private": true,
  "auto_init": true
}`,
      response: `{
  "id": 1296269,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
  "name": "nome-do-projeto",
  "full_name": "org/nome-do-projeto",
  "private": true,
  "owner": {
    "login": "org",
    "id": 1,
    "node_id": "MDEyOk9yZ2FuaXphdGlvbjE=",
    "avatar_url": "https://github.com/images/error/org_happy.gif",
    "gravatar_id": "",
    "url": "https://api.github.com/orgs/org",
    "html_url": "https://github.com/org",
    "followers_url": "https://api.github.com/orgs/org/followers",
    "following_url": "https://api.github.com/orgs/org/following{/other_user}",
    "gists_url": "https://api.github.com/orgs/org/gists{/gist_id}",
    "starred_url": "https://api.github.com/orgs/org/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/orgs/org/subscriptions",
    "organizations_url": "https://api.github.com/orgs/org/orgs",
    "repos_url": "https://api.github.com/orgs/org/repos",
    "events_url": "https://api.github.com/orgs/org/events{/privacy}",
    "received_events_url": "https://api.github.com/orgs/org/received_events",
    "type": "Organization",
    "site_admin": false
  },
  "html_url": "https://github.com/org/nome-do-projeto",
  "description": "Descrição do projeto",
  "fork": false,
  "url": "https://api.github.com/repos/org/nome-do-projeto",
  "created_at": "2011-01-26T19:06:43Z",
  "updated_at": "2011-01-26T19:06:43Z",
  "pushed_at": "2011-01-26T19:06:43Z",
  "git_url": "git://github.com/org/nome-do-projeto.git",
  "ssh_url": "git@github.com:org/nome-do-projeto.git",
  "clone_url": "https://github.com/org/nome-do-projeto.git",
  "svn_url": "https://svn.github.com/org/nome-do-projeto",
  "homepage": null,
  "size": 1,
  "stargazers_count": 80,
  "watchers_count": 80,
  "language": "JavaScript",
  "has_issues": true,
  "has_projects": true,
  "has_downloads": true,
  "has_wiki": true,
  "has_pages": false,
  "has_discussions": false,
  "forks_count": 9,
  "archived": false,
  "disabled": false,
  "open_issues_count": 10,
  "license": null,
  "allow_forking": true,
  "is_template": false,
  "web_commit_signoff_required": false,
  "default_branch": "main",
  "temp_clone_token": null,
  "organization": {
    "login": "org",
    "id": 1,
    "node_id": "MDEyOk9yZ2FuaXphdGlvbjE=",
    "avatar_url": "https://github.com/images/error/org_happy.gif",
    "gravatar_id": "",
    "url": "https://api.github.com/orgs/org",
    "html_url": "https://github.com/org",
    "followers_url": "https://api.github.com/orgs/org/followers",
    "following_url": "https://api.github.com/orgs/org/following{/other_user}",
    "gists_url": "https://api.github.com/orgs/org/gists{/gist_id}",
    "starred_url": "https://api.github.com/orgs/org/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/orgs/org/subscriptions",
    "organizations_url": "https://api.github.com/orgs/org/orgs",
    "repos_url": "https://api.github.com/orgs/org/repos",
    "events_url": "https://api.github.com/orgs/org/events{/privacy}",
    "received_events_url": "https://api.github.com/orgs/org/received_events",
    "type": "Organization",
    "site_admin": false
  },
  "network_count": 9,
  "subscribers_count": 42
}`,
    },
  },
  {
    name: "Adicionar Time ao Repositório",
    description: "Adiciona um time a um repositório com permissões específicas",
    method: "PUT",
    endpoint: "/orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}",
    parameters: [
      {
        name: "org",
        type: "string",
        required: true,
        description: "Nome da organização",
      },
      {
        name: "team_slug",
        type: "string",
        required: true,
        description: "Slug do time",
      },
      {
        name: "owner",
        type: "string",
        required: true,
        description: "Proprietário do repositório",
      },
      {
        name: "repo",
        type: "string",
        required: true,
        description: "Nome do repositório",
      },
      {
        name: "permission",
        type: "string",
        required: false,
        description: `Permissão a ser concedida ao time no repositório. Opções disponíveis:
- pull: Permite apenas leitura do código e clonagem do repositório
- push: Permite leitura, clonagem e push de código
- admin: Permite todas as operações, incluindo gerenciamento de configurações
- maintain: Permite gerenciar issues e pull requests, além de push de código
- triage: Permite gerenciar issues e pull requests, mas não permite push de código`,
      },
    ],
    example: {
      request: `{
  "permission": "push"
}`,
      response: `{
  "message": "Time adicionado ao repositório com sucesso"
}`,
    },
  },
  {
    name: "Níveis de Permissão",
    description: "Explicação detalhada dos níveis de permissão disponíveis no GitHub",
    method: "INFO",
    endpoint: "permissions",
    parameters: [
      {
        name: "pull",
        type: "string",
        required: false,
        description: `Permissão básica de leitura:
- Clonar o repositório
- Fazer pull do código
- Visualizar issues e pull requests
- Não permite fazer alterações no código ou configurações`,
      },
      {
        name: "push",
        type: "string",
        required: false,
        description: `Permissão de escrita:
- Todas as permissões de pull
- Fazer push de código
- Criar branches
- Não permite gerenciar configurações do repositório`,
      },
      {
        name: "admin",
        type: "string",
        required: false,
        description: `Permissão total:
- Todas as permissões de push
- Gerenciar configurações do repositório
- Adicionar/remover colaboradores
- Gerenciar permissões de outros times
- Deletar o repositório`,
      },
      {
        name: "maintain",
        type: "string",
        required: false,
        description: `Permissão de manutenção:
- Todas as permissões de push
- Gerenciar issues e pull requests
- Gerenciar labels e milestones
- Não permite gerenciar configurações do repositório`,
      },
      {
        name: "triage",
        type: "string",
        required: false,
        description: `Permissão de triagem:
- Visualizar e clonar o repositório
- Gerenciar issues e pull requests
- Gerenciar labels e milestones
- Não permite fazer push de código ou alterar configurações`,
      },
    ],
    example: {
      request: "Exemplo de uso das permissões",
      response: `{
  "pull": "Permissão básica de leitura",
  "push": "Permissão de escrita",
  "admin": "Permissão total",
  "maintain": "Permissão de manutenção",
  "triage": "Permissão de triagem"
}`,
    },
  }
];

export default function DocsPage() {
  const { data: session } = useSession();
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Documentação da API do GitHub</h1>
          <p className="text-gray-600">Por favor, faça login para visualizar a documentação.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentação da API do GitHub</h1>
            <p className="text-xl text-gray-600">
              Explore os endpoints disponíveis para gerenciar times e repositórios
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para a Página Principal
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Endpoints Disponíveis</h2>
              <nav className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.name}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 ${
                      selectedEndpoint?.name === endpoint.name
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {endpoint.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEndpoint.name}
                  </h2>
                  <p className="text-gray-600">{selectedEndpoint.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Endpoint</h3>
                  <div className="bg-gray-50 rounded-md p-4">
                    <span className="inline-block px-2 py-1 text-sm font-semibold text-white bg-indigo-600 rounded mr-2">
                      {selectedEndpoint.method}
                    </span>
                    <code className="text-gray-800">{selectedEndpoint.endpoint}</code>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Parâmetros</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Obrigatório
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedEndpoint.parameters.map((param) => (
                          <tr key={param.name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {param.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {param.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {param.required ? "Sim" : "Não"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {param.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Exemplo de Requisição</h3>
                  <pre className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                    <code className="text-sm text-gray-800">{selectedEndpoint.example.request}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Exemplo de Resposta</h3>
                  <pre className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                    <code className="text-sm text-gray-800">{selectedEndpoint.example.response}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">Selecione um endpoint da barra lateral para visualizar sua documentação</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
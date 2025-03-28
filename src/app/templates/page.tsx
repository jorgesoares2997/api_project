"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { PlusIcon, DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/outline";

interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: {
    pull: boolean;
    push: boolean;
    admin: boolean;
    maintain: boolean;
    triage: boolean;
  };
}

// Dados mockados para demonstração
const mockTemplates: PermissionTemplate[] = [
  {
    id: "1",
    name: "Desenvolvedor",
    description: "Permissões padrão para desenvolvedores",
    permissions: {
      pull: true,
      push: true,
      admin: false,
      maintain: false,
      triage: true,
    },
  },
  {
    id: "2",
    name: "Mantenedor",
    description: "Permissões para mantenedores de repositório",
    permissions: {
      pull: true,
      push: true,
      admin: false,
      maintain: true,
      triage: true,
    },
  },
  {
    id: "3",
    name: "Administrador",
    description: "Permissões completas de administração",
    permissions: {
      pull: true,
      push: true,
      admin: true,
      maintain: true,
      triage: true,
    },
  },
];

export default function TemplatesPage() {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<PermissionTemplate[]>(mockTemplates);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<PermissionTemplate, "id">>({
    name: "",
    description: "",
    permissions: {
      pull: false,
      push: false,
      admin: false,
      maintain: false,
      triage: false,
    },
  });

  const handleCreateTemplate = () => {
    const template: PermissionTemplate = {
      ...newTemplate,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTemplates([...templates, template]);
    setShowCreateForm(false);
    setNewTemplate({
      name: "",
      description: "",
      permissions: {
        pull: false,
        push: false,
        admin: false,
        maintain: false,
        triage: false,
      },
    });
  };

  const handleDuplicateTemplate = (template: PermissionTemplate) => {
    const newTemplate: PermissionTemplate = {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      name: `${template.name} (Cópia)`,
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Templates de Permissões</h1>
          <p className="text-gray-600">Por favor, faça login para gerenciar os templates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Templates de Permissões</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Novo Template
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Criar Novo Template</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissões
              </label>
              <div className="space-y-2">
                {Object.entries(newTemplate.permissions).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          permissions: {
                            ...newTemplate.permissions,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Criar Template
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div key={template.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{template.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Duplicar template"
                >
                  <DocumentDuplicateIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-gray-400 hover:text-red-500"
                  aria-label="Excluir template"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Permissões:</h4>
              <ul className="mt-2 space-y-1">
                {Object.entries(template.permissions).map(([key, value]) => (
                  <li key={key} className="flex items-center text-sm">
                    <span className={`h-2 w-2 rounded-full mr-2 ${value ? "bg-green-400" : "bg-gray-300"}`} />
                    <span className="capitalize">{key}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
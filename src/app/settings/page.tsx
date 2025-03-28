"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  BellIcon,
  ShieldCheckIcon,
  KeyIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { UserSettings, githubService } from "@/services/github";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [newApiKeyName, setNewApiKeyName] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      if (!session) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await githubService.getUserSettings();
        setSettings(data);
      } catch (err) {
        setError("Failed to fetch settings. Please try again later.");
        console.error("Error fetching settings:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, [session]);

  const handleUpdateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      const updatedSettings = { ...settings, ...updates };
      await githubService.updateUserSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  const handleAddApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiKeyName.trim() || !settings) return;

    try {
      const newKey = {
        id: Date.now().toString(),
        name: newApiKeyName,
        lastUsed: new Date().toISOString(),
      };

      const updatedSettings = {
        ...settings,
        apiKeys: [...settings.apiKeys, newKey],
      };

      await githubService.updateUserSettings(updatedSettings);
      setSettings(updatedSettings);
      setNewApiKeyName("");
    } catch (err) {
      console.error("Error adding API key:", err);
    }
  };

  const handleRemoveApiKey = async (keyId: string) => {
    if (!settings) return;

    try {
      const updatedSettings = {
        ...settings,
        apiKeys: settings.apiKeys.filter(
          (key: { id: string }) => key.id !== keyId
        ),
      };

      await githubService.updateUserSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      console.error("Error removing API key:", err);
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Please sign in to view settings
          </h1>
          <p className="mt-2 text-gray-600">
            You need to be authenticated to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
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

  if (!settings) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Settings not found
          </h1>
          <p className="mt-2 text-gray-600">Unable to load your settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "general"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "notifications"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <BellIcon className="h-5 w-5 inline-block mr-2" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "security"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ShieldCheckIcon className="h-5 w-5 inline-block mr-2" />
          Security
        </button>
        <button
          onClick={() => setActiveTab("api-keys")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "api-keys"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <KeyIcon className="h-5 w-5 inline-block mr-2" />
          API Keys
        </button>
      </div>

      <div className="mt-8">
        {activeTab === "general" && (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700"
              >
                Language
              </label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) =>
                  handleUpdateSettings({ language: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                aria-label="Select language"
              >
                <option value="en-US">English (US)</option>
                <option value="pt-BR">Portuguese (Brazil)</option>
                <option value="es-ES">Spanish (Spain)</option>
                <option value="fr-FR">French (France)</option>
                <option value="de-DE">German (Germany)</option>
                <option value="it-IT">Italian (Italy)</option>
                <option value="ja-JP">Japanese (Japan)</option>
                <option value="ko-KR">Korean (Korea)</option>
                <option value="zh-CN">Chinese (Simplified)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700"
              >
                Timezone
              </label>
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(e) =>
                  handleUpdateSettings({ timezone: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                aria-label="Select timezone"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="theme"
                className="block text-sm font-medium text-gray-700"
              >
                Theme
              </label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) =>
                  handleUpdateSettings({
                    theme: e.target.value as "light" | "dark" | "system",
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                aria-label="Select theme"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label="Toggle email notifications"
                aria-checked={settings.notifications.email ? "true" : "false"}
                onClick={() =>
                  handleUpdateSettings({
                    notifications: {
                      ...settings.notifications,
                      email: !settings.notifications.email,
                    },
                  })
                }
                className={`${
                  settings.notifications.email ? "bg-primary" : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.notifications.email
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Push Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Receive push notifications
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label="Toggle push notifications"
                aria-checked={settings.notifications.push ? "true" : "false"}
                onClick={() =>
                  handleUpdateSettings({
                    notifications: {
                      ...settings.notifications,
                      push: !settings.notifications.push,
                    },
                  })
                }
                className={`${
                  settings.notifications.push ? "bg-primary" : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.notifications.push
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Team Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Receive notifications about team activities
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label="Toggle team notifications"
                aria-checked={settings.notifications.teams ? "true" : "false"}
                onClick={() =>
                  handleUpdateSettings({
                    notifications: {
                      ...settings.notifications,
                      teams: !settings.notifications.teams,
                    },
                  })
                }
                className={`${
                  settings.notifications.teams ? "bg-primary" : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.notifications.teams
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Repository Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Receive notifications about repository activities
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label="Toggle repository notifications"
                aria-checked={settings.notifications.repositories ? "true" : "false"}
                onClick={() =>
                  handleUpdateSettings({
                    notifications: {
                      ...settings.notifications,
                      repositories: !settings.notifications.repositories,
                    },
                  })
                }
                className={`${
                  settings.notifications.repositories ? "bg-primary" : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.notifications.repositories
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label="Toggle two-factor authentication"
                aria-checked={settings.security.twoFactor ? "true" : "false"}
                onClick={() =>
                  handleUpdateSettings({
                    security: {
                      ...settings.security,
                      twoFactor: !settings.security.twoFactor,
                    },
                  })
                }
                className={`${
                  settings.security.twoFactor ? "bg-primary" : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.security.twoFactor
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Security Email Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Receive notifications about security events
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label="Toggle security email notifications"
                aria-checked={settings.security.emailNotifications ? "true" : "false"}
                onClick={() =>
                  handleUpdateSettings({
                    security: {
                      ...settings.security,
                      emailNotifications: !settings.security.emailNotifications,
                    },
                  })
                }
                className={`${
                  settings.security.emailNotifications ? "bg-primary" : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.security.emailNotifications
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Login Notifications
                </h3>
                <p className="text-sm text-gray-500">
                  Receive notifications about new logins
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-label="Toggle login notifications"
                aria-checked={settings.security.loginNotifications ? "true" : "false"}
                onClick={() =>
                  handleUpdateSettings({
                    security: {
                      ...settings.security,
                      loginNotifications: !settings.security.loginNotifications,
                    },
                  })
                }
                className={`${
                  settings.security.loginNotifications ? "bg-primary" : "bg-gray-200"
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.security.loginNotifications
                      ? "translate-x-5"
                      : "translate-x-0"
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        )}

        {activeTab === "api-keys" && (
          <div className="space-y-6">
            <form onSubmit={handleAddApiKey} className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="api-key-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  API Key Name
                </label>
                <input
                  type="text"
                  id="api-key-name"
                  value={newApiKeyName}
                  onChange={(e) => setNewApiKeyName(e.target.value)}
                  placeholder="Enter a name for your API key"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={!newApiKeyName.trim()}
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Key
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {settings.apiKeys.map(
                (key: { id: string; name: string; lastUsed: string }) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {key.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Last used: {new Date(key.lastUsed).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveApiKey(key.id)}
                      className="text-red-600 hover:text-red-900"
                      aria-label={`Remove API key ${key.name}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

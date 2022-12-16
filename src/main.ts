import { Notice, Plugin } from 'obsidian'
import { SettingTab } from './SetingTab'
import { ModalOnBoarding } from './ModalOnboarding'

interface PluginSetting {
    isFirstRun: boolean
    affectedPlugins: string[]
}

const DEFAULT_SETTINGS: PluginSetting = {
    isFirstRun: true,
    affectedPlugins: []
}

export default class DisablePluginsTemporarilyPlugin extends Plugin {
    settings: PluginSetting

    async onload() {
        await this.loadSettings()
        this.addSettingTab(new SettingTab(this.app, this))

        if (this.settings.isFirstRun) {
            this.settings.isFirstRun = false

            const modal = new ModalOnBoarding(this.app)
            modal.open()

            await this.saveSettings()
        }

        // add command
        this.addCommand({
            id: 'disable-plugins-temporarily',
            name: 'Disable plugins',
            callback: async () => {
                // @ts-ignore-next-line
                const pluginManager = this.app.plugins
                this.settings.affectedPlugins = []
                pluginManager.enabledPlugins.forEach((pluginId: string) => {
                    if (this.manifest.id == pluginId) return
                    try {
                        pluginManager.disablePlugin(pluginId)
                        this.settings.affectedPlugins.push(pluginId)
                    } catch (error) {
                        new Notice(`Error: ${error}`)
                    }
                })

                if (this.settings.affectedPlugins.length > 0) {
                    new Notice('Plugins disabled')
                }

                await this.saveSettings()
            }
        })

        // add command
        this.addCommand({
            id: 'enable-plugins-temporarily',
            name: 'Enable plugins',
            callback: async () => {
                await this.loadSettings()
                // @ts-ignore-next-line
                const pluginManager = this.app.plugins
                this.settings.affectedPlugins.forEach((pluginId: string) => {
                    try {
                        console.log(pluginId)
                        pluginManager.enablePlugin(pluginId)
                        this.settings.affectedPlugins.splice(
                            this.settings.affectedPlugins.indexOf(pluginId),
                            1
                        )
                    } catch (error) {
                        new Notice('Error: ' + error)
                    }

                })

                if (this.settings.affectedPlugins.length == 0) {
                    new Notice('All plugins are enabled')
                } else {
                    new Notice(
                        'Some plugins are not enabled. Please check your settings'
                    )
                }

                await this.saveSettings()
            }
        })
    }

    async loadSettings() {
        this.settings = await this.loadData()

        if (!this.settings) {
            this.settings = DEFAULT_SETTINGS
        }

        await this.saveSettings()
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }
}

import { App, Modal } from 'obsidian'

export class ModalOnBoarding extends Modal {
    onOpen() {
        const { contentEl } = this
        contentEl.createEl('h3', { text: 'Disable plugins temporarily' })
        contentEl.createEl('p', {
            text: 'This plugin have two commands (palette): Disable all plugins and Enable all plugins. You can use them to disable all plugins temporarily and re-enable them later.'
        })

        contentEl.createEl('a', {
            text: 'Follow me on Twitter',
            attr: {
                href: 'https://twitter.com/duocdev',
            },
        })
    }

    onClose() {
        const { contentEl } = this
        contentEl.empty()
    }
}

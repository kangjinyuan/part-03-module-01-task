class Compiler {
    constructor(vm) {
        this.vm = vm
        this.el = vm.$el
        this.compile(this.el)
    }

    compile(el) {
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                this.compileElement(node)
            }

            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    compileText(node) {
        const reg = /\{\{(.+?)\}\}/
        const value = node.textContent
        if (reg.test(value)) {
            const key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            new Watcher(this.vm, key, newValue => {
                node.textContent = newValue
            })
        }
    }

    compileElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2)
                const key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update(node, key, attrName) {
        const updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, key, this.vm[key])
    }

    textUpdater(node, key, value) {
        node.textContent = value
        new Watcher(this.vm, key, newValue => {
            node.textContent = newValue
        })
    }

    modelUpdater(node, key, value) {
        node.value = value
        new Watcher(this.vm, key, newValue => {
            node.value = newValue
        })
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }

    htmlUpdater(node, key, value) {
        node.innerHTML = value
        new Watcher(this.vm, key, newValue => {
            node.innerHTML = newValue
        })
    }

    onUpdater(node, key, value) {
        Object.keys(value).forEach(event => {
            node.addEventListener(event, value[event])
        })
        new Watcher(this.vm, key, newValue => {
            Object.keys(value).forEach(event => {
                node.removeEventListener(event, value[event])
            })
            Object.keys(newValue).forEach(event => {
                node.addEventListener(event, newValue[event])
            })
        })
    }

    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
}
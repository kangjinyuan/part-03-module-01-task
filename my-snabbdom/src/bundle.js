import { init, h } from 'snabbdom'

import classModule from 'snabbdom/modules/class'
import propsModule from 'snabbdom/modules/props'
import eventlistenersModule from 'snabbdom/modules/eventlisteners'

const patch = init([
    classModule,
    propsModule,
    eventlistenersModule
])

let vnode
let nextRank = 11
const originalData = [
    { rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.' },
    { rank: 2, title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.' },
    { rank: 3, title: 'The Godfather: Part II', desc: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.' },
    { rank: 4, title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.' },
    { rank: 5, title: 'Pulp Fiction', desc: 'The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.' },
    { rank: 6, title: 'Schindler\'s List', desc: 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.' },
    { rank: 7, title: '12 Angry Men', desc: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.' },
    { rank: 8, title: 'The Good, the Bad and the Ugly', desc: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.' },
    { rank: 9, title: 'The Lord of the Rings: The Return of the King', desc: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.' },
    { rank: 10, title: 'Fight Club', desc: 'An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...' },
]
let data = [
    originalData[0],
    originalData[1],
    originalData[2],
    originalData[3],
    originalData[4],
    originalData[5],
    originalData[6],
    originalData[7],
    originalData[8],
    originalData[9],
]

function resetSort(prop) {
    data.sort((a, b) => {
        if (a[prop] > b[prop]) {
            return 1
        }
        if (a[prop] < b[prop]) {
            return -1
        }
        return 0
    });
    render()
}

function add() {
    const obj = originalData[Math.floor(Math.random() * 10)]
    data = [{ rank: nextRank++, title: obj.title, desc: obj.desc }].concat(data)
    render()
}

function del(movie) {
    data = data.filter(obj => { return obj !== movie })
    render()
}

function renderTable() {
    return data.map(item => {
        return h('tr', [
            h('td', item.rank),
            h('td', item.title),
            h('td', item.desc),
            h('td', [
                h('button', {
                    on: {
                        click: [del, item]
                    }
                }, 'del')
            ])
        ])
    })
}

function renderView() {
    const rows = renderTable()
    return h('div#app', [
        h('h1', 'my Top 10 movies'),
        h('div.opera-container', [
            h('div.sort-container', [
                'Sort By：',
                h('button', {
                    on: {
                        click: [resetSort, 'rank']
                    }
                }, 'Rank'),
                h('button', {
                    on: {
                        click: [resetSort, 'title']
                    }
                }, 'Title'),
                h('button', {
                    on: {
                        click: [resetSort, 'desc']
                    }
                }, 'Description')
            ]),
            h('div.add-container', [
                h('button', {
                    on: {
                        click: add
                    }
                }, 'add')
            ])
        ]),
        h('table', {
            props: {
                border: 1
            }
        }, [
            h('tbody', rows)
        ])
    ])
    vnode = patch(app, vnode)
}

function render() {
    vnode = patch(vnode, renderView())
}

window.addEventListener('load', () => {
    const app = document.querySelector('#app')
    vnode = patch(app, renderView())
})
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import titleMixin from './mixins/titleMixin'
import { createI18n } from 'vue-i18n'

// tailwind css:
import './index.css'
const messages = {
    en: {
        about: {
            aboutUs: 'About Us',
            catchPhrase: 'The best way to track your Discgolf score online.',
            FAQ: {
                title: 'Frequently Asked Questions',
                q1: {
                    question: 'How does it work?',
                    answer: 'One Player starts a game, by entering the Name of each Player and the Amount of Holes for the current game.'
                },
                q2: {
                    question: 'Can I share the Scoresheet with my friends?',
                    answer: 'Sure! Other Players can join your game using the Game ID or by scanning the QR code below the Scoresheet.',
                },
                q3: {
                    question: 'How much does it cost?',
                    answer: 'Absolutely nothing! We made this tool for free for the growing International Discgolf Community.',
                }
            }
        },
        languageSwitcher: {
            explain: 'Change Language',
        },
        home: {
            newGame: 'New Game',
            activeGame: 'Active Game',
            joinGame: 'Join Game',
            catchPhrase: 'The best way to keep track of your score',
        },
        navbar: {
            home: 'Home',
            info: 'Info',
        },
        game: {
            invitePlayers: 'Invite Players',
            qrHelp: 'Scan the QR Code to join the game:',
            noGame: 'No active Game...',
        },
        lobby: {
            addPlayers: 'Add Player to Game',
            catchPhrase: 'Start a new Game?',
            gameSettings: 'Game Settings',
            holeExplainer: 'Number of Holes',
            startGame: 'Start Game',
            endGameHeader: 'To start something new, you have to let go...',
            endGameText: 'Are you sure you want to start a new Game? Starting a new Game will end the current game on your device. If you need to return to the current Game later, remember the Game-ID: ',
            endGameButtonText: 'End Game',
        }
    },
    de: {
        about: {
            aboutUs: 'Über uns',
            catchPhrase: 'Der beste Weg seinen Discgolf-Score mit Freunden zu teilen.',
            FAQ: {
                title: 'Häufig gestellte Fragen',
                q1: {
                    question: 'Wie funktioniert das?',
                    answer: 'Ein Spieler startet das Spiel indem er die Spieler hinzufügt und die Anzahl von Löchern festlegt.',
                },
                q2: {
                    question: 'Kann ich den Score mit meinen Freunden teilen?',
                    answer: 'Ja natürlich! Andere Spieler treten deinem Spiel mit der Game ID bei, oder indem der andere Spieler den QR Code unter dem Score scannt.',
                },
                q3: {
                    question: 'Wieviel kostet das ganze?',
                    answer: 'Absolut garnichts! Wir haben das Tool für die Internationale Discgolf Community erstellt und verlangen dafür keinen Cent.',
                }
            }
        },
        languageSwitcher: {
            explain: 'Sprache auswählen',
        },
        home: {
            newGame: 'Spiel starten',
            activeGame: 'Aktives Spiel',
            joinGame: 'Spiel beitreten',
            catchPhrase: 'Der beste Weg um deinen Discgolf Score zu tracken',
        },
        navbar: {
            home: 'Home',
            info: 'Info',
        },
        game: {
            invitePlayers: 'Spieler einladen',
            qrHelp: 'QR Code scannen um dem Spiel beizutreten:',
            noGame: 'Kein aktives Spiel...',
        },
        lobby: {
            addPlayers: 'Spieler dem Spiel hinzufügen',
            catchPhrase: 'Neues Spiel beginnen?',
            gameSettings: 'Einstellungen',
            holeExplainer: 'Anzahl der Löcher',
            startGame: 'Spiel starten',
            endGameHeader: 'Bevor du etwas neues beginnen kannst, musst du gehen lassen...',
            endGameText: 'Bist du dir sicher, dass du ein neues Spiel beginnen willst? Wenn du ein neues Spiel beginnst, wird das aktuelle Spiel von diesem Gerät gelöscht. Wenn du später wieder zu dem aktuellen Spiel zurückkehren möchtest, musst du dir die Game-ID merken: ',
            endGameButtonText: 'Spiel beenden',
        }
    }
}


const app = createApp(App).use(store).use(router).mixin(titleMixin)

let locale = store.state.language.currentLocale;
console.log(store.state);
console.log(locale);

// 2. Create i18n instance with options
const i18n = createI18n({
    locale: locale || 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
});

app.use(i18n);
app.mount('#app');
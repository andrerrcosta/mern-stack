const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);

class SessionService {

    store = undefined;
    SESSION_NAME = undefined;

    constructor(name) {
        this.store = new MongoDBStore({
            uri: process.env.DB,
            collection: 'sessions'
        });

        this.store.on('error', function (error) {
            console.log(error);
        });
        
        this.SESSION_NAME = name;
    }

    build(app) {
        console.log("Building Session");
        app.use(session({
            secret: process.env.JWT_SECRET,
            /**
             * RESAVE:  FORÇA A SESSÃO A SER SALVA NA SESSION-STORE MESMO SE ELA NÃO TIVER SIDO
             *          MODIFICADA DURANTE A REQUISIÇÃO.
             */
            resave: false,
            /**
             * ROLLING: FORÇA QUE UM COOKIE IDENTIFICADOR DE SESSÃO SEJA COLOCADO EM CADA RESPOSTA.
             *          (EXPIRA JUNTO COM O MAX-AGE DO COOKIE). DEFAULT = FALSE
             */
            rolling: false,
            /**
             * SAVE-UNINITIALIZED: FORÇA QUE UMA SESSÃO QUE É "UNINITIALIZED" (UMA SESSÃO QUE É NOVA
             *          MAS NÃO É MODIFICADA) SEJA SALVA NA SESSION-STORE.
             *          ESCOLHER FALSO É ÚTIL PARA IMPLEMENTAR SESSÕES DE LOGIN, REDUZINDO O ARMAZENAMENTO
             *          NO SERVIDOR E FUNCIONANDO DE ACORDO COM AS REGRAS QUE DEMANDAM PERMISSÃO ANTES DE
             *          MONTAR UM COOKIE. FALSO TAMBÉM AJUDA COM AS CONDIÇÕES DE CONCORRÊNCIA ONDE O CLIENTE
             *          EXECUTA MÚLTIPLAS REQUISIÇÕES SEM UMA SESSÃO DEFINIDA.
             */
            saveUninitialized: false,
            store: this.store,
            cookie: {
                // secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 30,
                // sameSite: true
            },
            name: this.SESSION_NAME
        }))

        return this;
    }
}

module.exports = SessionService;
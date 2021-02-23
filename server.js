const express = require("express");
const logger = require("./services/logger.service");
const bodyParser = require("body-parser");
const port = process.env.SERVER_PORT || 5000;
const DatabaseService = require("./database");
const Database = new DatabaseService();
const app = express();
const accessControl = require("./middlewares/access-control");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

/**
 * Mongoose
 */

Database.connect();

/**
 * Para que ele entenda quando eu enviar uma informação para a api em json
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(accessControl);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

/**
 * Testing index
 */

app.get("/", (req, res) => {
    logger.info("HOME");
    res.send("Hello My Friend");
});


app.listen(port, () => {
    logger.info("Server connected on ", port, "Allowing Origin");
});

/**
 *
 *
 * COOKIES
 *
 * COOKIES SÃO ASSINADOS COM HMAC E UM SEGREDO E RARAMENTE É ENCRIPTADO
 *          POIS NÃO CARREGAM DADOS SENSÍVEIS.
 *      FLAGS:
 *          HTTPONLY - não podem ser lidos por js no client
 *          SECURE - só podem ser enviados através de canais https encriptados
 *          SAMESITE - não permitem cors
 *
 *
 * FLUXO DOS TOKENS:
 * -    USUÁRIO ENVIA AS CREDENCIAIS DE AUTENTICAÇÃO (USER, PASSWORD)
 * -    O SERVER VERIFICA AS CREDENCIAIS NO DB
 * -    O SERVER GERA  UM TOKEN TEMPORÁRIO E ADICIONA OS DADOS DO USUÁRIO NELE
 * -    E ENTÃO O SERVER ENVIA O TOKEN DE VOLTA (NO BODY OU NO HEADER)
 * -    O USUÁRIO ARMAZENA ESSE TOKEN
 * -    O USUÁRIO ENVIA ESSE TOKEN EM CADA REQUEST
 * -    O SERVER VERIFICA O TOKEN E GARANTE O ACESSO
 * -    NO LOGOUT O TOKEN É REMOVIDO DO ARMAZEM DO CLIENTE
 *
 */
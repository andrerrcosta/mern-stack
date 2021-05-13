const { DashboardRoute } = require("./route/dashboard.routes");
const { UserRoute } = require("./route/user.routes");
const { SystemRoute } = require("./route/system.routes");
const accessControl = require("./middleware/access-control");
const cookieParser = require("cookie-parser");
const createServer = require("./nobble-crafts/nobble-common-demo/web/server");
const db = require("./service/database.service");
const SessionManager = require("./nobble-crafts/nobble-session-demo/nobble-session-manager");
const { Duration } = require("./nobble-crafts/nobble-common-demo/utils/date-utils");
const ApiCommunication = require("./nobble-crafts/nobble-common-demo/web/communication/api");
const { UserModel } = require("./model/user.model");
const { DevPlaygroundModel } = require("./model/devplayground.model");
const NobbleActuatorDemo = require("./nobble-crafts/nobble-actuator-demo/nobble-actuator");
const NobbleTerminal = require("./nobble-crafts/nobble-common-demo/utils/terminal.utils");
require("dotenv").config();

NobbleTerminal.clear();

NobbleActuatorDemo
    .configFor("production").env().health().metrics().done()
    .configFor("development").env().health().metrics().caches().sessions().logs().done()
    .configFor("test").env().health().metrics().caches().sessions().logs().done()
    .configFor("no-auth").env().health().metrics().caches().sessions().logs().done();

ApiCommunication
    .configFor("production").storeLogs().cacheLogs().useTerminal(false).done()
    .configFor("development").storeLogs(false).cacheLogs().useTerminal().killProcessOn("critical").done()
    .configFor("test").storeLogs(false).cacheLogs().useTerminal().done()
    .configFor("no-auth").storeLogs(false).cacheLogs().useTerminal().done();

SessionManager
    .configFor("production")
    .session().autoRefresh().onIdle(Duration.ofMillis(2, "Days")).onLogin(Duration.ofMillis(2, "DAYS"))
    .onActiveSession(Duration.ofMillis(1, "HOURS")).cache(Duration.ofMillis(2, "HOURS"))
    .and()
    .cookies().sameSite("strict").path("/").expires(Duration.ofMillis(2, "DAYS")).httpOnly(true).secure(true)
    .and()
    .authentication().route("/auth").requestParam("body").userCollection(null, "users")
    .userModel(UserModel, "email", "password")
    .and()
    .authorization().private("/user/**", "/dashboard/**", "/system/**", "/actuator/**").public("/system/public/**")
    .and()
    .useDb("mongodb")
    .done()
    .configFor("development")
    .session().autoRefresh().onIdle(Duration.ofMillis(2, "Days")).onLogin(Duration.ofMillis(2, "DAYS"))
    .onActiveSession(Duration.ofMillis(1, "HOURS")).cache(Duration.ofMillis(2, "HOURS"))
    .and()
    .cookies().sameSite("strict").path("/").expires(Duration.ofMillis(2, "DAYS")).httpOnly(false).secure(false)
    .and()
    .authentication().route("/auth/login").requestParam("body").userCollection(null, "devplaygrounds", "users")
    .userModel(DevPlaygroundModel, "email", "password")
    .and()
    .authorization().private("/user/**", "/dashboard/**", "/system/**").public("/system/public/**")
    .and()
    .useDb("mongodb")
    .done()
    .configFor("test")
    .session().autoRefresh().onIdle(Duration.ofMillis(2, "Days")).onLogin(Duration.ofMillis(2, "DAYS"))
    .onActiveSession(Duration.ofMillis(1, "HOURS")).cache(Duration.ofMillis(2, "HOURS"))
    .and()
    .cookies().sameSite("strict").path("/").expires(Duration.ofMillis(2, "DAYS")).httpOnly(false).secure(false)
    .and()
    .authentication().route("/auth/login").requestParam("body").userCollection(null, "devplaygrounds", "users")
    .userModel(DevPlaygroundModel, "email", "password")
    .and()
    .useDb("mongodb")
    .done()
    .configFor("no-auth")
    .session().autoRefresh().onIdle(Duration.ofMillis(2, "Days")).onLogin(Duration.ofMillis(2, "DAYS"))
    .onActiveSession(Duration.ofMillis(1, "HOURS")).cache(Duration.ofMillis(2, "HOURS"))
    .and()
    .cookies().sameSite("strict").path("/").expires(Duration.ofMillis(2, "DAYS")).httpOnly(false).secure(false)
    .and()
    .authentication().route("/auth/login").requestParam("body").userCollection(null, "devplaygrounds", "users")
    .userModel(DevPlaygroundModel, "email", "password")
    .and()
    .useDb("mongodb")
    .done()
    .run();

const server = createServer()
    .useJson()
    .useUrlEncoded({ extended: false })
    .addHandler(accessControl)
    .addHandler(cookieParser())
    .addHandler(SessionManager.handler)
    .addHandler(NobbleActuatorDemo.middleware)
    .addRoute("/system", SystemRoute)
    .addRoute("/dashboard", DashboardRoute)
    .addRoute("/user", UserRoute)
    .run(process.env.SERVER_PORT || 5000)
    .getServerConfig().server;

db.connect();

module.exports = {
    server: server
}
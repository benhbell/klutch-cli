import {  Argv } from "yargs"
import DebugServer from "../debugserver/DebugServer.js"
import qrcode from "qrcode-terminal"
import {internalIpV4Sync}  from "internal-ip"
import TemplateBuilder from "../templateBuilder/TemplateBuilder.js"



 const DebugCommand =  {
    command: "debug <recipeId>",
    describe: "Starts the Debug Server",

    builder: (yargs: Argv)  => yargs
        .positional("recipeId", {describe: "RecipeId to Debug", type: 'string'})
        .option("p", {alias: "port", describe: "Server Port", type: "number", default: 3000})
        .option("templatePath", {describe: "Template Path", default: "./templates"})
        .option("distPath", {describe: "Distribution Path", default: "./dist"}),

    handler: ({recipeId, port, distPath, templatePath, env}: any) => {

        new TemplateBuilder({distPath, templatePath})

        new DebugServer({port, distPath}).start()
        const serverUrlOpts = env == "sandbox" ? "&env=sandbox" : null
        qrcode.generate(`klutch://klutch/?debugRecipeId=${recipeId}&debugRecipeUrl=http://${internalIpV4Sync()}:${port}${serverUrlOpts}`, {small: true})
    } 
}

export default DebugCommand
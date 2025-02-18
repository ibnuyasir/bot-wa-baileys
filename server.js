/*
* Basic bot example ( Btw ini buat orang yah :v )
* Hari.n.tahun: Selasa / Februari / Tahun_full_ngapusi
* Jam: 19:33
*/
const {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    getContentType,
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const { msg_system } = require("./message");
const fs = require("fs");

async function start_serv() 
{
    let { 
        state,
        saveCreds
    } = await useMultiFileAuthState("session");
    let sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" }),
    });
    sock.ev.on("connection.update", function (update) {
        let { connection, qr, lastDisconnect } = update;
        if (qr) qrcode.generate(qr,
            { small: true }
        );
        if (connection === "open") console.log("Status: connected");
        if (connection === "close")
        {
            let reconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Disconnected [reconnecting]:", reconnect);
            if (reconnect)
            {
                start_serv();
            }
            else
            {
                console.log("Status: Log Out");
            }
        }
    });
    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("messages.upsert", async function (event)
    {
        if (event.type !== "notify") return;
        for (let msg of event.messages)
        {
            if (!msg.message) return;
            let jid = msg.key.remoteJid;
            let txt = Object.entries(msg.message).find(([key, value]) => typeof value === "object" && value.text)?.[1]?.text || msg.message.conversation;
            if (!txt) return;
            console.log(`Msg: ${txt}`);

            msg_system(txt, (response, a) => {
                if (!response) return;
                let msg_content = fs.existsSync(response) && response.endsWith(".mp3") ? {
                    audio: {
                        url: response
                    }
                } : { text: response };
                console.log(msg_content.audio ? `Sending audio for: ${jid}` : `Send text: ${response}`);
                msg_content.contextInfo =
                {
                    participant: jid,
                    stanzaId: msg.key.id,
                    fromMe: true,
                };
                sock.sendMessage(jid, msg_content, a);
            });
        }
    });
    return sock;
}
start_serv();
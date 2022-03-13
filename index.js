require('dotenv').config();
require('events').EventEmitter.prototype._maxListeners = 300;
const Discord = require('discord.js')
global.client = new Discord.Client({
    intents: 32767
}) 
client.login(process.env.token);
const fs = require("fs");

client.commands = new Discord.Collection();

const commandsFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));
for (const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const commandsFolder = fs.readdirSync(`./commands`);
for (const folder of commandsFolder) {
    const commandsFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(`.js`));
    for (const file of commandsFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

const eventsFolders = fs.readdirSync('./events');
for (const folder of eventsFolders) {
    const eventsFiles = fs.readdirSync(`./events/${folder}`)

    for (const file of eventsFiles) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${folder}/${file}`);
            client.on(event.name, (...args) => event.execute(...args));
        }
        else {
            const eventsFiles2 = fs.readdirSync(`./events/${folder}/${file}`)
            for (const file2 of eventsFiles2) {
                const event = require(`./events/${folder}/${file}/${file2}`);
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}

client.on(`messageCreate`, message => {
    const prefix = `!`;

    if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (!client.commands.has(command) && !client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))) return

    var comando = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))

    comando.execute(message, args);
})


//READY LOGS
client.on('ready', () => {
    client.user.setActivity('mc.makingmc.it', { type: 'PLAYING' }); 
    client.user.setStatus('online') 
    console.log("✅Online | Making Bot 2 Is On!")

    let ready = new Discord.MessageEmbed()
    .setTitle("STATUS BOT")
    .setColor("GREEN")
    .setDescription("✅ | Il bot è andato online correttamente!")
    .addField("Status:", "🟢Online")
    .setTimestamp()
    client.channels.cache.get("937132917145092117").send({ embeds: [ready] })
        })

//TICKET SYSTEM
client.on("messageCreate", message => {
    if (message.content == "t!setpanel") {
        message.delete()
        var panel = new Discord.MessageEmbed()
        .setTitle("📩 | TICKET | 📩")
        .setColor("BLUE")
        .setDescription("🖐Ciao**!** Hai bisogno di ❓supporto, per parlare con lo 👮‍♂️**Staff**? \n\n✌Bene allora apri un 📩**ticket**. \n\n❗Spingi il bottone qui sotto👇")
        .setImage("https://i.imgur.com/zYhfzF1.png")
        .setFooter({text: "Quando aprirai il ticket ti verrano date delle regole e delle informazioni che dovrai seguire, se non le seguirai lo Staff prendere dei provvedimenti! Grazie Staff."})
        .setTimestamp()

        let buttonSupport = new Discord.MessageButton()
        .setLabel("Assistenza")
        .setEmoji("❗")
        .setStyle("DANGER")
        .setCustomId("supporto")
        let buttonReport = new Discord.MessageButton()
        .setLabel("Segnalazione")
        .setEmoji("💢")
        .setStyle("PRIMARY")
        .setCustomId("report")
        let buttonCandidature = new Discord.MessageButton()
        .setLabel("Candidature")
        .setEmoji("📝")
        .setStyle("SUCCESS")
        .setCustomId("candidature")
        let buttonCompra = new Discord.MessageButton()
        .setLabel("Shop")
        .setEmoji("💸")
        .setStyle("DANGER")
        .setCustomId("compra")
        let buttonPartner = new Discord.MessageButton()
        .setLabel("Partner")
        .setEmoji("🤝")
        .setStyle("SECONDARY")
        .setCustomId("partner")

        let buttonrow = new Discord.MessageActionRow()
            .addComponents(buttonSupport, buttonCandidature, buttonCompra, buttonPartner, buttonReport)

        message.channel.send({embeds: [panel], components: [buttonrow] });
    }
client.on("interactionCreate", interaction => {
    if (interaction.customId == "supporto") {
        interaction.deferUpdate()
        
        var giaopen = new Discord.MessageEmbed()
        .setTitle("❌ | ERROR | ❌")
        .setColor("DARK_RED")
        .setDescription("Hai gia un ticket aperto. 1/1")
        .setFooter({text: "Puoi aprire un ticket alla volta!"})
        if (interaction.guild.channels.cache.find(ticket => ticket.topic == `User ID: ${interaction.user.id}`)) {
            interaction.user.send({embeds: [giaopen]}).catch(() => { })
            return
        }
        interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
            type: "text",
            topic: `User ID: ${interaction.user.id}`,
            parent: "939873766022983680", //Settare la categoria,
            permissionOverwrites: [ 
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL"]
                },
                { //id ruolo staff
                    id: "864645597297115169",
                    allow: ["VIEW_CHANNEL"]
                }
            ]
        }).then(ticket => {
  
          var ticketaperto = new Discord.MessageEmbed()
        .setTitle("TICKET")
        .setDescription(`✨Grazie per aver aperto un ticket! \n\n ⏰Aspetti lo Staff! \n\n\n 📝Intanto scriva cosa desidereresti.`)
        .setThumbnail("https://i.imgur.com/DRWb08r.png")
        .setColor("YELLOW") 
        .setImage("https://i.imgur.com/RfXTzUI.png")
        .setFooter("Grazie per aver aperto un ticket.")

        let close = new Discord.MessageButton()
        .setLabel("CLOSE") //ATTENZIONE: QUESTO FIELD è OBBLIGATORIO
        .setEmoji("⛔") //ATTENZIONE: QUESTO FIELD è FACOLTATIVO
        .setStyle("DANGER") //ATTENZIONE: QUESTO FIELD è OBBLIGATORIO, SERVE PER SETTARE IL COLORE O SE METTERE UN BOTTONE URL
        .setCustomId("chiudiTicket"); //ATTENZIONE: QUESTO FIELD è OBBLIGATORIO INDICA L'ID DA USARE NELL'EVENTO "interactionCreate
      
        let buttonClose = new Discord.MessageActionRow()
        .addComponents(close)

      ticket.send({ embeds: [ticketaperto], components: [buttonClose] })
          })
    

client.on("messageCreate", message => {
    if (message.content == "t!close") {
        var topic = message.channel.topic;
        var ercmdc1 = new Discord.MessageEmbed()
        .setTitle("❌ | ERROR | ❌")
        .setColor("DARK_RED")
        .setDescription(`${message.author.toString()} non puoi utilizzare questo comando qui!`)
        if (!topic) {
            message.channel.send({ embeds: [ercmdc1]});
            return
        }
        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.permissions.has("MANAGE_CHANNELS")) {
                message.channel.delete();
            }
        }
        else {
            var erpermc1 = new Discord.MessageEmbed()
        .setTitle("❌ | ERROR | ❌")
        .setColor("DARK_RED")
        .setDescription(`${message.author.toString()} non hai il permesso!`)
            message.channel.send({ embeds: [erpermc1]});
        }
    }
    if (message.content.startsWith("t!add")) {
        var topic = message.channel.topic;
        var ercmda1 = new Discord.MessageEmbed()
        .setTitle("❌ | ERROR | ❌")
        .setColor("DARK_RED")
        .setDescription(`${message.author.toString()} non puoi utilizzare questo comando qui!`)
        if (!topic) {
            message.channel.send({ embeds: [ercmda1]});
            return
        }
        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.permissions.has("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                var erusera1 = new Discord.MessageEmbed()
                .setTitle("❌ | ERROR | ❌")
                .setColor("DARK_RED")
                .setDescription(`${message.author.toString()} inserisci un utente valido!`)
                if (!utente) {
                    message.channel.send({ embeds: [erusera1]});
                    return
                }
                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)
                var eraccesa1 = new Discord.MessageEmbed()
                .setTitle("❌ | ERROR | ❌")
                .setColor("DARK_RED")
                .setDescription(`${message.author.toString()} questo utente ha gia accesso al ticket!`)
                if (haIlPermesso) {
                    message.channel.send({ embeds: [eraccesa1]});
                    return
                }
                message.channel.permissionOverwrites.edit(utente, {
                    VIEW_CHANNEL: true
                })
                var suaccesa1 = new Discord.MessageEmbed()
                .setTitle("✅ | CORRECT | ✅")
                .setColor("GREEN")
                .setDescription(`${message.author.toString()} l'utente ${utente.toString()} è stato aggiunto al ticket!`)
                message.channel.send({ embeds: [suaccesa1]});
            }
        }
        else {
            var eraccesa2 = new Discord.MessageEmbed()
                .setTitle("❌ | ERROR | ❌")
                .setColor("DARK_RED")
                .setDescription(`${message.author.toString()} non puoi utilizzare questo comando qui!`)
            message.channel.send({ embeds: [eraccesa2]});
        }
    }
    if (message.content.startsWith("t!remove")) {
        var topic = message.channel.topic;
        var ercmdr1 = new Discord.MessageEmbed()
        .setTitle("❌ | ERROR | ❌")
        .setColor("DARK_RED")
        .setDescription(`${message.author.toString()} non puoi utilizzare questo comando qui!`)
        if (!topic) {
            message.channel.send({ embeds: [ercmdr1]});
            return
        }
        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.permissions.has("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                var ercmdr2 = new Discord.MessageEmbed()
                .setTitle("❌ | ERROR | ❌")
                .setColor("DARK_RED")
                .setDescription(`${message.author.toString()} iserisci un utente valido!`)
                if (!utente) {
                    message.channel.send({ embeds: [ercmdr2]});
                    return
                }
                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)
                var eraccesr2 = new Discord.MessageEmbed()
                .setTitle("❌ | ERROR | ❌")
                .setColor("DARK_RED")
                .setDescription(`${message.author.toString()} questo utente non ha accesso al ticket!`)
                if (!haIlPermesso) {
                    message.channel.send({ embeds: [eraccesr2]});
                    return
                }
                if (utente.permissions.has("MANAGE_CHANNELS")) {
                    var erremor1 = new Discord.MessageEmbed()
                    .setTitle("❌ | ERROR | ❌")
                    .setColor("DARK_RED")
                    .setDescription(`${message.author.toString()} non puoi rimuovere queto utente dal ticket!`)
                    message.channel.send({ embeds: [erremor1]});
                    return
                }
                message.channel.permissionOverwrites.edit(utente, {
                    VIEW_CHANNEL: false
                })
                var suremor1 = new Discord.MessageEmbed()
                .setTitle("✅ | CORRECT | ✅")
                .setColor("DARK_RED")
                .setDescription(`${message.author.toString()} ha tolto ${utente.toString()} dal ticket!`)
                message.channel.send({ embeds: [suremor1]});
            }
        }
        else {
            var ercorrr1 = new Discord.MessageEmbed()
                .setTitle("❌ | ERROR | ❌")
                .setColor("DARK_RED")
                .setDescription(`${message.author.toString()} non puoi utilizzare questo comando qui!`)
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
  })


  client.on("messageCreate", message => {
    let verifica = new Discord.MessageButton()
    .setStyle("SUCCESS")
    .setLabel('Verifica')
    .setCustomId('verifica')
    
    var verificarow = new Discord.MessageActionRow()
    .addComponents(verifica)
    
        if (message.content == "!verify") {
            const verifica = new Discord.MessageEmbed()
                .setTitle("✅ | VERIFICA | ✅")
                .setColor("GREEN")
                .setDescription(`Spingi il bottone per verificarti!`)
                .setFooter({text: 'Potrai vedere le stanze se ti verifichi!'})
                .setTimestamp()
        
                message.channel.send({ embeds: [verifica], components: [verificarow] })
        }
        })
    client.on("interactionCreate", async interaction => {
        if (interaction.customId == "verifica") {
            interaction.member.roles.add("864645597286105107")
            //interaction.member.roles.remove("idRuoloNonVerificato")
            interaction.reply({ 
                content: `<@${interaction.user.id}> **Sei stato verificato correttamente!**`,
                ephemeral: true 
                })
            }
    })}})})

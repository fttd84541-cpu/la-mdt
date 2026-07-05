const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

const { citizens, registeredWeapons } = require('./databases'); 
// uprav si podle svého storage systému

// =========================
// HLAVNÍ MDT PANEL
// =========================
function createMDTMainPanel() {
    const embed = new EmbedBuilder()
        .setTitle('🛰 MDT - MOBILE DATA TERMINAL')
        .setDescription(
            `📁 **Vyhledávání databází**\n` +
            `👤 Občané\n` +
            `🔫 Registrované zbraně\n` +
            `📜 Zákoník Kalifornie\n` +
            `👮 Role / jednotky (LAPD, LASD, FBI, DHS)\n`
        )
        .setColor('#1e90ff');

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('mdt_search_citizen')
            .setLabel('👤 Občan')
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId('mdt_search_weapon')
            .setLabel('🔫 Zbraň')
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId('mdt_lawbook')
            .setLabel('📜 Zákoník')
            .setStyle(ButtonStyle.Secondary)
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('mdt_roles')
            .setLabel('👮 Jednotky')
            .setStyle(ButtonStyle.Success)
    );

    return { embeds: [embed], components: [row1, row2] };
}

// =========================
// MODAL - VYHLEDÁNÍ OBČANA
// =========================
function citizenSearchModal() {
    const modal = new ModalBuilder()
        .setCustomId('mdt_citizen_search_submit')
        .setTitle('Vyhledat občana');

    const input = new TextInputBuilder()
        .setCustomId('query')
        .setLabel('Jméno / příjmení / OP číslo')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    return modal.addComponents(new ActionRowBuilder().addComponents(input));
}

// =========================
// MODAL - VYHLEDÁNÍ ZBRANĚ
// =========================
function weaponSearchModal() {
    const modal = new ModalBuilder()
        .setCustomId('mdt_weapon_search_submit')
        .setTitle('Vyhledat zbraň');

    const input = new TextInputBuilder()
        .setCustomId('query')
        .setLabel('Sériové číslo / majitel')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    return modal.addComponents(new ActionRowBuilder().addComponents(input));
}

// =========================
// VYHLEDÁNÍ OBČANA LOGIKA
// =========================
function findCitizen(query) {
    const q = query.toLowerCase();

    return Object.entries(citizens).filter(([id, c]) => {
        return (
            c.firstName?.toLowerCase().includes(q) ||
            c.lastName?.toLowerCase().includes(q) ||
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
            c.opNumber?.toLowerCase().includes(q)
        );
    });
}

// =========================
// VYHLEDÁNÍ ZBRANĚ
// =========================
function findWeapon(query) {
    const q = query.toLowerCase();

    return Object.entries(registeredWeapons || {}).filter(([id, w]) => {
        return (
            w.serial?.toLowerCase().includes(q) ||
            w.owner?.toLowerCase().includes(q)
        );
    });
}

// =========================
// DETAIL OBČANA EMBED
// =========================
function citizenEmbed(c) {
    return new EmbedBuilder()
        .setTitle(`👤 ${c.firstName} ${c.lastName}`)
        .setColor('#00ff99')
        .addFields(
            { name: 'OP číslo', value: c.opNumber || '-', inline: true },
            { name: 'Datum narození', value: c.birthDate || '-', inline: true },
            { name: 'Věk', value: String(c.age || '-'), inline: true },
            { name: 'Roblox', value: c.robloxNick || '-', inline: true },
            { name: 'Adresa', value: c.address || '-', inline: false }
        );
}

// =========================
// ROLE PANEL (LAPD / FBI / DHS)
// =========================
function rolesPanel() {
    return {
        embeds: [
            new EmbedBuilder()
                .setTitle('👮 Jednotky MDT')
                .setDescription(
                    `🔵 LAPD - Los Angeles Police Department\n` +
                    `🟠 LASD - Sheriff Department\n` +
                    `🔴 FBI - Federal Bureau of Investigation\n` +
                    `⚫ DHS - Homeland Security\n` +
                    `🟣 COURT - Justice System`
                )
                .setColor('#ffaa00')
        ]
    };
}

// =========================
// ZÁKONÍK
// =========================
function lawbookPanel() {
    return {
        embeds: [
            new EmbedBuilder()
                .setTitle('📜 Kalifornský zákoník')
                .setDescription(
                    `§1 - Narušení veřejného pořádku\n` +
                    `§2 - Krádež vozidla\n` +
                    `§3 - Ozbrojené přepadení\n` +
                    `§4 - Útěk před policií\n`
                )
                .setColor('#ffffff')
        ]
    };
}

module.exports = {
    createMDTMainPanel,
    citizenSearchModal,
    weaponSearchModal,
    findCitizen,
    findWeapon,
    citizenEmbed,
    rolesPanel,
    lawbookPanel
};

const {
    citizenSearchModal,
    weaponSearchModal,
    findCitizen,
    findWeapon,
    citizenEmbed,
    rolesPanel,
    lawbookPanel
} = require('./mdt-ui');

module.exports = async (interaction) => {

    // =========================
    // TLAČÍTKA MDT
    // =========================
    if (interaction.isButton()) {

        // OBČAN SEARCH
        if (interaction.customId === 'mdt_search_citizen') {
            return interaction.showModal(citizenSearchModal());
        }

        // ZBRAŇ SEARCH
        if (interaction.customId === 'mdt_search_weapon') {
            return interaction.showModal(weaponSearchModal());
        }

        // ZÁKONÍK
        if (interaction.customId === 'mdt_lawbook') {
            return interaction.reply({
                ...lawbookPanel(),
                ephemeral: true
            });
        }

        // ROLE PANEL
        if (interaction.customId === 'mdt_roles') {
            return interaction.reply({
                ...rolesPanel(),
                ephemeral: true
            });
        }
    }

    // =========================
    // MODAL SUBMITY
    // =========================
    if (interaction.isModalSubmit()) {

        // OBČAN VYHLEDÁNÍ
        if (interaction.customId === 'mdt_citizen_search_submit') {

            const query = interaction.fields.getTextInputValue('query');
            const results = findCitizen(query);

            if (!results.length) {
                return interaction.reply({
                    content: '❌ Občan nenalezen',
                    ephemeral: true
                });
            }

            // vezmeme prvního
            const [id, citizen] = results[0];

            return interaction.reply({
                embeds: [citizenEmbed(citizen)],
                ephemeral: true
            });
        }

        // ZBRAŇ VYHLEDÁNÍ
        if (interaction.customId === 'mdt_weapon_search_submit') {

            const query = interaction.fields.getTextInputValue('query');
            const results = findWeapon(query);

            if (!results.length) {
                return interaction.reply({
                    content: '❌ Zbraň nenalezena',
                    ephemeral: true
                });
            }

            const weapon = results[0][1];

            return interaction.reply({
                content:
                    `🔫 **Zbraň nalezena**\n` +
                    `Owner: ${weapon.owner}\n` +
                    `Serial: ${weapon.serial}`,
                ephemeral: true
            });
        }
    }
};

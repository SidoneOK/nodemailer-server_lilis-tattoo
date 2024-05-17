module.exports = function getTgMessade(emailSent) {
    const escapeMarkdown = (text) => {
        if (!text) return ''
        const replacements = {
            _: '\\_',
            '*': '\\*',
            '[': '\\[',
            ']': '\\]',
            '(': '\\(',
            ')': '\\)',
            '~': '\\~',
            '`': '\\`',
            '>': '\\>',
            '#': '\\#',
            '+': '\\+',
            '-': '\\-',
            '=': '\\=',
            '|': '\\|',
            '{': '\\{',
            '}': '\\}',
            '.': '\\.',
            '!': '\\!',
        }
        return text.replace(/[_*[\]()~`>#\+\-=|{}.!]/g, (match) => replacements[match])
    }

    const tgMessage = `
Email sent successfully:
*Name:* ${escapeMarkdown(emailSent.profile.firstName)} ${escapeMarkdown(emailSent.profile.lastName)}
*Email:* ${escapeMarkdown(emailSent.profile.email)}
*Telephone:* ${escapeMarkdown(emailSent.profile.telephone)}
*Instagram Nickname:* ${escapeMarkdown(emailSent.profile.instagramNikname)}
*Birth Date:* ${escapeMarkdown(emailSent.profile.birthDate)}
*Location:* ${escapeMarkdown(emailSent.profile.location)}
*Tattoo Size:* ${escapeMarkdown(emailSent.profile.TattooSize)}
*Placement:* ${escapeMarkdown(emailSent.profile.Placement)}
*Skin Tone:* ${escapeMarkdown(emailSent.profile.skinTone)}
*Message:* ${escapeMarkdown(emailSent.profile.message)}
*Tattoo Color:* ${escapeMarkdown(emailSent.profile.tatooColor)}
*Availability:* ${escapeMarkdown(emailSent.profile.availability)}
*Contraindications:* ${escapeMarkdown(emailSent.profile.Contraindications)}
*Best Days:* ${escapeMarkdown(emailSent.profile.BestDays)}
*Other Inquiries:* ${escapeMarkdown(emailSent.profile.otherInquires)}
*Budget:* ${escapeMarkdown(emailSent.profile.budget)}
*Age:* ${escapeMarkdown(emailSent.profile.age)}
*Check Spam Folder:* ${escapeMarkdown(emailSent.profile.checkSpam)}
`
    return tgMessage
}

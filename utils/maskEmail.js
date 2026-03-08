module.exports = {
    maskEmail(email) {
        const [name, domain] = email.split("@");

        if (name.length <= 2) {
            return name[0] + "*@" + domain;
        }

        const first = name[0];
        const last = name[name.length - 1];
        const masked = "*".repeat(name.length - 2);

        return `${first}${masked}${last}@${domain}`;
    }

};
export type Email = {
  to: string
  from: string
  subject: string
  html: string
}

export type EmailerInit = {
  key: string
}

type Emailer = {
  send: (email: Email) => Promise<boolean>
}

const Emailer = (init: EmailerInit): Emailer => {
  const { key } = init
  return {
    send: async (email) => {
      const { to, from, subject, html } = email
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          subject,
          content: [{ type: "text/html", value: html }],
          from: { email: from },
          reply_to: { email: from },
        }),
      })
      return response.ok
    },
  }
}

export default Emailer

# Mail

Mail is a single-page email client application built using JavaScript, HTML, and CSS for the CS50W course project. It allows users to send, receive, and archive emails, as well as reply to them.

## Features

- Send Mail: Users can compose and send emails to other recipients. Once sent, the email is added to the sent mailbox.
- Mailbox: Users can view their inbox, sent mailbox, and archive, with the latest emails displayed in each mailbox.
- View Email: Users can view the contents of an email, including sender, recipients, subject, timestamp, and body. Emails are marked as read once clicked on.
- Archive and Unarchive: Users can archive and unarchive received emails. Emails in the sent mailbox are not affected.
- Reply: Users can reply to emails, with the recipient field pre-filled with the original sender and the subject line pre-filled with "Re: original subject".

## Installation

1. Clone the repository: `git clone https://github.com/<username>/mail.git`
2. Navigate to the repository: `cd mail`
3. Start the web server: `python manage.py runserver`

## Usage

1. Register for a new account or log in with an existing account.
2. Use the navigation bar to access different mailboxes and compose a new email.
3. Click on an email to view its content, reply to it, or archive it.

## Credits

This project was developed as part of the CS50W course offered by Harvard University.

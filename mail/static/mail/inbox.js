document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector("#compose-form").addEventListener('submit', send_email);
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get emails for the specified mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Create email div for each email in the mailbox
    emails.forEach(email => {
      const email_div = document.createElement('div');
      email_div.className = 'email list-group-item';
      email_div.innerHTML = `<div class="email-sender">${email.sender}</div><div class="email-subject">${email.subject}</div><div class="email-timestamp">${email.timestamp}</div>`;
      if (email.read) {
        email_div.style.backgroundColor = '#f5f5f5';
        email_div.style.fontWeight = 'normal';
      } else {
        email_div.style.backgroundColor = 'white';
        email_div.style.fontWeight = 'bold';
      }
      // Add event listener to load email when clicked
      email_div.addEventListener('click', () => view_email(email.id));

      // Add email div to emails-view div
      document.querySelector('#emails-view').appendChild(email_div);
    });
  })
  .catch(error => {
    console.log('Error:', error);
  });
    
}


function send_email(event) {
  event.preventDefault();

  // Gather form data
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send POST request to /emails endpoint with form data
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Load sent mailbox if email is successfully sent
    if (result.message === 'Email sent successfully.') {
      load_mailbox('sent');
    }
    console.log(result);
  })
  .catch(error => {
    console.log('Error:', error);
  });
}

function view_email(emailId) {
  // Show the email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  // Request the email data
  fetch(`/emails/${emailId}`)
    .then(response => response.json())
    .then(email => {
      // Render the email data
      const emailView = document.querySelector('#email-view');
      emailView.innerHTML = `
        <div><strong>From:</strong> ${email.sender}</div>
        <div><strong>To:</strong> ${email.recipients.join(', ')}</div>
        <div><strong>Subject:</strong> ${email.subject}</div>
        <div><strong>Timestamp:</strong> ${email.timestamp}</div>
        <hr>
        <div>${email.body}</div>
      `;

      // Mark the email as read
      if (!email.read) {
        fetch(`/emails/${emailId}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        });
      }

      // Add Archive/Unarchive button
      const archiveBtn = document.createElement('button');
      archiveBtn.innerHTML = email.archived ? 'Unarchive' : 'Archive';
      archiveBtn.className = email.archived ? "btn btn-success buttonra" : "btn btn-danger buttonra";
      archiveBtn.addEventListener('click', function() {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            archived: !email.archived
          })
        })
        .then(() => { load_mailbox('inbox')});
      });
      document.querySelector('#email-view').append(archiveBtn);

      // Add Reply button
      const replyBtn = document.createElement('button');
      replyBtn.innerHTML = 'Reply';
      replyBtn.className = 'btn btn-primary buttonra';
      replyBtn.addEventListener('click', function() {
        compose_email();
        document.querySelector('#compose-recipients').value = email.sender;
        let subject = email.subject;
        if(subject.split(' ',1)[0] != "Re:"){
          subject = "Re: " + email.subject;
        }
        document.querySelector('#compose-subject').value = subject;
        document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}`;
      });
      document.querySelector('#email-view').append(replyBtn);
    });
}

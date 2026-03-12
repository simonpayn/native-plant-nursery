const nodemailer = require('nodemailer');

function createTransport() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function renderTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
}

function formatItems(items) {
  return items
    .map((item) =>
      `  - ${item.common_name} (${item.container_size}) x${item.quantity} = $${(item.unit_price * item.quantity).toFixed(2)}`
    )
    .join('\n');
}

async function sendOrderEmails(db, order, items) {
  const transport = createTransport();
  if (!transport) {
    console.log('[email] GMAIL_USER/GMAIL_APP_PASSWORD not set — skipping emails');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.log('[email] ADMIN_EMAIL not set — skipping emails');
    return;
  }

  const templates = db.prepare('SELECT * FROM email_templates').all();
  const adminTpl = templates.find((t) => t.name === 'admin_order');
  const customerTpl = templates.find((t) => t.name === 'customer_order');

  const vars = {
    order_id: String(order.id),
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,
    total: order.total.toFixed(2),
    date: new Date().toLocaleDateString(),
    items: formatItems(items),
  };

  const sends = [];

  if (adminTpl) {
    sends.push(
      transport.sendMail({
        from: process.env.GMAIL_USER,
        to: adminEmail,
        subject: renderTemplate(adminTpl.subject, vars),
        text: renderTemplate(adminTpl.body, vars),
      })
    );
  }

  if (customerTpl) {
    sends.push(
      transport.sendMail({
        from: process.env.GMAIL_USER,
        to: order.customer_email,
        subject: renderTemplate(customerTpl.subject, vars),
        text: renderTemplate(customerTpl.body, vars),
      })
    );
  }

  await Promise.all(sends).catch((err) => {
    console.error('[email] Failed to send emails:', err.message);
  });
}

module.exports = { sendOrderEmails };

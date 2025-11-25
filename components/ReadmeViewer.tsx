import React from 'react';
import { FileText, Copy } from 'lucide-react';

export const ReadmeViewer: React.FC = () => {
  const readmeContent = `
# MySQL to Slack Integration - Setup Guide

This guide details how to securely connect your AWS EC2 MySQL instance to a Slack channel named \`#mysql-query-result\`.

## Prerequisites

1.  **AWS EC2**: Instance running MySQL (ensure Security Group allows inbound 3306 from your middleware IP).
2.  **Slack App**: Create at [api.slack.com](https://api.slack.com/apps).
3.  **Middleware Host**: Lambda, Heroku, or another EC2 instance to run the Node.js connector.

## 1. Slack App Configuration

1.  Create a new Slack App.
2.  Enable **Slash Commands** (e.g., \`/sql\`) OR **Event Subscriptions** (Bot Events: \`message.channels\`).
3.  Install the app to your workspace.
4.  Copy the **Signing Secret** and **Bot User OAuth Token**.

## 2. Database User (Best Practice)

Create a read-only user on your MySQL server to prevent accidents.

\`\`\`sql
CREATE USER 'slack_bot'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT ON your_database.* TO 'slack_bot'@'%';
FLUSH PRIVILEGES;
\`\`\`

## 3. Middleware Implementation (Node.js Example)

Deploy this simplified code to your middleware server (e.g., AWS Lambda).

\`\`\`javascript
const { App } = require('@slack/bolt');
const mysql = require('mysql2/promise');

// Initialize Slack App
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Create DB Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true } // Enforce SSL
});

// Handle the /sql command
app.command('/sql', async ({ command, ack, respond }) => {
  await ack();
  
  if (command.channel_name !== 'mysql-query-result') {
    return await respond("Error: Queries only allowed in #mysql-query-result");
  }

  try {
    const [rows] = await pool.execute(command.text);
    // Format rows as Block Kit (simplified)
    await respond({
      response_type: 'in_channel',
      text: \`Query Result: \${JSON.stringify(rows)}\`
    });
  } catch (error) {
    await respond(\`SQL Error: \${error.message}\`);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
\`\`\`

## 4. Security Checklist

-   [ ] **SSL Enforced**: Ensure MySQL requires SSL connections.
-   [ ] **IP Whitelisting**: Restrict MySQL Security Group to only accept traffic from the Middleware IP.
-   [ ] **Secrets Management**: Store DB credentials in AWS Secrets Manager or Environment Variables. Do not hardcode.
-   [ ] **Channel Restriction**: Middleware code should verify \`channel_name === 'mysql-query-result'\` before executing.

## 5. Usage

In your Slack channel \`#mysql-query-result\`:

> \`/sql SELECT id, email FROM users WHERE active = 1 LIMIT 5\`
  `;

  return (
    <div className="h-full overflow-y-auto bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
           <FileText className="text-gray-700 mr-3" size={32} />
           <div>
             <h1 className="text-3xl font-bold text-gray-900">Integration Documentation</h1>
             <p className="text-gray-500 mt-1">README.md</p>
           </div>
        </div>

        <div className="prose prose-slate max-w-none">
          {readmeContent.split('\n').map((line, index) => {
             // Simple naive markdown rendering for specific elements
             if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-gray-900">{line.replace('# ', '')}</h1>;
             if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-semibold mt-8 mb-4 text-gray-800 border-l-4 border-blue-500 pl-3">{line.replace('## ', '')}</h2>;
             if (line.startsWith('```')) return null; // Skip code block markers for cleaner custom rendering below, or handle block accumulation (omitted for simplicity in this snippet, effectively hiding markers)
             
             // Check for code blocks context (simple heuristic)
             const isCodeLine = line.includes('const ') || line.includes('require(') || line.includes('CREATE USER') || line.includes('app.command');
             
             if (isCodeLine) {
                 return (
                     <div key={index} className="bg-gray-900 text-gray-100 font-mono text-sm px-4 py-1 border-l-4 border-gray-700">
                         {line}
                     </div>
                 );
             }

             if (line.trim().startsWith('- [ ]')) {
                 return (
                     <div key={index} className="flex items-center mt-2 text-gray-700">
                         <input type="checkbox" disabled className="mr-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                         <span>{line.replace('- [ ]', '')}</span>
                     </div>
                 )
             }

             return <p key={index} className="mb-3 text-gray-600 leading-relaxed">{line}</p>;
          })}
        </div>
        
        <div className="mt-12 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
            <strong>Note:</strong> This dashboard is a simulation. To implement the real solution, deploy the Node.js code above to your infrastructure.
        </div>
      </div>
    </div>
  );
};

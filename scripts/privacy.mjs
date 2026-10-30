// Content of the /privacy/ page. Keep it true to what the site and outreach actually do:
// update it (and UPDATED) whenever analytics, the contact form or outreach tools change.
export const UPDATED = '30 October 2026'
const EMAIL = 'shivakumar.frontend@gmail.com'

export const PRIVACY_INTRO =
  'This page explains what personal information I collect through this website and my business outreach, why I use it, who helps me process it, and the choices you have. I’ve kept it plain and specific.'

export const PRIVACY_SECTIONS = [
  {
    title: 'Who I am',
    body: `<p>This website is run by Shiva Kumar, an independent frontend engineer based in Bengaluru, Karnataka, India. I’m responsible for the personal information described here. For anything about your data, email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`,
  },
  {
    title: 'What I collect',
    body: `<ul>
      <li><b>When you use the contact form:</b> your name, email address, project type, budget and message.</li>
      <li><b>When you contact me directly:</b> whatever you choose to send by email or WhatsApp, along with your email address or phone number.</li>
      <li><b>When you browse this site:</b> my hosting provider keeps technical logs, which can include your IP address. If you accept analytics cookies, Google Analytics also records usage such as pages viewed, approximate location, device and browser details, and how you arrived.</li>
      <li><b>If I contact you about my services:</b> your name, work email address, role and company, and details about your business, taken from public sources such as company websites and business directories. I also keep any replies you send.</li>
    </ul>`,
  },
  {
    title: 'Why I use it',
    body: `<ul>
      <li>To reply to your enquiry, discuss your project and provide my services.</li>
      <li>To understand how this site is used and improve it. If you’ve accepted analytics cookies, the form also tells analytics that an enquiry was sent, with its project type and budget, but not your name, email or message.</li>
      <li>To keep the site secure and working properly.</li>
      <li>To send a small number of relevant business emails about my services, and to record your choice if you ask me to stop.</li>
    </ul>
    <p>Where laws such as the UK or EU GDPR apply, I rely on steps you ask me to take before a contract, on performing that contract, and on my legitimate interest in running and promoting my business. For analytics cookies, I rely on your consent.</p>`,
  },
  {
    title: 'Cookies and analytics',
    body: `<p>Google Tag Manager and Google Analytics load only if you choose Accept in the cookie banner. Analytics sets cookies to tell visits apart. If you decline, they don’t load and those cookies aren’t set. I don’t set any other cookies; your choice is saved in your browser’s local storage so the banner doesn’t keep coming back.</p>
    <p>You can change your mind at any time using <b>Cookie settings</b> in the footer of any page. Google explains <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">how it uses data from sites like this one</a>.</p>`,
  },
  {
    title: 'Who helps me process it',
    body: `<p>I don’t sell your personal information. I share it only with services that help me run this site and my business:</p>
    <ul>
      <li><b>Vercel:</b> hosts this website and runs the contact form endpoint.</li>
      <li><b>FormSubmit:</b> delivers contact form messages to my inbox. Resend may do this instead if I switch to it.</li>
      <li><b>Google:</b> Analytics, Tag Manager and Gmail.</li>
      <li><b>WhatsApp:</b> only if you choose to message me there.</li>
      <li><b>Anthropic (Claude):</b> AI that helps me research businesses and draft and handle outreach emails. It can receive prospect details and replies.</li>
      <li><b>Email-finding and verification services:</b> used to check that a business address is deliverable before I email it.</li>
    </ul>
    <p>I may also disclose information if the law requires it. Some of these providers process data outside your country, including in India and the United States.</p>`,
  },
  {
    title: 'How long I keep it',
    body: `<p>I keep enquiries and project emails for as long as I need them to work with you and to meet tax, accounting and legal duties. If you ask me not to contact you again, I keep only the minimum needed to make sure I respect that.</p>`,
  },
  {
    title: 'Your choices and rights',
    body: `<ul>
      <li><b>Stop outreach:</b> reply “no thanks” to any email from me and I won’t email you again.</li>
      <li><b>Access, correct or delete:</b> email me and I’ll help. Depending on where you live, you may also be able to object to or restrict how I use your data, or ask for a copy of it.</li>
      <li><b>Complain:</b> you can contact your local data protection authority. I’d appreciate the chance to fix things first.</li>
    </ul>`,
  },
  {
    title: 'Other websites',
    body: `<p>This site links to client websites, GitHub and WhatsApp. They have their own privacy practices, which this page doesn’t cover.</p>`,
  },
  {
    title: 'Children',
    body: `<p>This site and my services are aimed at businesses, not children, and I don’t knowingly collect information from children.</p>`,
  },
  {
    title: 'Changes to this page',
    body: `<p>If how I handle personal information changes, I’ll update this page and the date at the top.</p>`,
  },
]

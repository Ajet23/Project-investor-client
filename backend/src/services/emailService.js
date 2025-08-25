/**
 * Stub email service.
 * In production, integrate with SES, SendGrid, Mailgun, etc.
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  // eslint-disable-next-line no-console
  console.log('\n--- STUB EMAIL ---');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Text:', text);
  console.log('HTML:', html);
  console.log('------------------\n');
};

import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_aktr8xl';
const TEMPLATE_ID = 'template_0rzt83h';
const PUBLIC_KEY = 'ulkUkpNBM2-1iZG-X';

emailjs.init(PUBLIC_KEY);

export interface HauntFormData {
  fromName: string;
  fromEmail: string;
  message: string;
  projectTitle: string;
  toEmail: string;
}

export const sendHauntEmail = async (data: HauntFormData): Promise<boolean> => {
  try {
    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name: data.fromName,
      from_email: data.fromEmail,
      message: data.message,
      project_title: data.projectTitle,
      to_email: data.toEmail,
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('EmailJS error:', error);
    return false;
  }
};

import nodemailer from "nodemailer";

interface EmailService {
  sendActivationEmail(
    to: string,
    username: string,
    activationToken: string
  ): Promise<boolean>;
  sendResetPasswordEmail(
    to: string,
    username: string,
    resetPassword: string
  ): Promise<boolean>;
}

const emailService: EmailService = {
  sendActivationEmail: async (to, username, activationToken) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 1025,
        secure: false,
      });

      const activationLink = `http://localhost:${process.env.API_PORT}/users/activation/${activationToken}`;
      const nameOfTheApp = "todo";

      const mailOptions = {
        from: "noreply@todo.com",
        to: to,
        subject: `Activation de compte - ${nameOfTheApp}`,
        html: `
          <p style="font-family: 'Arial', sans-serif;">Bonjour ${username}!</p>
          <p style="font-family: 'Arial', sans-serif;">Nous sommes ravis de vous accueillir chez ${nameOfTheApp} !</p>
          <p style="font-family: 'Arial', sans-serif;">Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
          <a target="_blank" href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #ffffff; text-decoration: none; font-family: 'Arial', sans-serif; border-radius: 5px;">Activer mon compte</a>
          <p style="font-family: 'Arial', sans-serif;">Merci de faire partie de notre communauté.</p>
          <p style="font-family: 'Arial', sans-serif;">Cordialement,<br/>L'équipe ${nameOfTheApp}</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      return true;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail d'activation :", error);
      throw new Error("Erreur lors de l'envoi de l'e-mail d'activation");
    }
  },

  sendResetPasswordEmail: async (to, username, resetPassword) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 1025,
        secure: false,
      });

      const logLink = "http://localhost:3000/login";
      const nameOfTheApp = "MagRead";

      const mailOptions = {
        from: "noreply@magread.com",
        to: to,
        subject: `Réinitialisation de mot de passe - ${nameOfTheApp}`,
        html: `
          <div style="font-family: 'Arial', sans-serif; background-color: #f9f9f9; padding: 20px;">
            <p>Bonjour ${username} !</p>
            <p>Nous sommes ravis de vous accueillir chez ${nameOfTheApp} !</p>
            <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
            
            <div style="background-color: #fff; padding: 20px; border-radius: 5px; margin-top: 15px;">
              <p style="font-weight: bold;">Votre mot de passe temporaire :</p>
              <p style="font-family: 'Courier New', monospace; background-color: #f2f2f2; padding: 1rem; display: inline-block; border-radius: 5px;">${resetPassword}</p>
            </div>
            
            <a href="${logLink}?email=${to}&password=${resetPassword}" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #000; color: #ffffff; text-decoration: none; border-radius: 5px;">Login to ${nameOfTheApp}</a>
            
            <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail.</p>
            <p>Merci de faire partie de notre communauté.</p>
            <p>Cordialement,<br/>L'équipe ${nameOfTheApp}</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      return true;
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'e-mail de réinitialisation du mot de passe :",
        error
      );
      throw new Error(
        "Erreur lors de l'envoi de l'e-mail de réinitialisation du mot de passe"
      );
    }
  },
};

export = emailService;

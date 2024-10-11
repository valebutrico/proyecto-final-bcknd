import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error during login", error: error.message });
    }
  }

  static async register(req, res) {
    try {
      const { email, password, first_name, last_name, age, role } = req.body;
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res
          .status(400)
          .render("register", { error: "Este usuario ya existe" });
      }

      const user = new User({
        email,
        password,
        first_name,
        last_name,
        age,
        role,
      });

      await user.save();
      res.render("register", {
        success: "Usuario registrado exitosamente. Por favor, ",
      });
    } catch (error) {
      res.status(500).render("register", {
        error: "Hubo un error en el registro",
        errorDetails: error.message,
      });
    }
  }

  static logout(req, res) {
    req.logout();
    res.redirect("/login");
  }

  static async sendPasswordResetEmail(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      await sendEmail({
        to: email,
        subject: "Restablecer tu contraseña",
        text: `Haz clic en este enlace para restablecer tu contraseña: ${process.env.CLIENT_URL}/reset-password/${token}`,
      });

      res.status(200).json({ message: "Correo de recuperación enviado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error en el servidor", error: error.message });
    }
  }

  static async verifyResetToken(req, res) {
    const { token } = req.params;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.render("resetPassword", { token });
    } catch (error) {
      res.status(400).render("tokenExpired", {
        message:
          "El enlace de restablecimiento ha expirado. Por favor, solicita uno nuevo.",
      });
    }
  }

  static async updatePassword(req, res) {
    const { token, newPassword } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword) {
        return res
          .status(400)
          .render("resetPassword", {
            error: "La nueva contraseña no puede ser igual a la anterior.",
            token,
          });
      }

      user.password = newPassword;
      await user.save();

      res.render("login", {
        success:
          "Contraseña actualizada exitosamente. Por favor, inicia sesión con tu nueva contraseña.",
      });
    } catch (error) {
      res
        .status(400)
        .render("tokenExpired", {
          message:
            "El enlace de restablecimiento no es válido o ha expirado. Por favor, solicita uno nuevo.",
        });
    }
  }
}

export default AuthController;

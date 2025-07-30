const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = null;
        this.initTransporter();
    }

    initTransporter() {
        // Configuración para Gmail (puedes cambiar por otro proveedor)
        this.transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Tu email
                pass: process.env.EMAIL_PASSWORD // Tu contraseña de aplicación
            }
        });

        // Configuración alternativa para otros proveedores SMTP
        /*
        this.transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true para 465, false para otros puertos
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        */
    }

    async sendContactEmail(contactData) {
        try {
            const { nombre, email, telefono, mensaje, tipoConsulta } = contactData;

            // Plantilla de email para el propietario
            const ownerEmailHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; }
                        .field { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #8B4513; }
                        .field label { font-weight: bold; color: #333; display: block; margin-bottom: 5px; }
                        .field value { color: #666; font-size: 16px; }
                        .mensaje-box { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
                        .priority-high { border-left-color: #dc3545; }
                        .priority-medium { border-left-color: #ffc107; }
                        .priority-low { border-left-color: #28a745; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🪑 Nueva Consulta - DAJUSCA</h1>
                            <p>Has recibido una nueva consulta desde tu página web</p>
                        </div>
                        
                        <div class="content">
                            <div class="field ${this.getPriorityClass(tipoConsulta)}">
                                <label>👤 Nombre del Cliente:</label>
                                <div class="value">${nombre}</div>
                            </div>
                            
                            <div class="field">
                                <label>📧 Email de Contacto:</label>
                                <div class="value"><a href="mailto:${email}">${email}</a></div>
                            </div>
                            
                            <div class="field">
                                <label>📱 Teléfono:</label>
                                <div class="value"><a href="tel:${telefono}">${telefono}</a></div>
                            </div>
                            
                            <div class="field">
                                <label>🏷️ Tipo de Consulta:</label>
                                <div class="value">${this.getConsultaLabel(tipoConsulta)}</div>
                            </div>
                            
                            <div class="mensaje-box">
                                <label>💬 Mensaje del Cliente:</label>
                                <div class="value" style="margin-top: 10px; line-height: 1.6;">${mensaje}</div>
                            </div>
                            
                            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 20px;">
                                <h3 style="margin: 0 0 10px 0; color: #1976d2;">⚡ Acciones Recomendadas:</h3>
                                <ul style="margin: 0; padding-left: 20px;">
                                    <li>Responder en las próximas 24 horas</li>
                                    <li>Llamar al cliente para brindar atención personalizada</li>
                                    <li>Enviar catálogo específico según el tipo de consulta</li>
                                    ${tipoConsulta === 'cotizacion' ? '<li><strong>🎯 Prioridad Alta:</strong> Preparar cotización detallada</li>' : ''}
                                </ul>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>📅 Fecha: ${new Date().toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                            <p>🌐 Enviado desde: www.dajusca.com</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            // Plantilla de email de confirmación para el cliente
            const clientEmailHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 30px; text-align: center; }
                        .content { padding: 30px; }
                        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513; }
                        .contact-info { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ ¡Gracias por Contactarnos!</h1>
                            <p>DAJUSCA - Muebles a Medida</p>
                        </div>
                        
                        <div class="content">
                            <h2>Hola ${nombre},</h2>
                            
                            <p>¡Muchas gracias por contactar a DAJUSCA! Hemos recibido tu consulta sobre <strong>${this.getConsultaLabel(tipoConsulta)}</strong> y queremos asegurarte que la atenderemos con la mayor prioridad.</p>
                            
                            <div class="info-box">
                                <h3>📋 Resumen de tu Consulta:</h3>
                                <p><strong>Tipo:</strong> ${this.getConsultaLabel(tipoConsulta)}</p>
                                <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                                <p><strong>Mensaje:</strong> ${mensaje.substring(0, 100)}${mensaje.length > 100 ? '...' : ''}</p>
                            </div>
                            
                            <h3>⏰ ¿Qué Sigue?</h3>
                            <ul>
                                <li><strong>Respuesta:</strong> Te contactaremos en las próximas 24 horas</li>
                                <li><strong>Llamada:</strong> Un especialista te llamará para brindar atención personalizada</li>
                                <li><strong>Cotización:</strong> Si solicitaste una cotización, la recibirás en máximo 48 horas</li>
                            </ul>
                            
                            <div class="contact-info">
                                <h3>📞 Información de Contacto</h3>
                                <p><strong>Teléfono:</strong> +57 (1) 234-5678</p>
                                <p><strong>WhatsApp:</strong> +57 300 123 4567</p>
                                <p><strong>Email:</strong> info@dajusca.com</p>
                                <p><strong>Dirección:</strong> Calle 45 #23-67, Bogotá</p>
                                <p><strong>Horarios:</strong> Lun-Vie: 8AM-6PM | Sáb: 9AM-4PM</p>
                            </div>
                            
                            <p>Mientras tanto, te invitamos a:</p>
                            <ul>
                                <li>🌐 Explorar nuestro <a href="#catalogo">catálogo en línea</a></li>
                                <li>🎨 Usar nuestro <a href="#configurador">configurador 3D</a></li>
                                <li>📱 Seguirnos en redes sociales para ver nuestros trabajos recientes</li>
                            </ul>
                        </div>
                        
                        <div class="footer">
                            <p><strong>DAJUSCA - Creamos Muebles Únicos para tu Hogar</strong></p>
                            <p>Este es un mensaje automático, por favor no respondas a este email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            // Enviar email al propietario
            const ownerMailOptions = {
                from: `"DAJUSCA Website" <${process.env.EMAIL_USER}>`,
                to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
                subject: `🔔 Nueva Consulta: ${this.getConsultaLabel(tipoConsulta)} - ${nombre}`,
                html: ownerEmailHTML,
                priority: tipoConsulta === 'cotizacion' ? 'high' : 'normal'
            };

            // Enviar email de confirmación al cliente
            const clientMailOptions = {
                from: `"DAJUSCA" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: '✅ Confirmación de Consulta - DAJUSCA Muebles',
                html: clientEmailHTML
            };

            // Enviar ambos emails
            const [ownerResult, clientResult] = await Promise.all([
                this.transporter.sendMail(ownerMailOptions),
                this.transporter.sendMail(clientMailOptions)
            ]);

            return {
                success: true,
                message: 'Emails enviados correctamente',
                ownerMessageId: ownerResult.messageId,
                clientMessageId: clientResult.messageId
            };

        } catch (error) {
            console.error('Error enviando email:', error);
            return {
                success: false,
                message: 'Error enviando el email',
                error: error.message
            };
        }
    }

    getPriorityClass(tipoConsulta) {
        switch (tipoConsulta) {
            case 'cotizacion':
            case 'urgente':
                return 'priority-high';
            case 'informacion':
                return 'priority-medium';
            default:
                return 'priority-low';
        }
    }

    getConsultaLabel(tipoConsulta) {
        const labels = {
            'cotizacion': '💰 Solicitud de Cotización',
            'informacion': 'ℹ️ Solicitud de Información',
            'catalogo': '📋 Consulta de Catálogo',
            'personalizado': '🎨 Diseño Personalizado',
            'reparacion': '🔧 Servicio de Reparación',
            'instalacion': '🏗️ Servicio de Instalación',
            'garantia': '🛡️ Consulta de Garantía',
            'otro': '❓ Otra Consulta'
        };
        return labels[tipoConsulta] || '📝 Consulta General';
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            return { success: true, message: 'Conexión de email verificada' };
        } catch (error) {
            return { success: false, message: 'Error de conexión de email', error: error.message };
        }
    }
}

module.exports = new EmailService();
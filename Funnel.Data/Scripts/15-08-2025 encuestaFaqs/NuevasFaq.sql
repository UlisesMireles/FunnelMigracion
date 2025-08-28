UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '¿Qué puede y qué no puede hacer Bruno?',
    Respuesta = '<p class="ql-align-justify">Bruno es un asistente comercial experto que puede realizar diversas tareas relacionadas con la prospección de clientes y la generación de correos electrónicos y mensajes personalizados. A continuación, se detallan lo que puede y no puede hacer:</p><p><strong>¿Qué puede hacer Bruno?</strong></p><p><span style="color: rgb(0, 0, 0);">&nbsp;</span></p><ol><li class="ql-align-justify"><strong>Prospección de nuevos clientes:</strong> Utiliza el Módulo de Prospector Predictivo Comercial para identificar empresas con alto potencial de conversión basándose en patrones de clientes actuales.</li><li class="ql-align-justify"><strong>Generación de correos electrónicos personalizados: </strong>Puede redactar correos electrónicos orientados a resultados, incluyendo beneficios claros y medibles de soluciones de inteligencia artificial generativa.</li><li class="ql-align-justify"><strong>&nbsp;Entrenamiento en ventas consultivas:</strong> Ofrece recomendaciones sobre cómo abordar objeciones y generar necesidades en los prospectos.</li><li class="ql-align-justify"><strong>Generación de mensajes de LinkedIn:</strong> Crea guiones para mensajes cortos y profesionales, adaptados al tipo de prospecto y objetivo del mensaje.</li><li class="ql-align-justify"><strong>Análisis de sectores e industrias:</strong> Puede identificar beneficios específicos y problemas comunes en sectores determinados, así como ofrecer soluciones personalizadas.</li></ol><p>&nbsp;</p><p><strong>¿Qué no puede hacer Bruno?</strong></p><p><span style="color: rgb(0, 0, 0);">&nbsp;</span></p><ol><li class="ql-align-justify"><strong>&nbsp;Inventar datos o información:</strong> No puede proporcionar información que no esté disponible o que no tenga base real.</li><li class="ql-align-justify"><strong>Actuar de manera independiente:</strong> No puede tomar decisiones sin la intervención del usuario o sin la información necesaria.</li><li class="ql-align-justify"><strong>Redactar información sin los datos requeridos:</strong> No puede crear correos o mensajes adecuados sin contar con la información de contacto adecuada del prospecto.</li><li class="ql-align-justify"><strong>Realizar tareas fuera de su ámbito comercial:</strong> No puede involucrarse en actividades que no estén relacionadas con la prospección y generación de oportunidades de ventas.</li></ol>'
WHERE Id = 59;

UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '¿Cómo inicio una nueva conversación?',
	Respuesta = '<p>Para iniciar una conversación e interactuar con Bruno, puedes seguir estos pasos:</p><ol><li class="ql-align-justify"><strong>Presentación Breve:</strong> Aunque ya sepas quién es Bruno y el también tome tus datos de la sesión que inicias, puedes mencionar tu nombre y tu rol para contextualizar la conversación. </li><li class="ql-align-justify"><strong>Propósito de la Conversación:</strong> Indica claramente el motivo por el cual deseas interactuar con Bruno. <strong>&nbsp;</strong></li><li class="ql-align-justify"><strong>Preguntas Específicas:</strong> Si prefieres puedes hacer preguntas directas sobre cómo Bruno puede ayudarte.</li></ol>'
WHERE Id = 60;

UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '¿Qué datos mínimos necesito?',
	Respuesta = '<p class="ql-align-justify">Para interactuar de manera efectiva con Bruno y aprovechar sus capacidades, necesitarás los siguientes datos mínimos:</p><p class="ql-align-justify"><br></p><ol><li class="ql-align-justify"><strong>Nombre del Prospecto:</strong> El nombre de la persona con la que deseas comunicarte. Esto permite personalizar la conversación.</li><li class="ql-align-justify"><strong>Nombre de la Empresa o Sitio Web:</strong> Conocer el nombre de la empresa prospecto o su sitio web ayuda a entender su giro y sector, lo cual es esencial para ofrecer soluciones relevantes.</li><li class="ql-align-justify"><strong>Sector o Industria:</strong> Si es posible, identifica el sector o industria en la que opera la empresa. Esto permitirá a Bruno generar beneficios y propuestas más alineadas con sus necesidades.</li><li class="ql-align-justify"><strong>Objetivo de la Conversación:</strong> Define el propósito de tu interacción, ya sea para generar leads, explorar colaboraciones, o presentar soluciones específicas.</li></ol><p class="ql-align-justify">&nbsp;</p><p class="ql-align-justify">Con estos datos, podrás maximizar la efectividad de la interacción con Bruno y obtener resultados más concretos.&nbsp;</p>'
WHERE Id = 61;

UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '¿Puedo pedir que Bruno enfoque el mensaje en un problema específico del cliente?',
	Respuesta = '<p class="ql-align-justify">Sí, puedes pedir que Bruno enfoque el mensaje en un problema específico del cliente. De hecho, esto es altamente recomendable, ya que personalizar el mensaje en función de un desafío o necesidad concreta del prospecto puede aumentar la efectividad de la comunicación.</p>'
WHERE Id = 62;

UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '¿Cómo saber si Bruno entendió bien mi solicitud?',
	Respuesta = '<p>Una vez que Bruno genere un mensaje o respuesta, revísalo para asegurarte de que aborda correctamente tus necesidades y expectativas. Si algo no está claro, puedes solicitar ajustes o modificaciones.</p>'
WHERE Id = 63;

UPDATE [dbo].[PreguntasFrecuentes] SET Estatus = 0 WHERE Id BETWEEN 64 AND 71;




INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,' ¿Cómo cambio el tono de los mensajes?' ,
		   '<p class="ql-align-justify">Escribe /tono seguido de ejecutivo, empático o directo para que Bruno adapte automáticamente el&nbsp;vocabulario y formalidad del mensaje según el tipo de cliente.</p><p><br></p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puedo guardar mi firma personal?' , 
		   '<p>No necesitas guardarla manualmente. Tu firma personal se guarda automáticamente cuando inicias sesión, ya que Bruno toma tus datos y los asocia a tu cuenta de forma segura.</p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Cómo adapto el mensaje para distintos tipos de clientes?' , 
		   '<p>Indica el tipo de cliente (PyME, corporativo, startup) y Bruno ajustará el enfoque.</p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puedo prohibir ciertas palabras o frases?' , 
		   '<p>Sí, especifica las palabras a evitar y Bruno las excluirá de las propuestas.</p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puedo tener varios perfiles de estilo?' , 
		   '<p>Sí, puedes tener varios perfiles de estilo para adaptar tus mensajes a diferentes contextos y tipos de clientes.</p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puede Bruno dar ejemplos de uso de IA en mi sector?' , 
		   '<p>Sí, genera tres ejemplos concretos con métricas y resultados.</p>', 
		   GETDATE(), GETDATE(),  1, 23, 1);         
GO
INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puede adaptar un mensaje a mi industria?' , 
		   '<p><p>Sí, Bruno ajusta tono y enfoque con base en las características de tu sector.</p>', 
		   GETDATE(), GETDATE(),  1, 23, 1);         
GO
INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Cómo puede responder  Bruno a objeciones comunes?' , 
		   '<p>Especifíca lo que quieres lograr e incluye la frase con la objeción que quieras trabajar, y recibirás varias alternativas de respuesta para inspirarte.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puedo entrenar respuestas personalizadas?' , 
		   '<p>&nbsp;Sí, proporciona el escenario y la respuesta ideal para que Bruno la memorice.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Cómo manejo una respuesta negativa del cliente?' , 
		   '<p>Solicita opciones para mantener la conversación abierta y generar nuevo interés.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puedo preparar objeciones para una reunión específica?' , 
		   '<p>Sí, indica el contexto y Bruno generará respuestas alineadas al objetivo.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puede simular una conversación de objeciones?' , 
		   '<p>Sí, puede actuar como cliente para practicar tu manejo de objeciones.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Cómo califica Bruno a un lead?' , 
		   '<p>Evalúa similitud, potencial de compra y facilidad de contacto.</p>', 
		   GETDATE(), GETDATE(),  1, 25, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Se integra con mi CRM?' , 
		   '<p>No, actualmente no cuenta con integración directa con CRM para poder realizar acciones en el desde el bot.</p>', 
		   GETDATE(), GETDATE(),  1, 25, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puede agendar reuniones?' , 
		   '<p>No, por ahora no tiene función de agenda.</p>', 
		   GETDATE(), GETDATE(),  1, 25, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Cuándo consume tokens Bruno?' , 
		   '<p class="ql-align-justify">En preguntas abiertas y generación de textos; las FAQs y comandos fijos consumen menos.</p><p><br></p>', 
		   GETDATE(), GETDATE(),  1, 26, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Cómo reducir el consumo de tokens?' , 
		   '<p>Usa comandos específicos y aprovecha las preguntas frecuentes.</p>', 
		   GETDATE(), GETDATE(),  1, 26, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Qué datos guarda Bruno?' , 
		   '<p class="ql-align-justify">Se guardan los siguientes datos: nombre completo, correo electrónico, puesto, empresa y teléfono, todo esto con el fin de personalizar tu experiencia y mantener un registro de tu interacción.</p><p><br></p>', 
		   GETDATE(), GETDATE(),  1, 27, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Cómo borro mis datos?' , 
		   '<p>Los datos no se pueden borrar manualmente, ya que se toman temporalmente en la sesión.</p>', 
		   GETDATE(), GETDATE(),  1, 27, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿En qué idiomas puede responder?' , 
		   '<p>Actualmente sólo en español manteniendo coherencia y tono.</p>', 
		   GETDATE(), GETDATE(),  1, 27, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Cumple con las leyes de protección de datos?' , 
		   '<p>Sí, cumple con las leyes de protección de datos, ya que la información se almacena únicamente durante la sesión y se maneja de manera temporal y segura, sin registrarse de forma permanente.</p>', 
		   GETDATE(), GETDATE(),  1, 27, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Qué hago si no reconoce mi pregunta?' , 
		   '<p class="ql-align-justify">Si no reconoce tu pregunta, intenta reformularla con otras palabras, ser más específico o dividirla en preguntas más pequeñas. Esto ayuda a entender mejor lo que necesitas y a darte una respuesta más precisa.</p>', 
		   GETDATE(), GETDATE(),  1, 28, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'¿Puedo sugerir una nueva pregunta frecuente?' , 
		   '<p>Sí, envía tu propuesta en nuestra sección de comentarios al llenar la encuesta de satisfacción del servicio y será evaluada para su inclusión.</p>', 
		   GETDATE(), GETDATE(),  1, 28, 1);         
GO
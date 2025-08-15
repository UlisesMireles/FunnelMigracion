UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '�Qu� puede y qu� no puede hacer Bruno?',
    Respuesta = '<p class="ql-align-justify">Bruno es un asistente comercial experto que puede realizar diversas tareas relacionadas con la prospecci�n de clientes y la generaci�n de correos electr�nicos y mensajes personalizados. A continuaci�n, se detallan lo que puede y no puede hacer:</p><p><strong>�Qu� puede hacer Bruno?</strong></p><p><span style="color: rgb(0, 0, 0);">&nbsp;</span></p><ol><li class="ql-align-justify"><strong>Prospecci�n de nuevos clientes:</strong> Utiliza el M�dulo de Prospector Predictivo Comercial para identificar empresas con alto potencial de conversi�n bas�ndose en patrones de clientes actuales.</li><li class="ql-align-justify"><strong>Generaci�n de correos electr�nicos personalizados: </strong>Puede redactar correos electr�nicos orientados a resultados, incluyendo beneficios claros y medibles de soluciones de inteligencia artificial generativa.</li><li class="ql-align-justify"><strong>&nbsp;Entrenamiento en ventas consultivas:</strong> Ofrece recomendaciones sobre c�mo abordar objeciones y generar necesidades en los prospectos.</li><li class="ql-align-justify"><strong>Generaci�n de mensajes de LinkedIn:</strong> Crea guiones para mensajes cortos y profesionales, adaptados al tipo de prospecto y objetivo del mensaje.</li><li class="ql-align-justify"><strong>An�lisis de sectores e industrias:</strong> Puede identificar beneficios espec�ficos y problemas comunes en sectores determinados, as� como ofrecer soluciones personalizadas.</li></ol><p>&nbsp;</p><p><strong>�Qu� no puede hacer Bruno?</strong></p><p><span style="color: rgb(0, 0, 0);">&nbsp;</span></p><ol><li class="ql-align-justify"><strong>&nbsp;Inventar datos o informaci�n:</strong> No puede proporcionar informaci�n que no est� disponible o que no tenga base real.</li><li class="ql-align-justify"><strong>Actuar de manera independiente:</strong> No puede tomar decisiones sin la intervenci�n del usuario o sin la informaci�n necesaria.</li><li class="ql-align-justify"><strong>Redactar informaci�n sin los datos requeridos:</strong> No puede crear correos o mensajes adecuados sin contar con la informaci�n de contacto adecuada del prospecto.</li><li class="ql-align-justify"><strong>Realizar tareas fuera de su �mbito comercial:</strong> No puede involucrarse en actividades que no est�n relacionadas con la prospecci�n y generaci�n de oportunidades de ventas.</li></ol>'
WHERE Id = 59;

UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '�C�mo inicio una nueva conversaci�n?',
	Respuesta = '<p>Para iniciar una conversaci�n e interactuar con Bruno, puedes seguir estos pasos:</p><ol><li class="ql-align-justify"><strong>Presentaci�n Breve:</strong> Aunque ya sepas qui�n es Bruno y el tambi�n tome tus datos de la sesi�n que inicias, puedes mencionar tu nombre y tu rol para contextualizar la conversaci�n. </li><li class="ql-align-justify"><strong>Prop�sito de la Conversaci�n:</strong> Indica claramente el motivo por el cual deseas interactuar con Bruno. <strong>&nbsp;</strong></li><li class="ql-align-justify"><strong>Preguntas Espec�ficas:</strong> Si prefieres puedes hacer preguntas directas sobre c�mo Bruno puede ayudarte.</li></ol>'
WHERE Id = 60;

UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '�Qu� datos m�nimos necesito?',
	Respuesta = '<p class="ql-align-justify">Para interactuar de manera efectiva con Bruno y aprovechar sus capacidades, necesitar�s los siguientes datos m�nimos:</p><p class="ql-align-justify"><br></p><ol><li class="ql-align-justify"><strong>Nombre del Prospecto:</strong> El nombre de la persona con la que deseas comunicarte. Esto permite personalizar la conversaci�n.</li><li class="ql-align-justify"><strong>Nombre de la Empresa o Sitio Web:</strong> Conocer el nombre de la empresa prospecto o su sitio web ayuda a entender su giro y sector, lo cual es esencial para ofrecer soluciones relevantes.</li><li class="ql-align-justify"><strong>Sector o Industria:</strong> Si es posible, identifica el sector o industria en la que opera la empresa. Esto permitir� a Bruno generar beneficios y propuestas m�s alineadas con sus necesidades.</li><li class="ql-align-justify"><strong>Objetivo de la Conversaci�n:</strong> Define el prop�sito de tu interacci�n, ya sea para generar leads, explorar colaboraciones, o presentar soluciones espec�ficas.</li></ol><p class="ql-align-justify">&nbsp;</p><p class="ql-align-justify">Con estos datos, podr�s maximizar la efectividad de la interacci�n con Bruno y obtener resultados m�s concretos.&nbsp;</p>'
WHERE Id = 61;

UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '�Puedo pedir que Bruno enfoque el mensaje en un problema espec�fico del cliente?',
	Respuesta = '<p class="ql-align-justify">S�, puedes pedir que Bruno enfoque el mensaje en un problema espec�fico del cliente. De hecho, esto es altamente recomendable, ya que personalizar el mensaje en funci�n de un desaf�o o necesidad concreta del prospecto puede aumentar la efectividad de la comunicaci�n.</p>'
WHERE Id = 62;

UPDATE [dbo].[PreguntasFrecuentes]
SET 
    Pregunta = '�C�mo saber si Bruno entendi� bien mi solicitud?',
	Respuesta = '<p>Una vez que Bruno genere un mensaje o respuesta, rev�salo para asegurarte de que aborda correctamente tus necesidades y expectativas. Si algo no est� claro, puedes solicitar ajustes o modificaciones.</p>'
WHERE Id = 63;

UPDATE [dbo].[PreguntasFrecuentes] SET Estatus = 0 WHERE Id BETWEEN 64 AND 71;




INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,' �C�mo cambio el tono de los mensajes?' ,
		   '<p class="ql-align-justify">Escribe /tono seguido de ejecutivo, emp�tico o directo para que Bruno adapte autom�ticamente el&nbsp;vocabulario y formalidad del mensaje seg�n el tipo de cliente.</p><p><br></p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puedo guardar mi firma personal?' , 
		   '<p>No necesitas guardarla manualmente. Tu firma personal se guarda autom�ticamente cuando inicias sesi�n, ya que Bruno toma tus datos y los asocia a tu cuenta de forma segura.</p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�C�mo adapto el mensaje para distintos tipos de clientes?' , 
		   '<p>Indica el tipo de cliente (PyME, corporativo, startup) y Bruno ajustar� el enfoque.</p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puedo prohibir ciertas palabras o frases?' , 
		   '<p>S�, especifica las palabras a evitar y Bruno las excluir� de las propuestas.</p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puedo tener varios perfiles de estilo?' , 
		   '<p>S�, puedes tener varios perfiles de estilo para adaptar tus mensajes a diferentes contextos y tipos de clientes.</p>', 
		   GETDATE(), GETDATE(),  1, 22, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puede Bruno dar ejemplos de uso de IA en mi sector?' , 
		   '<p>S�, genera tres ejemplos concretos con m�tricas y resultados.</p>', 
		   GETDATE(), GETDATE(),  1, 23, 1);         
GO
INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puede adaptar un mensaje a mi industria?' , 
		   '<p><p>S�, Bruno ajusta tono y enfoque con base en las caracter�sticas de tu sector.</p>', 
		   GETDATE(), GETDATE(),  1, 23, 1);         
GO
INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�C�mo puede responder  Bruno a objeciones comunes?' , 
		   '<p>Especif�ca lo que quieres lograr e incluye la frase con la objeci�n que quieras trabajar, y recibir�s varias alternativas de respuesta para inspirarte.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puedo entrenar respuestas personalizadas?' , 
		   '<p>&nbsp;S�, proporciona el escenario y la respuesta ideal para que Bruno la memorice.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�C�mo manejo una respuesta negativa del cliente?' , 
		   '<p>Solicita opciones para mantener la conversaci�n abierta y generar nuevo inter�s.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puedo preparar objeciones para una reuni�n espec�fica?' , 
		   '<p>S�, indica el contexto y Bruno generar� respuestas alineadas al objetivo.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puede simular una conversaci�n de objeciones?' , 
		   '<p>S�, puede actuar como cliente para practicar tu manejo de objeciones.</p>', 
		   GETDATE(), GETDATE(),  1, 24, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�C�mo califica Bruno a un lead?' , 
		   '<p>Eval�a similitud, potencial de compra y facilidad de contacto.</p>', 
		   GETDATE(), GETDATE(),  1, 25, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Se integra con mi CRM?' , 
		   '<p>No, actualmente no cuenta con integraci�n directa con CRM para poder realizar acciones en el desde el bot.</p>', 
		   GETDATE(), GETDATE(),  1, 25, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puede agendar reuniones?' , 
		   '<p>No, por ahora no tiene funci�n de agenda.</p>', 
		   GETDATE(), GETDATE(),  1, 25, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Cu�ndo consume tokens Bruno?' , 
		   '<p class="ql-align-justify">En preguntas abiertas y generaci�n de textos; las FAQs y comandos fijos consumen menos.</p><p><br></p>', 
		   GETDATE(), GETDATE(),  1, 26, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�C�mo reducir el consumo de tokens?' , 
		   '<p>Usa comandos espec�ficos y aprovecha las preguntas frecuentes.</p>', 
		   GETDATE(), GETDATE(),  1, 26, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Qu� datos guarda Bruno?' , 
		   '<p class="ql-align-justify">Se guardan los siguientes datos: nombre completo, correo electr�nico, puesto, empresa y tel�fono, todo esto con el fin de personalizar tu experiencia y mantener un registro de tu interacci�n.</p><p><br></p>', 
		   GETDATE(), GETDATE(),  1, 27, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�C�mo borro mis datos?' , 
		   '<p>Los datos no se pueden borrar manualmente, ya que se toman temporalmente en la sesi�n.</p>', 
		   GETDATE(), GETDATE(),  1, 27, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�En qu� idiomas puede responder?' , 
		   '<p>Actualmente s�lo en espa�ol manteniendo coherencia y tono.</p>', 
		   GETDATE(), GETDATE(),  1, 27, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Cumple con las leyes de protecci�n de datos?' , 
		   '<p>S�, cumple con las leyes de protecci�n de datos, ya que la informaci�n se almacena �nicamente durante la sesi�n y se maneja de manera temporal y segura, sin registrarse de forma permanente.</p>', 
		   GETDATE(), GETDATE(),  1, 27, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Qu� hago si no reconoce mi pregunta?' , 
		   '<p class="ql-align-justify">Si no reconoce tu pregunta, intenta reformularla con otras palabras, ser m�s espec�fico o dividirla en preguntas m�s peque�as. Esto ayuda a entender mejor lo que necesitas y a darte una respuesta m�s precisa.</p>', 
		   GETDATE(), GETDATE(),  1, 28, 1);         
GO

INSERT INTO [dbo].[PreguntasFrecuentes]([IdBot],[Pregunta],[Respuesta],[FechaCreacion],[FechaModificacion],[Activo],[IdCategoria],[Estatus])
     VALUES
           (7,'�Puedo sugerir una nueva pregunta frecuente?' , 
		   '<p>S�, env�a tu propuesta en nuestra secci�n de comentarios al llenar la encuesta de satisfacci�n del servicio y ser� evaluada para su inclusi�n.</p>', 
		   GETDATE(), GETDATE(),  1, 28, 1);         
GO
'use strict';

const Hapi = require('hapi');
const cors = require('cors');
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const server=Hapi.server({
    port: process.env.PORT || 5000
});

var whitelist = ['https://renanbonette.comr.br', 'http://renanbonette.comr.br']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method:'POST',
    path:'/contact',
    handler:function(request,h) {
        const ref = request.headers;
        console.log(ref);
        const fromEmail = new helper.Email(request.payload.email);
        const toEmail = new helper.Email('renan.bonette@gmail.com');
        const subject = 'Contato de seu Website';
        const content = new helper.Content('text/plain', '\n Nome: '+request.payload.name+'\n Telefone: '+request.payload.phone+'\n Mensagem: '+request.payload.message);
        const mail = new helper.Mail(fromEmail, subject, toEmail, content);
        const req = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });
           
        sg.API(req, function (error, response) {
            if (error) {
                console.log('============ERRO NO ENVIO DA MENSAGEM============');
            }else{
                console.log('============SUCESSO NO ENVIO DA MENSAGEM============');
            }
            console.log('\n Email: '+request.payload.email+'\n Nome: '+request.payload.name+'\n Telefone: '+request.payload.phone+'\n Mensagem: '+request.payload.message);
            console.log('========================================================');
        });
        return true;
    }
});

server.route({
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    method:'GET',
    path:'/hello',
    handler:function(request,h) {
        return'hello world';
    }
});

async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();
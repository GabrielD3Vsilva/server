const paypal = require('paypal-rest-sdk');

async function AcessVip(req, res) {
    await paypal.configure({
        'mode': 'sandbox', // Se estiver em ambiente de teste, use 'sandbox'
        'client_id': 'AV4FfHqT0Z0Wj6FqqaUbvdhIv_DtXvgkLyy4rs8GxOhH7YK2jRlPJRZTRp8WDDgsuF6C-CDdvShNlRIy',
        'client_secret': 'EPAysymXtoBB3EYkiTnQuQfg7x8eQSLvo_vq8e3XP_Kkbwwx6Gfdt2T4s9Ti0TDssxYp3dPo-xKWmRo9'
    });

    const pagamento = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
            return_url: 'https://localhost:5173/', // URL para redirecionamento após pagamento aprovado
            cancel_url: 'https://localhost:5173/', // URL para redirecionamento após pagamento cancelado
        },
        "transactions": [{
          "item_list": {
            "items": [{
              "name": "Produto",
              "sku": "001",
              "price": "30.00",
              "currency": "BRL",
              "quantity": 1
            }]
          },
          "amount": {
            "currency": "BRL",
            "total": "10.00"
          },
          "description": "Descrição do pagamento"
        }]
      };
    
      await paypal.payment.create(pagamento, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let link of payment.links) {
            if (link.rel === 'approval_url') {
              console.log(link.href);

              res.send(link.href);
              // Aqui você pode usar o link para redirecionar o usuário para o pagamento
            }
          }
        }
      });
}

async function consult (req, res) {
  const {idClient, idProfissional} = req.body;

  console.log(idClient, idProfissional);

  await paypal.configure({
    'mode': 'sandbox', // Se estiver em ambiente de teste, use 'sandbox'
    'client_id': 'AV4FfHqT0Z0Wj6FqqaUbvdhIv_DtXvgkLyy4rs8GxOhH7YK2jRlPJRZTRp8WDDgsuF6C-CDdvShNlRIy',
    'client_secret': 'EPAysymXtoBB3EYkiTnQuQfg7x8eQSLvo_vq8e3XP_Kkbwwx6Gfdt2T4s9Ti0TDssxYp3dPo-xKWmRo9'
});

const pagamento = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      return_url: `http://localhost:5173/aprovedConsult/${idClient}/${idProfissional}`, // URL para redirecionamento após pagamento aprovado
      cancel_url: 'http://localhost:5173/', // URL para redirecionamento após pagamento cancelado
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Produto",
          "sku": "001",
          "price": "50.00",
          "currency": "BRL",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "BRL",
        "total": "10.00"
      },
      "description": "Descrição do pagamento"
    }]
  };

  await paypal.payment.create(pagamento, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let link of payment.links) {
        if (link.rel === 'approval_url') {
          console.log(link.href);

          res.send(link.href);
          // Aqui você pode usar o link para redirecionar o usuário para o pagamento
        }
      }
    }
  });
}

module.exports = { AcessVip, consult };









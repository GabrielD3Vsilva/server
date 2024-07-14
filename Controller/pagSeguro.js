const { MercadoPagoConfig, Preference } = require('mercadopago');

const db = require('../Db/db');

async function AcessVip(req, res) {
  const {email} = req.body;

  console.log(email);
  const client = new MercadoPagoConfig({ accessToken: "APP_USR-1767806761428068-070620-771a230aa8ff67512387deefe1bd14ef-192552961"});
    
  const preference = new Preference(client);
  
  const body = {
      items: [
          {
          id: '1',
          title: 'Trabalhe sendo Vip',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 30,
          }
      ], back_urls: {
        success: `https://diasemterapia.com.br/aprovedVip/`,
        failure: `https://diasemterapia.com.br/await/`,
        pending: `https://diasemterapia.com.br/await/`
    }
  };

  await preference.create({body}).then((response)=>{
    console.log(response.init_point);
    res.send(response.init_point)
  });
}

async function consult (req, res) {
  const {idClient, idProfissional} = req.body;
  console.log(idClient, idProfissional);

  const profissional = await db.User.find({_id: idProfissional});
  let nameProfissional;

  if(profissional.length > 0) {
    nameProfissional = profissional[0].number;
    console.log(nameProfissional);
  }

  const client = new MercadoPagoConfig({ accessToken: "APP_USR-8001012963880387-060323-f0c75667b991ec28f96a9ea24f04e48e-1840600103"});
    
  const preference = new Preference(client);
  
  const body = {
    items: [
      {
        title: 'Consulta',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 50.00
      }
    ],
    payment_methods: {
      excluded_payment_types: [
        { id: 'ticket' }, // Excluir métodos de pagamento que não sejam Pix
        { id: 'credit_card' }
      ],
      default_payment_method_id: 'pix'
    },
    back_urls: {
      success: `https://diasemterapia.com.br/aprovedConsult/${idClient}/${idProfissional}`,
      failure: `https://diasemterapia.com.br/`,
      pending: `https://diasemterapia.com.br/`
    },
    auto_return: 'approved'
  };

  await preference.create({body}).then(async (response)=>{
    console.log(response.init_point);
    
    res.send(response.init_point)
  });
}



module.exports = { AcessVip, consult };
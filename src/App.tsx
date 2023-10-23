import React, { useState } from 'react';
import visaBackground from '/visa-background.webp';
import americanExpressBackground from '/american-background.webp';
import masterCardBackground from '/mastercard-background.webp';
import unknown from '/unknown.webp';

import visaLogo from '/visa.png';
import americanExpressLogo from '/american.png';
import masterCardLogo from '/mastercard.png';

import contactless from '/contactless.png';
import chip from '/chip.png';

import visaSvg from '/visa.svg';
import americanSvg from '/american.svg';
import mastercardSvg from '/mastercard.svg';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    cardNumber: '',
    expiration: '',
    cvc: '',
    isCardFlipped: false,
  });

  let backgroundImageStyle = {
    backgroundImage: '',
    transition: 'background-image 0.5s', // Add the transition property directly here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'fullName') {
      const input = e.target.value
        .replace(/[^a-zA-Z\s]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      if (input.length <= 30) {
        setFormData({ ...formData, [e.target.name]: input });
      }
    } else if (e.target.name === 'cardNumber') {
      const input = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
      if (input.length <= 16) {
        const formattedInput = input.replace(/(\d{4})/g, '$1 ').trim();
        setFormData({ ...formData, [e.target.name]: formattedInput });
      }
    } else if (e.target.name === 'expiration') {
      const input = e.target.value.replace(/\D/g, '').slice(0, 4);
      if (input.length > 2) {
        const formattedInput = `${input.slice(0, 2)}/${input.slice(2)}`;
        setFormData({ ...formData, [e.target.name]: formattedInput });
      } else {
        setFormData({ ...formData, [e.target.name]: input });
      }
    } else if (e.target.name === 'cvc') {
      const input = e.target.value.replace(/\D/g, '').slice(0, 3);
      setFormData({ ...formData, [e.target.name]: input });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const preventNonNumericInput = (e: React.KeyboardEvent<Element>) => {
    const target = e.currentTarget as HTMLInputElement;
    if (target.name === 'fullName' && /\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const identifyCardType = (cardNumber: string) => {
    const patterns = [
      {
        mask: '0000 0000 0000 0000',
        regex: '^4\\d{0,15}',
        cardtype: 'visa',
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '^3[47]\\d{0,13}',
        cardtype: 'american',
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
        cardtype: 'mastercard',
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '',
        cardtype: 'unknown',
      },
    ];

    for (const pattern of patterns) {
      if (cardNumber.match(pattern.regex)) {
        return pattern.cardtype;
      }
    }
    return 'unknown';
  };

  const cardType = identifyCardType(formData.cardNumber);
  let backgroundImage;
  let cardLogo;
  let cardIcon;

  if (cardType === 'visa') {
    backgroundImage = visaBackground;
    cardLogo = visaLogo;
    cardIcon = visaSvg;
    backgroundImageStyle = {
      ...backgroundImageStyle,
      backgroundImage: `url(${visaBackground})`,
    };
  } else if (cardType === 'american') {
    backgroundImage = americanExpressBackground;
    cardLogo = americanExpressLogo;
    cardIcon = americanSvg;
    backgroundImageStyle = {
      ...backgroundImageStyle,
      backgroundImage: `url(${americanExpressBackground})`,
    };
  } else if (cardType === 'mastercard') {
    backgroundImage = masterCardBackground;
    cardLogo = masterCardLogo;
    cardIcon = mastercardSvg;
    backgroundImageStyle = {
      ...backgroundImageStyle,
      backgroundImage: `url(${masterCardBackground})`,
    };
  } else if (cardType === 'unknown') {
    backgroundImage = unknown;
    backgroundImageStyle = {
      ...backgroundImageStyle,
      backgroundImage: `url(${unknown})`,
    };
  }

  const handleRandomCardGeneration = () => {
    const prefixes = ['3742', '3782', '5425', '5251', '4917', '4509'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let randomCardNumber = randomPrefix;
    for (let i = 0; i < 12; i++) {
      randomCardNumber += Math.floor(Math.random() * 10);
    }
    const formattedCardNumber = randomCardNumber.replace(/(\d{4})/g, '$1 ').trim();

    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomYear = Math.floor(Math.random() * (35 - 22 + 1)) + 22;
    const expiration = `${String(randomMonth).padStart(2, '0')}/${randomYear}`;
    const randomCVC = Math.floor(100 + Math.random() * 900);
    const names = ['Jose Lopez', 'Mirtha Valencia', 'Joaquin del Solar', 'Micaela Velazquez Reinoso', 'Cristina Vertolici', 'Cristina Vertolici', 'Juan Bautista Cuban', 'Enrique Certuli'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    setFormData({ ...formData, fullName: randomName, cardNumber: formattedCardNumber, expiration: expiration, cvc: String(randomCVC) });
  };

  return (
    <div className="contenedor flex justify-center gap-4 items-center contain">
      <div className="tarjeta relative shadow-2xl shadow-[#16192E] z-30 bg-transparent stroke-1 scale-75 border-gray-200 w-[650px] mx-auto h-[420px] rounded-3xl" style={backgroundImageStyle}>
        <div className="w-full h-full absolute top-0 left-0 rounded-3xl bg-cover card-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="card p-12 flex flex-col justify-between h-full">
            <div className="flex items-end justify-between">
              <img src={chip} alt="Chip" className="h-16 w-22" />

              <div className="flex flex-col items-end gap-4">
                <img className="h-10 w-26" src={cardLogo} alt="" />
                <img className="h-14 w-14" src={contactless} alt="" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                {Array.from({ length: 4 }).map((_, index) => {
                  const group = formData.cardNumber.replace(/\s/g, '').substring(index * 4, index * 4 + 4);
                  return (
                    <p className="text-white text-5xl font-mono my-12" key={index}>
                      {group ? group.padEnd(4, '•') : '••••'}
                    </p>
                  );
                })}
              </div>
              <div className="flex justify-between nombres">
                <p className="text-2xl text-white font-mono">
                  {formData.fullName.length > 0
                    ? formData.fullName.toUpperCase()
                        .split('')
                        .map((char, index) => (index <= formData.fullName.length - 1 ? char : '•'))
                        .join('')
                    : 'NOMBRE Y APELLIDO'}
                </p>
                <p className="text-white text-2xl font-mono">
                  {formData.expiration
                    ? `${formData.expiration.slice(0, 2).replace(/\//g, '').padEnd(2, '•')}/${formData.expiration.slice(2).replace(/\//g, '').padEnd(2, '•')}`
                    : '••/••'}
                </p>
              </div>
              <p className="text-white text-2xl font-mono">
                {formData.cvc ? formData.cvc.slice(0, 3).padEnd(3, '•') : '•••'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 w-2/5">
        <label htmlFor="cardNumber" className='text-xs text-gray-500'>Número de tarjeta</label>
        <input
          id='cardNumber'
          placeholder="1234 1234 1234 1234"
          type="text"
          name="cardNumber"
          autoComplete="false"
          onChange={handleInputChange}
          className="m-0 bg-slate-100 rounded-md border py-2 px-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none sm:text-sm pr-10"
          style={{
            backgroundImage: `url(${cardIcon})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '98% center',
            backgroundSize: '8%',
          }}
          maxLength={19}
          value={formData.cardNumber}
        />
        <label htmlFor="fullName" className='text-xs text-gray-500'>Nombre del titular</label>
        <input
          id='fullName'
          placeholder="Ej.: Fernando Bell"
          autoComplete="false"
          type="text"
          name="fullName"
          onChange={handleInputChange}
          onKeyPress={preventNonNumericInput}
          className="m-0 bg-slate-100 rounded-md border py-2 px-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none sm:text-sm"
          value={formData.fullName}
        />
        <div className='flex gap-4'>
          <div className='w-2/4'>
            <label htmlFor="expiration" className='text-xs text-gray-500'>Vencimiento</label>
            <input
              id='expiration'
              placeholder="MM/AA"
              autoComplete="false"
              type="text"
              name="expiration"
              onChange={handleInputChange}
              className="m-0 bg-slate-100 rounded-md border py-2 px-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none sm:text-sm w-full"
              maxLength={5}
              value={formData.expiration}
            />
          </div>
          <div className='w-2/4'>
            <label htmlFor="cvc" className='text-xs text-gray-500'>Código de seguridad</label>
            <input
              id='cvc'
              placeholder="123"
              autoComplete="false"
              type="text"
              name="cvc"
              onChange={handleInputChange}
              onKeyPress={preventNonNumericInput}
              className="bg-slate-100 rounded-md border py-2 px-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none sm:text-sm m-0 w-full"
              maxLength={4}
              value={formData.cvc}
            />
          </div>
        </div>
        <input
          type="submit"
          className="rounded-md bg-indigo-600 border py-2 px-4 text-white placeholder-gray-400 focus:ring-2 hover:bg-indigo-900 cursor-pointer outline-none sm:text-sm transition ease-in-out duration-150"
          value="Pagar"
        />
        <button
          onClick={handleRandomCardGeneration}
          className="random rounded-md py-2 px-4 text-indigo-600 placeholder-gray-400 focus:ring-2 hover:bg-indigo-600 hover:text-white cursor-pointer outline-none sm:text-sm transition ease-in-out duration-150"
        >
          Generar Informacion Random
        </button>
      </div>
    </div>
  );
}

export default App;

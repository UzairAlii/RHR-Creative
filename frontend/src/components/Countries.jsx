import React, { useContext } from 'react';
import { shopContext } from '../context/ShopContext';

const countries = {
  'NORTH AMERICA': ['Canada', 'United States'],
  'LATIN AMERICA': ['Brazil', 'Guatemala', 'Mexico'],
  'EUROPE': [
    'Austria', 'Belgium', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany',
    'Greece', 'Hungary', 'Ireland', 'Italy', 'Luxembourg', 'Netherlands', 'Norway', 'Poland', 'Portugal',
    'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'Ukraine', 'Serbia', 'Croatia'
  ],
  'ASIA': [
    'India', 'China', 'Japan', 'South Korea', 'Indonesia', 'Thailand', 'Philippines', 'Malaysia',
    'Vietnam', 'Singapore', 'Bangladesh', 'Pakistan', 'Sri Lanka', 'Nepal', 'Myanmar', 'Kazakhstan'
  ],
  'ARAB COUNTRIES': [
    'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman', 'Bahrain', 'Jordan',
    'Lebanon', 'Iraq', 'Syria', 'Yemen', 'Palestine', 'Egypt', 'Morocco', 'Algeria', 'Tunisia', 'Libya'
  ],
  'AFRICA': ['South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia', 'Morocco', 'Egypt'],
  'OCEANIA': ['Australia', 'New Zealand', 'Fiji'],
  'NON-COMMERCE': ['Rest of the World', 'Middle East']
};

const currencyMap = {
  'United States': 'USD',
  'Canada': 'CAD',
  'Brazil': 'BRL',
  'Guatemala': 'GTQ',
  'Mexico': 'MXN',
  'Austria': 'EUR',
  'Belgium': 'EUR',
  'Czech Republic': 'CZK',
  'Denmark': 'DKK',
  'Estonia': 'EUR',
  'Finland': 'EUR',
  'France': 'EUR',
  'Germany': 'EUR',
  'Greece': 'EUR',
  'Hungary': 'HUF',
  'Ireland': 'EUR',
  'Italy': 'EUR',
  'Luxembourg': 'EUR',
  'Netherlands': 'EUR',
  'Norway': 'NOK',
  'Poland': 'PLN',
  'Portugal': 'EUR',
  'Romania': 'RON',
  'Slovakia': 'EUR',
  'Slovenia': 'EUR',
  'Spain': 'EUR',
  'Sweden': 'SEK',
  'Switzerland': 'CHF',
  'United Kingdom': 'GBP',
  'Ukraine': 'UAH',
  'Serbia': 'RSD',
  'Croatia': 'HRK',
  'India': 'INR',
  'China': 'CNY',
  'Japan': 'JPY',
  'South Korea': 'KRW',
  'Indonesia': 'IDR',
  'Thailand': 'THB',
  'Philippines': 'PHP',
  'Malaysia': 'MYR',
  'Vietnam': 'VND',
  'Singapore': 'SGD',
  'Bangladesh': 'BDT',
  'Pakistan': 'PKR',
  'Sri Lanka': 'LKR',
  'Nepal': 'NPR',
  'Myanmar': 'MMK',
  'Kazakhstan': 'KZT',
  'Saudi Arabia': 'SAR',
  'United Arab Emirates': 'AED',
  'Qatar': 'QAR',
  'Kuwait': 'KWD',
  'Oman': 'OMR',
  'Bahrain': 'BHD',
  'Jordan': 'JOD',
  'Lebanon': 'LBP',
  'Iraq': 'IQD',
  'Syria': 'SYP',
  'Yemen': 'YER',
  'Palestine': 'ILS',
  'Egypt': 'EGP',
  'Morocco': 'MAD',
  'Algeria': 'DZD',
  'Tunisia': 'TND',
  'Libya': 'LYD',
  'South Africa': 'ZAR',
  'Nigeria': 'NGN',
  'Kenya': 'KES',
  'Ghana': 'GHS',
  'Ethiopia': 'ETB',
  'Australia': 'AUD',
  'New Zealand': 'NZD',
  'Fiji': 'FJD',
  'Rest of the World': 'USD',
  'Middle East': 'AED'
};

const Countries = () => {
  const { updateCurrency } = useContext(shopContext);

  const handleClick = async (country) => {
    alert(`Selected country: ${country}`);

    const targetCurrency = currencyMap[country] || 'USD';

      localStorage.setItem("selectedCountry", country);

    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/PKR`);
      const data = await response.json();

      if (data.result === 'success') {
        const rate = data.rates[targetCurrency];

        if (rate) {
          updateCurrency(targetCurrency, rate); 
        } else {
          console.log(`Exchange rate for ${targetCurrency} not found.`);
        }
      } else {
        console.log('Failed to fetch exchange rates.');
      }
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Select the location you would like to ship to:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Object.entries(countries).map(([region, countryList]) => (
          <div key={region}>
            <h3 className="font-bold text-gray-700 mb-2 border-b border-gray-300 pb-1 uppercase">
              {region}
            </h3>
            <ul className="space-y-1">
              {countryList.map((country) => (
                <li key={country}>
                  <button
                    onClick={() => handleClick(country)}
                    className="text-black hover:underline focus:outline-none"
                  >
                    {country}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Countries;

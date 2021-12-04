import countryCardTpl from "./templates/country.hbs"
import countryListTpl from "./templates/flag-and-name.hbs"
import debounce from "lodash.debounce"
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const refs = {
inputCountry: document.querySelector('[id = search-box]'), 
countryInfo: document.querySelector('.country-info'),
countryList: document.querySelector('.country-list')
}

const onInputValue = (e) => {
  let x = ''
  x = e.target.value
  if (x === '') {
    onCleanFindCountries()
    return
  }

  fetch(`https://restcountries.com/v3.1/name/${x.trim()}?fields=name,capital,population,flags,languages`)

  .then(response => {
      return response.json()
    })

    .then(country => {
      
      if (country.length > 10)
      {
        onManySuitable()
        onCleanFindCountries()
        return
      }

      if (country.length === 1) {
        onCleanFindCountries()
        const markup = countryCardTpl(country)
        refs.countryInfo.innerHTML = markup
        return
      }

      if (country.status === 404) {
        onCleanFindCountries()
        onError()
        return
      }

      onCleanFindCountries()
      const markup = country.map(countryListTpl).join('')
      refs.countryList.innerHTML = markup
      })

    .catch(error => {
    });

}

function onFetchCountries() {
  
}

function onManySuitable() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function onError(){
  Notify.failure('Oops, there is no country with that name.');
}

function onCleanFindCountries(){
  refs.countryList.innerHTML=''
  refs.countryInfo.innerHTML=''
}


refs.inputCountry.addEventListener('input', debounce(onInputValue, 500))
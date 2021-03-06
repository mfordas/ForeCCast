import Cities from './Cities';
import * as fullName from './ISO3166';

class Search {
  constructor(formID, selectID, inputID, defCity) {
    this._cities = new Cities();
    this._select = document.getElementById(selectID);
    this._input = document.getElementById(inputID);
    this._form = document.getElementById(formID);
    this._button = document.getElementById('map-button');

    this._selectedCountry = defCity.country;
    this._selectedCity = defCity;

    this._input.value = this._selectedCity.name;
    this._countryCities = this._cities.getCountryCities(this._selectedCountry);

    this._sugestionsDiv = document.createElement('div');
    this._sugestionsDiv.setAttribute('id', 'sugestion');
    this._sugestionsDiv.setAttribute('class', 'sugestionItem');
    this._input.parentNode.appendChild(this._sugestionsDiv);

    this._button.addEventListener('click', () => {
      let map = document.getElementById('world-map');
      map.hidden = !map.hidden;
    });

    this.initSelect();
    this.autocomplete();
  }

  initSelect() {
    this._cities.getAllCountries().forEach(element => {
      let option = document.createElement('option');
      option.value = element;
      option.text = fullName.getFullCountryName(element);
      this._select.add(option);
    });

    this._select.selectedIndex = this._cities.getAllCountries().indexOf(this._selectedCountry);

    this._select.addEventListener('change', () => {
      this._input.value = '';
      this._selectedCountry = this._select.options[this._select.selectedIndex].value;
      this._countryCities = this._cities.getCountryCities(this._selectedCountry);
    });
  }

  getSelectedCity() {
    return this._selectedCity;
  }

  getCityByName(name, lat = 0, lng = 0) {
    return this._cities.getByName(name, lat, lng);
  }

  setCity(city) {
    this._selectedCountry = city.country;
    this._selectedCity = city;
    this._input.value = this._selectedCity.name;
    this._countryCities = this._cities.getCountryCities(this._selectedCountry);
    this._select.selectedIndex = this._cities.getAllCountries().indexOf(this._selectedCountry);
  }

  setCountry(country) {
    this._input.value = '';
    this._selectedCountry = country;
    this._countryCities = this._cities.getCountryCities(this._selectedCountry);
    this._select.selectedIndex = this._cities.getAllCountries().indexOf(this._selectedCountry);
  }

  // getCityByPosition(lat,lng) {
  //   return this._cities.getByPosition(lat, lng);
  // }

  autocomplete() {
    let listLength = 0;
    let maxListLength = 10;
    let currentFocus;

    this._input.addEventListener('input', () => {
      if (!this._input.value) {
        return false;
      }
      currentFocus = -1;
      closeAllLists();
      let counter = 0;
      listLength = counter;

      this._countryCities.forEach(element => {
        if (element.name.substr(0, this._input.value.length).toUpperCase() == this._input.value.toUpperCase()) {
          if (counter < maxListLength) {
            let sugestionsElementDiv = document.createElement('div');
            sugestionsElementDiv.setAttribute('class', 'dropdown-item');

            sugestionsElementDiv.innerHTML =
              '<strong>' + element.name.substr(0, this._input.value.length) + '</strong>';
            sugestionsElementDiv.innerHTML += element.name.substr(this._input.value.length);

            sugestionsElementDiv.innerHTML += "<input type='hidden' value='" + element.name + "'>";
            sugestionsElementDiv.addEventListener('click', () => {
              this._input.value = sugestionsElementDiv.getElementsByTagName('input')[0].value;
              this._selectedCity = element;
              closeAllLists();
              console.log(element);
            });
            this._sugestionsDiv.appendChild(sugestionsElementDiv);
            sugestionsElementDiv.addEventListener('mouseover', () => {
              removeActive();
              sugestionsElementDiv.setAttribute('id', 'sugestionActive');
            });
            counter++;
            listLength = counter;
          }
        }
      });
    });

    this._input.addEventListener('keydown', event => {
      if (event.keyCode == 40) {
        currentFocus++;
        if (currentFocus >= listLength) currentFocus = 0;
        addActive(this._sugestionsDiv.children[currentFocus]);
      } else if (event.keyCode == 38) {
        currentFocus--;
        if (currentFocus < 0) currentFocus = listLength - 1;
        addActive(this._sugestionsDiv.children[currentFocus]);
      } else if (event.keyCode == 13) {
        event.preventDefault();
        if (currentFocus > -1) {
          if (this._sugestionsDiv.children[currentFocus]) {
            this._sugestionsDiv.children[currentFocus].click();
          }
        }
      }
    });

    const addActive = element => {
      if (!element) return false;
      removeActive();
      if (currentFocus >= this._sugestionsDiv.children.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = this._sugestionsDi.children.length - 1;
      element.setAttribute('id', 'sugestionActive');
    };
    const removeActive = () => {
      for (let i = 0; i < this._sugestionsDiv.children.length; i++) {
        this._sugestionsDiv.children[i].removeAttribute('id');
      }
    };

    const closeAllLists = () => {
      while (this._sugestionsDiv.firstChild) {
        this._sugestionsDiv.removeChild(this._sugestionsDiv.firstChild);
      }
    };

    //Czy nie będzie przechwytywać wszysctkich kliknięć / klikac elementy pod lista propozycji?
    document.addEventListener(
      'click',
      event => {
        if (event.target !== this._sugestionsDiv) closeAllLists();
      } /*true*/,
    );
  }
}

export default Search;

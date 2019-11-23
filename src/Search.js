import Cities from './Cities';

class Search {
  constructor(selectID, inputID, defCountry = "PL", defCity = "Warsaw") {
    this._cities = new Cities();
    this._select = document.getElementById(selectID);
    this._input = document.getElementById(inputID);

    // this._selectedCountry = defCountry;
    this._selectedCity = null;
    // this._selectedLat = 0;
    // this._selectedLng = 0;

    this._input.value = this._selectedCity;
    this._select.value = defCountry;
    this._countryCities = this._cities.getCountryCities(this._selectedCountry);
    // this._countryCitiesNames = this._cities.getCountryCitiesNames(this._selectedCountry);


    this._sugestionsDiv = document.createElement("div");
    this._sugestionsDiv.setAttribute("id", "sugestion");                  
    this._sugestionsDiv.setAttribute("class", "sugestionItem");
    this._input.parentNode.appendChild(this._sugestionsDiv);
  
    this.initSelect();
    this.autocomplete();
  }

  initSelect() {
    this._cities.getAllCountries().forEach(element => {
      let option = document.createElement("option");
      option.value = element;
      option.text = element;
      this._select.add(option);
    });

    this._select.selectedIndex = this._cities.getAllCountries().indexOf(this._selectedCountry);

    this._select.addEventListener("change", () => {
      this._input.value = "";
      this._selectedCountry = this._select.options[this._select.selectedIndex].value;
      this._countryCities = this._cities.getCountryCities(this._selectedCountry);
    });
}

  // getSelectedCoutry() {
  //   return this._selectedCountry;
  // }

  getSelectedCity() {
    return this._selectedCity;
  }

  // getSelectedLng() {
  //   return this._selectedLat;
  // }

  // getSelectedLat() {
  //   return this._selectedLng;
  // }
  
autocomplete() {
      let currentFocus;

      this._input.addEventListener("input", () => {
    
      if (!this._input.value) { return false;}
      currentFocus = -1;
      closeAllLists();
      let counter = 0;

      this._countryCities.forEach(element => {

        if (element.name.substr(0, this._input.value.length).toUpperCase() == this._input.value.toUpperCase()) {
          
          let sugestionsElementDiv = document.createElement("div");

          sugestionsElementDiv.innerHTML = "<strong>" + element.name.substr(0, this._input.value.length) + "</strong>";
          sugestionsElementDiv.innerHTML += element.name.substr(this._input.value.length);

          sugestionsElementDiv.innerHTML += "<input type='hidden' value='" + element.name + "'>";
          sugestionsElementDiv.addEventListener("click", () => {
            this._input.value = sugestionsElementDiv.getElementsByTagName("input")[0].value;
            this._selectedCity = element;
            closeAllLists();
          });
          if(counter<10) {
           this._sugestionsDiv.appendChild(sugestionsElementDiv);
           counter++;
          }
        }
      });
  });


  this._input.addEventListener("keydown", (event) => {
      if (event.keyCode == 40) {
        currentFocus++;
        console.log(this._sugestionsDiv.children[currentFocus]);
        addActive(this._sugestionsDiv.children[currentFocus]);
      } else if (event.keyCode == 38) {
        currentFocus--;
        addActive(this._sugestionsDiv.children[currentFocus]);
      } else if (event.keyCode == 13) {
        event.preventDefault();
        if (currentFocus > -1) {
          if (this._sugestionsDiv.children[currentFocus]) {this._sugestionsDiv.children[currentFocus].click();}
        }
      }
  });

  const addActive = (element) => {
    if (!element) return false;
    removeActive();
    if (currentFocus >= this._sugestionsDiv.children.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (this._sugestionsDi.children.length - 1);
    element.classList.add("sugestionActive");
  }
  const removeActive = () => {
    for (let i = 0; i < this._sugestionsDiv.children.length; i++) {
      this._sugestionsDiv.children[i].classList.remove("sugestionActive");
    }
  }

  const closeAllLists = () => {
  while (this._sugestionsDiv.firstChild) {
    this._sugestionsDiv.removeChild( this._sugestionsDiv.firstChild);
  }
}
/*execute a function when someone clicks in the document:*/

//Czy nie będzie przechwytywać wszysctkich kliknięć / klikac elementy pod lista propozycji?
document.addEventListener("click",  (event) => {
    if(event.target !== this._sugestionsDiv)
    closeAllLists();
}/*true*/);
}

}

export default Search;
document.addEventListener('DOMContentLoaded', () => {
  const pokeListElement = document.getElementById('pokeList');
  const loadMoreButton = document.getElementById('loadMore');
  const loadLessButton = document.getElementById('loadLess');

  let offset = 0;

  async function fetchPokemonData() {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`);
      const data = await response.json();

      for (const pokemon of data.results) {
        await fetchPokemonDetails(pokemon.url);
      }

      offset += 10;
    } catch (error) {
      console.error('Erro ao obter dados dos Pokémon:', error);
    }
  }

  async function fetchPokemonDetails(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      createPokemonCard(data);
    } catch (error) {
      console.error('Erro ao obter detalhes do Pokémon:', error);
    }
  }

  function createPokemonCard(pokemon) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const imgElement = document.createElement('img');
    imgElement.src = pokemon.sprites.front_default;
    imgElement.alt = pokemon.name;

    const contentElement = document.createElement('div');
    contentElement.classList.add('content');

    const nameElement = document.createElement('h2');
    nameElement.textContent = pokemon.name;

    const typesElement = document.createElement('p');
    const typesText = pokemon.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ');
    typesElement.textContent = `Tipo(s): ${typesText}`;

    const detailsElement = document.createElement('p');
    detailsElement.textContent = `Altura: ${pokemon.height / 10} m | Peso: ${pokemon.weight / 10} kg`;

    contentElement.appendChild(nameElement);
    contentElement.appendChild(typesElement);
    contentElement.appendChild(detailsElement);

    cardElement.appendChild(imgElement);
    cardElement.appendChild(contentElement);

    cardElement.style.backgroundColor = getColorForType(pokemon.types[0].type.name);

    // Adiciona evento de clique ao card
    cardElement.addEventListener('click', () => {
      showPopup(pokemon);
    });

    pokeListElement.appendChild(cardElement);
  }

  function showPopup(pokemon) {
  const popupElement = document.createElement('div');
  popupElement.classList.add('popup', 'yugioh-card');

  const closeButton = document.createElement('span');
  closeButton.innerHTML = '<i class="fas fa-times"></i>';
  closeButton.classList.add('close-button');

  closeButton.addEventListener('click', () => {
    popupElement.remove();
  });

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  const cardImage = document.createElement('img');
  cardImage.src = pokemon.sprites.front_default;
  cardImage.alt = pokemon.name;
  cardImage.classList.add('card-image');

  const cardDetails = document.createElement('div');
  cardDetails.classList.add('card-details');

  const nameElement = document.createElement('h2');
  nameElement.textContent = pokemon.name;

  const abilitiesList = createList('Habilidades', pokemon.abilities, 3, 'white');
  const movesList = createList('Poderes', pokemon.moves, 3, 'white');

  cardDetails.appendChild(nameElement);
  cardDetails.appendChild(abilitiesList);
  cardDetails.appendChild(movesList);

  cardContent.appendChild(cardImage);
  cardContent.appendChild(cardDetails);

  popupElement.appendChild(closeButton);
  popupElement.appendChild(cardContent);

  popupElement.style.backgroundColor = getColorForType(pokemon.types[0].type.name);

  // Adiciona gif como plano de fundo
  popupElement.style.backgroundImage = 'url("https://cdn.discordapp.com/attachments/971775487426855025/1174806965533282477/25af00c8c44664f497a8be5cca807281.gif?ex=6568ef3f&is=65567a3f&hm=33bebc29e10ae37448c341e6a5a59fc002d33e981b9734e64cc27908eb4e1523&)';
  popupElement.style.backgroundSize = 'cover';
  popupElement.style.backgroundRepeat = 'no-repeat';

  document.body.appendChild(popupElement);
}

function createList(title, items, limit, textColor) {
  const listContainer = document.createElement('div');
  listContainer.classList.add('pokemon-font');

  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  listContainer.appendChild(titleElement);

  const list = document.createElement('ul');
  list.style.color = textColor; // Define a cor do texto

  for (let i = 0; i < Math.min(limit, items.length); i++) {
    const listItem = document.createElement('li');
    listItem.textContent = items[i].ability?.name || items[i].move?.name || 'Sem nome';
    list.appendChild(listItem);
  }

  listContainer.appendChild(list);

  return listContainer;
}


  function getColorForType(type) {
    const typeColors = {
      normal: '#A8A878',
      fighting: '#C03028',
      flying: '#A890F0',
      poison: '#A040A0',
      ground: '#E0C068',
      rock: '#B8A038',
      bug: '#A8B820',
      ghost: '#705898',
      steel: '#B8B8D0',
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      psychic: '#F85888',
      ice: '#98D8D8',
      dragon: '#7038F8',
      dark: '#705848',
      fairy: '#EE99AC',
    };

    return typeColors[type] || '#A8A878';
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  loadMoreButton.addEventListener('click', () => {
    fetchPokemonData();
  });

  loadLessButton.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');
    const numCardsToRemove = Math.min(10, cards.length);

    for (let i = 0; i < numCardsToRemove; i++) {
      const cardToRemove = cards[cards.length - 1];
      cardToRemove.remove();
    }

    offset = Math.max(0, offset - 10);
  });

  fetchPokemonData();
});

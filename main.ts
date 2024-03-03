interface Bundesland {
    name: string,
    population: number,
    url: string
}

let firstCharacters: string[];
let data: Bundesland[];
let filterElementIsActive: boolean;

const getBundeslaenderData = () => {
    return fetch('bundesland.json')
        .then(res => res.json())
        .catch(err => console.log('Failed to load data: ', err));
}

document.addEventListener('DOMContentLoaded', async () => {
    await getData();
    renderCards();
    renderFilter();
});

async function getData() {
    handleLoader('show');
    data = await getBundeslaenderData();
    handleLoader('hide');
}

function renderCards() {
    const cardsContainer = document.querySelector('.cards-container');
    const div = document.createElement('div');
    div.classList.add('bundesland-cards');

    for (const bundesland of data) {
        div.innerHTML += bundeslandCardTemplate(bundesland);
    }

    cardsContainer.appendChild(div);
}

function bundeslandCardTemplate(bundesland: Bundesland): string {
    return `
        <a class="bundesland-card-link" href="${bundesland.url}" target="_blank">
            <h2>${bundesland.name}</h2>
            <p class="population">${bundesland.population} Millionen</p>
        </a>
    `;
}

function handleLoader(action: 'show' | 'hide') {
    if (action === 'show') {
        renderLoader();
    } else {
        if (document.querySelector('.loader-overlay')) {
            document.querySelector('.loader-overlay').remove();
        }
    }
}

function renderLoader() {
    const loaderOverlay = document.createElement('div');
    loaderOverlay.classList.add('loader-overlay');

    const loader = document.createElement('span');
    loader.classList.add('loader');
    loaderOverlay.append(loader);

    document.querySelector('.container').append(loaderOverlay);
}

function renderFilter() {
    firstCharacters = setFirstCharacter(data);
    const filterContainer = document.querySelector('.filter-container');

    const div = document.createElement('div');
    div.classList.add('filter-items');

    for (let i = 0; i < firstCharacters.length; i++) {
        const firstChar = firstCharacters[i];
        const filterItem = document.createElement('span');

        filterItem.classList.add('filter-item');
        filterItem.id = `filter-item${i}`;
        filterItem.textContent = firstChar;
        filterItem.setAttribute('onclick', `filterBundeslaender(${i})`);

        div.append(filterItem);
    }

    filterContainer.append(div);
}

function setFirstCharacter(data: Bundesland[]): string[] {
    const firstCharacters = [];
    data.forEach(bundesland => {
        if (!firstCharacters.includes(bundesland.name[0])) {
            firstCharacters.push(bundesland.name[0]);
        }
    })
    return firstCharacters;
}

function filterBundeslaender(i: number) {
    toggleFilterButton(i);
    const cardsContainer = document.querySelector('.cards-container');
    const div = document.createElement('div');
    div.classList.add('bundesland-cards');

    document.querySelector('.bundesland-cards').remove();
    if (filterElementIsActive) {
        for (const bundesland of data) {
            if (bundesland.name[0] === firstCharacters[i]) {
                div.innerHTML += bundeslandCardTemplate(bundesland);
            }
        }
    } else {
        for (const bundesland of data) {
            div.innerHTML += bundeslandCardTemplate(bundesland);
        }
    }
    cardsContainer.append(div);
}

function toggleFilterButton(i: number) {
    const currentButton = document.getElementById(`filter-item${i}`);
    const isActive = currentButton.classList.contains('filter-item-active');
    const allButtons = document.querySelectorAll('.filter-item');

    allButtons.forEach(button => {
        if (button.classList.contains('filter-item-active')) {
            button.classList.remove('filter-item-active');
        }
    })

    if (!isActive) {
        currentButton.classList.add('filter-item-active');
        filterElementIsActive = true;
    } else {
        filterElementIsActive = false;
    }
}
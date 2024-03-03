interface Bundesland {
    name: string,
    population: number,
    url: string
}

const getBundeslaenderData = () => {
    return fetch('bundesland.json')
        .then(res => res.json())
        .catch(err => console.log('Failed to load data: ', err));
}

document.addEventListener('DOMContentLoaded', renderTemplate);

async function renderTemplate() {
    const data = await getBundeslaenderData();
    const contentContainer = document.querySelector('.container');
    const div = document.createElement('div');
    div.classList.add('bundesland-cards');

    for (const bundesland of data) {
        div.innerHTML += bundeslandCardTemplate(bundesland);
    }

    contentContainer.appendChild(div);
}

function bundeslandCardTemplate(bundesland: Bundesland): string {
    return `
        <a class="bundesland-card-link" href="${bundesland.url}" target="_blank">
            <h2>${bundesland.name}</h2>
            <p class="population">${bundesland.population} Millionen</p>
        </a>
    `;
}

export async function buildCatalogueCards() {
    try {
        const response = await fetch('data/catalogue.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const items = data.catalogue.slice(0, 15);

        const container = document.getElementById('catalogueCards');
        if (!container) throw new Error('Not found.');

        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('catalogue-card');

            const title = document.createElement('h2');
            title.textContent = item.name;

            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.loading = 'lazy';
            figure.appendChild(img);

            const button = document.createElement('button');
            button.textContent = 'Learn More';
            button.classList.add('learn-more-btn');

            const dialog = document.createElement('dialog');
            dialog.classList.add('item-dialog');

            const dialogProvider = document.createElement('p');
            dialogProvider.textContent = item.provider;
            dialogProvider.style.fontWeight = 'bold';

            const dialogDesc = document.createElement('p');
            dialogDesc.textContent = item.description;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.addEventListener('click', () => dialog.close());
            closeBtn.style.marginRight = '10px';

            const scheduleBtn = document.createElement('a');
            scheduleBtn.href = 'schedule.html';
            scheduleBtn.textContent = 'Schedule Appointment';
            scheduleBtn.classList.add('schedule-link');
            scheduleBtn.style.textDecoration = 'none';
            scheduleBtn.style.backgroundColor = 'var(--hg)';
            scheduleBtn.style.color = 'var(--text)';
            scheduleBtn.style.padding = '10px 15px';
            scheduleBtn.style.border = '1px solid var(--text)';
            scheduleBtn.style.borderRadius = '5px';

            dialog.appendChild(dialogProvider);
            dialog.appendChild(dialogDesc);
            dialog.appendChild(closeBtn);
            dialog.appendChild(scheduleBtn);

            button.addEventListener('click', () => dialog.showModal());

            card.appendChild(title);
            card.appendChild(figure);
            card.appendChild(button);
            container.appendChild(card);
            container.appendChild(dialog);
        });
    } catch (error) {
        console.error('Error building catalogue cards:', error);
    }
}


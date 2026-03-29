export const restaurantRow = (restaurant) => {
    // 1. Destructuring properties
    const { name, company, address } = restaurant;

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${name}</td>
        <td>${company}</td>
        <td>${address}</td>
    `;
    return tr;
};

// Generate modal content for a restaurant and its menu
export const restaurantModal = (restaurant, menu) => {
    //Destructuring restaurant object
    const { name, address, postalCode, city, phone, company } = restaurant;
    // Destructuring menu object
    const { courses } = menu;

    let menuHtml = '<ul>';
    courses.forEach((course) => {
        // Use ternary operator to handle missing prices or diets
        const priceStr = course.price ? `${course.price} €` : '? €';
        const dietStr = course.diets ? `(${course.diets})` : '';
        
        menuHtml += `<li><strong>${course.name}</strong>, ${priceStr} ${dietStr}</li>`;
    });
    menuHtml += '</ul>';

    return `
        <h1>${name}</h1>
        <p><strong>${company}</strong></p>
        <p>${address}</p>
        <p>${postalCode}, ${city}</p>
        <p>${phone}</p>
        <hr>
        <h3>Today's Menu</h3>
        ${menuHtml}
    `;
};
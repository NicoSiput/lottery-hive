const searchPortfolio = (keyword, portfolios) => {
  const filteredData = portfolios.filter((portfolio) => {
    let filterTech = portfolio.listTech.filter((tech) => {
      return tech.name.toUpperCase().includes(keyword.toUpperCase());
    });

    if (filterTech.length > 0) {
      filterTech = true;
    } else {
      filterTech = false;
    }

    return (
      portfolio.title.toUpperCase().includes(keyword.toUpperCase()) ||
      filterTech
    );
  });
  if (filteredData.length) {
    return Promise.resolve(filteredData);
  } else {
    return Promise.reject(keyword);
  }
};

const searchActivities = (keyword, activities) => {
  const filteredData = activities.filter((activity) => {
    // search title
    const byTitle = activity.title
      .toUpperCase()
      .includes(keyword.toUpperCase());

    // search by category
    const byCategory = activity.categoryActivity.name
      .toUpperCase()
      .includes(keyword.toUpperCase());

    // search by organizer
    const byOrganizer = activity.organizer.name
      .toUpperCase()
      .includes(keyword.toUpperCase());

    return byTitle || byCategory || byOrganizer;
  });

  if (filteredData.length) {
    return Promise.resolve(filteredData);
  } else {
    return Promise.reject(keyword);
  }
};

const callbackSearch = (wrapper, data) => {
  if (data.total) {
    // founded data
    if (data.keyword.length > 0) {
      window.scroll(0, 200);
      wrapper.innerHTML = `Result: ${data.total} data found with keyword <span>${data.keyword}<span>`;
    } else {
      wrapper.innerHTML = "";
    }
  } else {
    // not founded data
    wrapper.innerHTML = `
    <div class="search-notfound p-3 text-center">
    <h1>Ooops !</h1> <br />
    <span class="not-found">${data.keyword}</span>  not found ! <br />
    Please try another keyword...</div>`;
  }
};

export { searchActivities, searchPortfolio, callbackSearch };
